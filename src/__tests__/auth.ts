import { request } from "graphql-request";

import { port, startServer, stopServer } from "../server";

const HOST = `http://localhost:${port}`;

const getSignupMutation = (
  mutationEmail: string,
  mutationName: string,
  mutationPass: string
) => `
  mutation {
      signup(email: "${mutationEmail}", password: "${mutationPass}", name: "${mutationName}") {
          token
          person {
              id
          }
      }
  }
`;

beforeAll(async () => {
  await startServer();
});

let email = "demo@demo";
const name = "demo user";
let password = "demopassword";

describe("authentication", () => {
  test("invalidEmail", async () => {
    email = "demo@demo";
    // jest can't handle `toThrow` in promises normally, hence the odd structure of this check
    // https://github.com/facebook/jest/issues/1700
    const check = async () => {
      return await request(HOST, getSignupMutation(email, name, password));
    };
    expect(check()).rejects.toThrow();
  });

  test("shortPassword", () => {
    password = "123456789";
    const check = async () => {
      return await request(HOST, getSignupMutation(email, name, password));
    };
    expect(check()).rejects.toThrow();
  });
});

afterAll(async () => {
  await stopServer();
});
