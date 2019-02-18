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
  const aliceToken = await request(
    HOST,
    getLoginMutation("alice@wobbly.app", "secret42")
  ).then((response: any) => response.login.token);
  aliceClient = new GraphQLClient(HOST, {
    headers: { Authorization: `Bearer ${aliceToken}` }
  });

  const bobToken = await request(
    HOST,
    getLoginMutation("bob@wobbly.app", "secret43")
  ).then((response: any) => response.login.token);
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
  aliceGroupId = await aliceClient
    .request(groupsQuery)
    .then((response: any) => response.groups[0].id);
  bobGroupId = await bobClient
    .request(groupsQuery)
    .then((response: any) => response.groups[0].id);
});

describe("wiki pages", async () => {
  test("create page", async () => {
    const createWikiPageMutation = `
      mutation {
        createWikiPage(groupId: "${aliceGroupId}", title: "Test wiki page", content: "Lorem ipsum") {
          id
        }
      }
    `;
    const pageId = aliceClient
      .request(createWikiPageMutation)
      .then((response: any) => response.createWikiPage.id);
    expect(pageId).resolves.toBeTruthy();

    // const unauthorizedCreatePage = async () => {
    //   const response = await bobClient.request(createWikiPageMutation)
    // }
    // expect(await unauthorizedCreatePage()).rejects.toThrow()
  });

  test("list pages", async () => {
    const pagesQuery = `
      query {
        wikiPages(groupId: "${aliceGroupId}") {
          id
        }
      }
    `;
    const pageId = aliceClient
      .request(pagesQuery)
      .then((response: any) => response.wikiPages[0].id);
    expect(pageId).resolves.toBeTruthy();

    // const unauthorizedQuery = async () => {
    //   return await bobClient.request(pagesQuery);
    // };
    // expect(await unauthorizedQuery()).rejects.toThrow();
  });

  test("edit page", async () => {
    const pagesQuery = `
      query {
        wikiPages(groupId: "${aliceGroupId}") {
          id
        }
      }
    `;
    const pageId = await aliceClient
      .request(pagesQuery)
      .then((response: any) => response.wikiPages[0].id);

    const editPageMutation = `
      mutation {
        editWikiPage(pageId: "${pageId}", title: "Test wiki page - new title", content: "Lorem ipsum 2") {
          id
          title
          content
        }
      }
    `;
    const updatedPage = await aliceClient
      .request(editPageMutation)
      .then((response: any) => response.editWikiPage);
    expect(updatedPage.title).toEqual("Test wiki page - new title");
    expect(updatedPage.content).toEqual("Lorem ipsum 2");

    // const unauthorizedEdit = async () => {
    //   return await bobClient.request(editPageMutation)
    // }
    // expect(await unauthorizedEdit()).rejects.toThrow()
  });

  test("soft delete page", async () => {
    const pagesQuery = `
      query {
        wikiPages(groupId: "${aliceGroupId}") {
          id
        }
      }
    `;
    const pageId = await aliceClient
      .request(pagesQuery)
      .then((response: any) => response.wikiPages[0].id);

    const deletePageMutation = `
      mutation {
        deleteWikiPage(pageId: "${pageId}") {
          success
        }
      }
    `;
    const success = await aliceClient
      .request(deletePageMutation)
      .then((response: any) => response.deleteWikiPage.success);
    expect(success).toBeTruthy();

    // const unauthorizedDelete = async () => {
    //   return await bobClient.request(deletePageMutation)
    // }
    // expect(await unauthorizedDelete()).rejects.toThrow()
  });
});

afterAll(async () => {
  await stopServer();
});
