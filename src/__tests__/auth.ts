import { GraphQLClient, request } from "graphql-request";

import { PORT, startServer, stopServer } from "../server";
import {
  getLoginMutation,
  getResetPasswordMutation,
  getSendPasswordResetMutation,
  getSignupMutation
} from "../testutils";

const HOST = `http://localhost:${PORT}`;

const email = "demo@wobbly.app";
const name = "demo user";
const password = "de5TJ49jfdkfjifj238f92mo";
const shortPassword = "123456789";
const badEmail = "demo@demo";
let demoClient: GraphQLClient;

beforeAll(async () => {
  await startServer();
  const demoToken = await request(HOST, getSignupMutation(email, name, password)).then(
    (response: any) => response.signup.token
  );
  demoClient = new GraphQLClient(HOST, {
    headers: { Authorization: `Bearer ${demoToken}` }
  });
});

describe("authentication", () => {
  test("Signup fails with invalid email.", async () => {
    // jest can't handle `toThrow` in promises normally, hence the odd structure of this check
    // https://github.com/facebook/jest/issues/1700
    const check = async () => {
      return await request(HOST, getSignupMutation(badEmail, name, password));
    };
    await expect(check()).rejects.toThrow();
  });

  test("Signup fails with short password.", async () => {
    const check = async () => {
      return await request(HOST, getSignupMutation(email, name, shortPassword));
    };
    await expect(check()).rejects.toThrow();
  });

  test("Account locks down after too many login attempts", async () => {
    const spamAttempts = Array.apply(null, Array(5)).map(async (val, i) => {
      return await request(HOST, getLoginMutation(email, shortPassword)).catch(err => {
        expect(err.response.errors[0].message).toBe("Incorrect email or password");
      });
    });
    await Promise.all(spamAttempts);
    await request(HOST, getLoginMutation(email, shortPassword)).catch(err => {
      expect(err.response.errors[0].message).toBe("Please wait 10 minutes and try again");
    });
  });

  test("Reset fails when code is expired.", async () => {
    const aliceAttempt = async () => {
      return await request(HOST, getResetPasswordMutation("111111", password, email));
    };
    await expect(aliceAttempt()).rejects.toThrow();
  });

  test("Send reset code same if pass or fail", async () => {
    const validAttempt = async () => {
      return await request(HOST, getSendPasswordResetMutation(email));
    };
    const invalidAttempt = async () => {
      return await request(HOST, getSendPasswordResetMutation(badEmail));
    };
    await expect(validAttempt()).resolves.toEqual(await invalidAttempt());
  });

  test("Account locks down after too many reset attempts", async () => {
    const spamAttempts = Array.apply(null, Array(4)).map(async (val, i) => {
      return await request(HOST, getResetPasswordMutation("000000", password, email)).catch(err => {
        expect(err.response.errors[0].message).toBe("Incorrect code");
      });
    });
    await Promise.all(spamAttempts);
    await request(HOST, getResetPasswordMutation("000000", password, email)).catch(err => {
      expect(err.response.errors[0].message).toBe("Please wait 10 minutes and try again");
    });
  });

  test("Email does not confirm with wrong code", async () => {
    const attempt = async () => {
      return await demoClient.request(`
        mutation {
          confirmEmail(confirmationCode: "000000") {
            name
          }
        }
      `);
    };
    await attempt().catch(err => {
      expect(err.response.errors[0].message).toBe("Incorrect code");
    });
  });
});

afterAll(async () => {
  await demoClient.request(`
    mutation {
      deletePerson(password: "${password}")
      {
        id
        success
        message
      }
    }
  `);
  await stopServer();
});
