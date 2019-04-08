import { GraphQLClient, request } from "graphql-request";

import { prisma } from "../generated/prisma-client";
import { PORT, startServer, stopServer } from "../server";
import {
  getLoginMutation,
  getResetPasswordMutation,
  getSendPasswordResetMutation,
  getSignupMutation
} from "../testutils";
import { getPasswordHash } from "../utils";

const HOST = `http://localhost:${PORT}`;

// This user will be deleted at the end of the test suite
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
  test("Signup fails with invalid email", async () => {
    // jest can't handle `toThrow` in promises normally, hence the odd structure of this check
    // https://github.com/facebook/jest/issues/1700
    const check = async () => {
      return await request(HOST, getSignupMutation(badEmail, "invalid email user", password));
    };
    await expect(check()).rejects.toThrow();
  });

  test("Signup fails with short password", async () => {
    const check = async () => {
      return await request(HOST, getSignupMutation("shortpassword@demo.com", "short password user", shortPassword));
    };
    await expect(check()).rejects.toThrow();
  });

  test("Can request a password reset code", async () => {
    await request(HOST, getSendPasswordResetMutation(email));

    const code = await prisma.person({ email }).passwordResetCode();
    expect(code).toBeTruthy();
    expect(code.toString().length).toEqual(6);

    const expiry = await prisma.person({ email }).resetCodeValidUntil();
    expect(new Date(expiry).getTime()).toBeGreaterThan(Date.now());
  });

  test("Can reset password with valid code", async () => {
    const newPassword = "HTpmcfclYCoCcOxDPoGcKvoykxITEbhp";
    const code = await prisma.person({ email }).passwordResetCode();
    // don't use `demoClient` here since we must be able to reset the password while logged out
    await request(HOST, getResetPasswordMutation(code, newPassword, email));

    const demoToken = await request(HOST, getLoginMutation(email, newPassword)).then(
      (response: any) => response.login.token
    );
    expect(demoToken).toBeTruthy();

    // change password back for the coming tests
    const hashedPassword = await getPasswordHash(password);
    await prisma.updatePerson({
      where: {
        email
      },
      data: {
        password: hashedPassword
      }
    });
  });

  test("Cannot reset password twice in a row", async () => {
    const code = await prisma.person({ email }).passwordResetCode();
    expect(code).toBeFalsy(); // code should be unset

    const attempt = async () => {
      await request(HOST, getResetPasswordMutation(code, "anotherpass", email));
    };
    await expect(attempt()).rejects.toThrow();
  });

  test("Reset fails when code is expired", async () => {
    const aliceAttempt = async () => {
      return await request(HOST, getResetPasswordMutation("111111", "secret42", "alice@wobbly.app"));
    };
    await expect(aliceAttempt()).rejects.toThrow();
  });

  test("Reset fails when code expiry is unset", async () => {
    const bobAttempt = async () => {
      return await request(HOST, getResetPasswordMutation("111111", "secret43", "bob@wobbly.app"));
    };
    await expect(bobAttempt()).rejects.toThrow();
  });

  test("Return the same response when resetting password for real or invalid email", async () => {
    const validAttempt = async () => {
      return await request(HOST, getSendPasswordResetMutation(email));
    };
    const invalidAttempt = async () => {
      return await request(HOST, getSendPasswordResetMutation(badEmail));
    };
    const nonExistentUserAttempt = async () => {
      return await request(HOST, getSendPasswordResetMutation("notauser@demo.com"));
    };
    await expect(validAttempt()).resolves.toEqual(await invalidAttempt());
    await expect(validAttempt()).resolves.toEqual(await nonExistentUserAttempt());
  });

  test("Account locks down after too many reset attempts", async () => {
    const attemptResetPassword = async () => {
      return await request(HOST, getResetPasswordMutation("000000", password, email));
    };
    for (let i = 0; i < 4; i++) {
      expect(attemptResetPassword()).rejects.toThrow();
    }
    await request(HOST, getResetPasswordMutation("000000", password, email)).catch(err => {
      expect(err.response.errors[0].message).toBe("Please wait 10 minutes and try again");
    });
  });

  test("Account locks down after too many login attempts", async () => {
    const attemptLogin = async () => {
      return await request(HOST, getLoginMutation(email, "validbutwrongpassword123"));
    };
    for (let i = 0; i < 4; i++) {
      expect(attemptLogin()).rejects.toThrow();
    }
    await request(HOST, getLoginMutation(email, shortPassword)).catch(err => {
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

  test("Can delete own account", async () => {
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
  });
});

afterAll(async () => {
  await stopServer();
});
