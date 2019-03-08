import request, { GraphQLClient } from "graphql-request";

import { PORT, startServer, stopServer } from "../server";
import { getLoginMutation, getSearchQuery } from "../testutils";
import { GroupSearchResponse } from "../types";

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

describe("search", async () => {
  it("cannot search without auth", async () => {
    const search = async () => {
      return await request(HOST, getSearchQuery("test search"));
    };
    expect(search()).rejects.toThrow();
  });

  it("can search simple substrings in titles", async () => {
    const groups = await aliceClient
      .request(getSearchQuery("group"))
      .then((r: any) => r.searchGroups as GroupSearchResponse[]);
    expect(groups.length).toEqual(2); // both groups from seed data
  });

  it("can search simple substrings in descriptions", async () => {
    const groups = await aliceClient
      .request(getSearchQuery("testing"))
      .then((r: any) => r.searchGroups as GroupSearchResponse[]);
    expect(groups.length).toEqual(2);
  });

  it("can normalize lexemes", async () => {
    // one group has the word "supernova" in its description
    const groups = await aliceClient
      .request(getSearchQuery("supernovae"))
      .then((r: any) => r.searchGroups as GroupSearchResponse[]);
    expect(groups.length).toEqual(1);
  });

  it("removes stop words", async () => {
    const groups = await aliceClient
      .request(getSearchQuery("the"))
      .then((r: any) => r.searchGroups as GroupSearchResponse[]);
    expect(groups.length).toEqual(0);
  });

  it("returns nothing", async () => {
    const groups = await aliceClient
      .request(getSearchQuery("gibberish"))
      .then((r: any) => r.searchGroups as GroupSearchResponse[]);
    expect(groups.length).toEqual(0);
  });
});

afterAll(async () => {
  await stopServer();
});
