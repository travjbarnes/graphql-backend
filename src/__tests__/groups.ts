import request, { GraphQLClient } from "graphql-request";

import { Group } from "../generated/prisma-client";
import { PORT, startServer, stopServer } from "../server";
import { getLoginMutation, getSearchQuery } from "../testutils";

const HOST = `http://localhost:${PORT}`;
let aliceClient: GraphQLClient;

beforeAll(async () => {
  await startServer();

  // Users defined in prisma/seed.graphql
  const aliceToken = await request(HOST, getLoginMutation("alice@wobbly.app", "secret42")).then(
    (response: any) => response.login.token
  );
  aliceClient = new GraphQLClient(HOST, {
    headers: { Authorization: `Bearer ${aliceToken}` }
  });
});

describe("groups", () => {
  it("can edit a group name", async () => {
    const group = await aliceClient
      .request(
        `
      query {
        groups {
          id
          name
          description
        }
      }
    `
      )
      .then((r: any) => r.groups[0] as Group);

    // Edit the name
    let newName = await aliceClient
      .request(
        `
      mutation {
        updateGroup(groupId: "${group.id}", name: "Test name", description: "${group.description}") {
          id
          name
          description
        }
      }
    `
      )
      .then((r: any) => r.updateGroup.name);
    expect(newName).toEqual("Test name");

    // Edit it back
    newName = await aliceClient
      .request(
        `
      mutation {
        updateGroup(groupId: "${group.id}", name: "${group.name}", description: "${group.description}") {
          id
          name
          description
        }
      }
    `
      )
      .then((r: any) => r.updateGroup.name);
    expect(newName).toEqual(group.name);
  }),
    it("can edit a group description", async () => {
      const group = await aliceClient
        .request(
          `
      query {
        groups {
          id
          name
          description
        }
      }
    `
        )
        .then((r: any) => r.groups[0] as Group);

      // Edit the description
      let newDescription = await aliceClient
        .request(
          `
      mutation {
        updateGroup(groupId: "${group.id}", name: "${group.name}", description: "Test description") {
          id
          name
          description
        }
      }
    `
        )
        .then((r: any) => r.updateGroup.description);
      expect(newDescription).toEqual("Test description");

      // Edit it back
      newDescription = await aliceClient
        .request(
          `
      mutation {
        updateGroup(groupId: "${group.id}", name: "${group.name}", description: "${group.description}") {
          id
          name
          description
        }
      }
    `
        )
        .then((r: any) => r.updateGroup.description);
      expect(newDescription).toEqual(group.description);
    });
});

afterAll(async () => {
  await stopServer();
});
