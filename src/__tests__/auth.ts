import { request } from "graphql-request";

import { PORT, startServer, stopServer } from "../server";
import { getSignupMutation } from "../testutils";

const HOST = `http://localhost:${PORT}`;

beforeAll(async () => {
  await startServer();
});

let email = "demo@demo";
const name = "demo user";
let password = "demopassword";

describe("authentication", async () => {
  test("invalidEmail", async () => {
    email = "demo@demo";
    // jest can't handle `toThrow` in promises normally, hence the odd structure of this check
    // https://github.com/facebook/jest/issues/1700
    const check = async () => {
      return await request(HOST, getSignupMutation(email, name, password));
    };
    expect(check()).rejects.toThrow();
  });

  test("shortPassword", async () => {
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
