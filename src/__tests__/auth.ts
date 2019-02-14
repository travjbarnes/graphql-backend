import { request } from "graphql-request";

import { port, startServer, stopServer } from "../server";

const HOST = `http://localhost:${port}`;
beforeAll(async () => {
  await startServer();
});

describe("authentication", () => {
  test("invalidEmail", async () => {
    const email = "demo@demo";
    const name = "demo user";
    const password = "demopassword";
    const mutation = `
            mutation {
                signup(email: "${email}", password: "${password}", name: "${name}") {
                    token
                    person {
                        id
                    }
                }
            }
        `;
    const response = await request(HOST, mutation);
    expect(response).toEqual({ errors: true });
  });
});

afterAll(async () => {
  await stopServer();
});
