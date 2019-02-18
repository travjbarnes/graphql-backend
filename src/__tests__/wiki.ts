import request, { GraphQLClient } from "graphql-request";

import { port, startServer, stopServer } from "../server";
import { getLoginMutation } from "../testutils";

const HOST = `http://localhost:${port}`;
let aliceClient: GraphQLClient;
let bobClient: GraphQLClient;
let aliceGroupId: string;
let bobGroupId: string;

beforeAll(async () => {
  await startServer();

  // Users defined in prisma/seed.graphql
  const aliceToken = ((await request(
    HOST,
    getLoginMutation("alice@wobbly.app", "secret42")
  )) as any).login.token;
  aliceClient = new GraphQLClient(HOST, {
    headers: { Authorization: `Bearer ${aliceToken}` }
  });

  const bobToken = ((await request(
    HOST,
    getLoginMutation("bob@wobbly.app", "secret43")
  )) as any).login.token;
  bobClient = new GraphQLClient(HOST, {
    headers: { Authorization: `Bearer ${bobToken}` }
  });

  const groupsQuery = `
    query {
      groups {
        id
      }
    }
  `;
  aliceGroupId = ((await aliceClient.request(groupsQuery)) as any).groups[0].id;
  bobGroupId = ((await bobClient.request(groupsQuery)) as any).groups[0].id;
});

describe("wiki pages", () => {
  test("create page", async () => {
    const createWikiPageMutation = `
      mutation {
        createWikiPage(groupId: "${aliceGroupId}", title: "Test wiki page", content: "Lorem ipsum") {
          id
        }
      }
    `;
    const pageId = ((await aliceClient.request(createWikiPageMutation)) as any)
      .createWikiPage.id;
    expect(pageId).toBeTruthy();
  });

  test("list pages", async () => {
    const pagesQuery = `
      query {
        wikiPages(groupId: "${aliceGroupId}") {
          id
        }
      }
    `;
    const pageId = ((await aliceClient.request(pagesQuery)) as any).wikiPages[0]
      .id;
    expect(pageId).toBeTruthy();
  });

  test("edit page", async () => {
    const pagesQuery = `
      query {
        wikiPages(groupId: "${aliceGroupId}") {
          id
        }
      }
    `;
    const pageId = ((await aliceClient.request(pagesQuery)) as any).wikiPages[0]
      .id;

    const editPageMutation = `
      mutation {
        editWikiPage(pageId: "${pageId}", title: "Test wiki page - new title", content: "Lorem ipsum 2") {
          id
          title
          content
        }
      }
    `;
    const updatedPage = ((await aliceClient.request(editPageMutation)) as any)
      .editWikiPage;
    expect(updatedPage.title).toEqual("Test wiki page - new title");
    expect(updatedPage.content).toEqual("Lorem ipsum 2");
  });

  test("soft delete page", async () => {
    const pagesQuery = `
      query {
        wikiPages(groupId: "${aliceGroupId}") {
          id
        }
      }
    `;
    const pageId = ((await aliceClient.request(pagesQuery)) as any).wikiPages[0]
      .id;

    const deletePageMutation = `
      mutation {
        deleteWikiPage(pageId: "${pageId}") {
          success
        }
      }
    `;
    const success = ((await aliceClient.request(deletePageMutation)) as any)
      .deleteWikiPage.success;
    expect(success).toBeTruthy();
  });
});

afterAll(async () => {
  await stopServer();
});
