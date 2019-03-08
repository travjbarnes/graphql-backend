import request, { GraphQLClient } from "graphql-request";

import { Person } from "../generated/prisma-client";
import { PORT, startServer, stopServer } from "../server";
import { getLoginMutation } from "../testutils";

const HOST = `http://localhost:${PORT}`;
let testClient: GraphQLClient;
const email = "alice@wobbly.app";
const name = "Alice";
const password = "secret42";
const otherEmail = "notalice@wobbly.app";
const otherName = "notalice";

beforeAll(async () => {
  await startServer();

  const testToken = await request(HOST, getLoginMutation(email, password)).then(
    (response: any) => response.login.token
  );
  testClient = new GraphQLClient(HOST, {
    headers: { Authorization: `Bearer ${testToken}` }
  });
});

describe("me", () => {
  it("can edit own name", async () => {
    const me = await testClient
      .request(
        `
      query {
        me {
          id
          name
          email
        }
      }
    `
      )
      .then((r: any) => r.me as Person);

    // Edit the name
    let newName = await testClient
      .request(
        `
        mutation {
          updatePerson(
            oldPassword: "${password}",
            name: "${otherName}",
          ) {
            id
            name
            email
          }
        }
      `
      )
      .then((r: any) => r.updatePerson.name);
    expect(newName).toEqual(otherName);

    // Edit it back
    newName = await testClient
      .request(
        `
        mutation {
          updatePerson(
            oldPassword: "${password}",
            name: "${name}"
          ) {
            id
            name
            email
          }
        }
      `
      )
      .then((r: any) => r.updatePerson.name);
    expect(newName).toEqual(me.name);
  });

  it("can edit own email", async () => {
    const me = await testClient
      .request(
        `
      query {
        me {
          id
          name
          email
        }
      }
    `
      )
      .then((r: any) => r.me as Person);

    // Edit the email
    let newEmail = await testClient
      .request(
        `
        mutation {
          updatePerson(
            oldPassword: "${password}",
            email: "${otherEmail}",
          ) {
            id
            name
            email
          }
        }
      `
      )
      .then((r: any) => r.updatePerson.email);
    expect(newEmail).toEqual(otherEmail);

    // Edit it back
    newEmail = await testClient
      .request(
        `
        mutation {
          updatePerson(
            oldPassword: "${password}",
            email: "${email}"
          ) {
            id
            name
            email
          }
        }
      `
      )
      .then((r: any) => r.updatePerson.email);
    expect(newEmail).toEqual(me.email);
  });
});

afterAll(async () => {
  await stopServer();
});
