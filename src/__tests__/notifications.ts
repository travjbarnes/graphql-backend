import request, { GraphQLClient } from "graphql-request";

import { notificationsQueue } from "../communications/notifications";
import { Group } from "../generated/prisma-client";
import { PORT, startServer, stopServer } from "../server";
import { getLoginMutation } from "../testutils";

jest.mock("../communications/expoClient");
const HOST = `http://localhost:${PORT}`;
let aliceClient: GraphQLClient;

const notificationBody = "Lorem ipsum";
const threadTitle = "Thread for notifications";
const notification = {
  body: notificationBody,
  priority: "high",
  sound: "default",
  title: `Alice in ${threadTitle}`,
  to: "ExponentPushToken[bobToken]" // bob's push token from seed data
};

beforeAll(async () => {
  await startServer();
  notificationsQueue.testMode.enter(); // https://github.com/Automattic/kue#testing

  // Users defined in prisma/seed.graphql
  const aliceToken = await request(HOST, getLoginMutation("alice@wobbly.app", "secret42")).then(
    (response: any) => response.login.token
  );
  aliceClient = new GraphQLClient(HOST, {
    headers: { Authorization: `Bearer ${aliceToken}` }
  });
});

afterEach(() => {
  notificationsQueue.testMode.clear();
});

describe("notifications", () => {
  let threadId: string;

  it("adds a notification to the queue on new thread", async () => {
    expect(notificationsQueue.testMode.jobs.length).toEqual(0);
    const groupId = await aliceClient
      .request(`query { groups { id, name } }`)
      .then((r: any) => r.groups.filter((g: Partial<Group>) => g.name === "Shared group")[0].id);
    threadId = await aliceClient
      .request(
        `mutation {
      createThread(groupId: "${groupId}", title: "${threadTitle}", content: "${notificationBody}") {
        id
      }
    }`
      )
      .then((r: any) => r.createThread.id);
    expect(notificationsQueue.testMode.jobs.length).toEqual(1);
    expect(notificationsQueue.testMode.jobs[0].type).toEqual("notificationChunk");
    expect(notificationsQueue.testMode.jobs[0].data).toEqual([notification]);
  });

  it("adds a notification to the queue on new post", async () => {
    expect(notificationsQueue.testMode.jobs.length).toEqual(0);
    await aliceClient.request(`mutation {
      createPost(threadId: "${threadId}", content: "${notificationBody}") {
        id
      }
    }`);
    expect(notificationsQueue.testMode.jobs.length).toEqual(1);
    expect(notificationsQueue.testMode.jobs[0].type).toEqual("notificationChunk");
    expect(notificationsQueue.testMode.jobs[0].data).toEqual([notification]);
  });
});

afterAll(async () => {
  notificationsQueue.testMode.exit();
  await stopServer();
});
