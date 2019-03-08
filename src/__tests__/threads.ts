import request, { GraphQLClient } from "graphql-request";

import { Group, Thread } from "../generated/prisma-client";
import { PORT, startServer, stopServer } from "../server";
import { getLoginMutation, getSearchQuery } from "../testutils";

const HOST = `http://localhost:${PORT}`;
let aliceClient: GraphQLClient;
let bobClient: GraphQLClient;

beforeAll(async () => {
  await startServer();

  // Users defined in prisma/seed.graphql
  const aliceToken = await request(HOST, getLoginMutation("alice@wobbly.app", "secret42")).then(
    (response: any) => response.login.token
  );
  aliceClient = new GraphQLClient(HOST, {
    headers: { Authorization: `Bearer ${aliceToken}` }
  });
  const bobToken = await request(HOST, getLoginMutation("bob@wobbly.app", "secret43")).then(
    (response: any) => response.login.token
  );
  bobClient = new GraphQLClient(HOST, {
    headers: { Authorization: `Bearer ${bobToken}` }
  });
});

describe("threads", () => {
  it("can create a thread", async () => {
    const threadTitle = "Test thread";
    const threadContent = "Test content";
    const groupId = await aliceClient.request(`query { groups { id } }`).then((r: any) => r.groups[0].id as string);
    const threadId = await aliceClient
      .request(
        `mutation { createThread(groupId: "${groupId}", title: "${threadTitle}", content: "${threadContent}") { id } }`
      )
      .then((r: any) => r.createThread.id as string);
    const thread = await aliceClient
      .request(
        `
      query {
        threads(groupId: "${groupId}") {
          id
          title
          posts {
            content
          }
        }
      }
      `
      )
      .then((r: any) => r.threads.filter((t: Partial<Thread>) => t.id === threadId)[0]);
    expect(thread.title).toEqual(threadTitle);
    expect(thread.posts[0].content).toEqual(threadContent);
  });

  it("can pin/unpin a thread", async () => {
    const groupId = await aliceClient.request("query { groups { id } }").then((r: any) => r.groups[0].id as string);
    let thread = await aliceClient
      .request(`query { threads(groupId: "${groupId}") { id, pinned } }`)
      .then((r: any) => r.threads[0] as Partial<Thread>);
    expect(thread.pinned).toBe(false);

    thread = await aliceClient
      .request(`mutation { toggleThreadPinning(threadId: "${thread.id}") { id, pinned } }`)
      .then((r: any) => r.toggleThreadPinning as Partial<Thread>);
    expect(thread.pinned).toBe(true);

    thread = await aliceClient
      .request(`mutation { toggleThreadPinning(threadId: "${thread.id}") { id, pinned } }`)
      .then((r: any) => r.toggleThreadPinning as Partial<Thread>);
    expect(thread.pinned).toBe(false);
  });
});

afterAll(async () => {
  await stopServer();
});
