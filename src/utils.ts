import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";

import { IContext } from "./types";

export function getPersonId(ctx: IContext) {
  const Authorization = ctx.request.get("Authorization");
  if (Authorization && process.env.APP_SECRET) {
    const token: string = Authorization.replace("Bearer ", "");
    const { personId } = jwt.verify(token, process.env.APP_SECRET) as {
      personId: string;
    };
    return personId;
  }

  throw new AuthError();
}

export async function checkPersonExists(ctx: IContext) {
  const personId = getPersonId(ctx);
  const personExists = ctx.prisma.$exists.person({
    id: personId
  });
  if (!personExists) {
    throw new AuthError();
  }
}

/**
 * Verifies that the user is a member of the group with `groupId`.
 * If not, throws an `AuthError`.
 */
export async function checkGroupMembership(
  ctx: IContext,
  groupId: string
): Promise<void> {
  const personId = getPersonId(ctx);
  const isMember = await ctx.prisma.$exists.group({
    id: groupId,
    members_some: {
      id: personId
    }
  });
  if (!isMember) {
    throw new AuthError();
  }
}

export async function getPasswordHash(password: string) {
  // Auto-generates a salt, then hashes it with the password.
  // bcrypt is made specifically for password hashing.
  return await bcrypt.hash(password, 10);
}

export class AuthError extends Error {
  constructor() {
    super("Not authorized");
  }
}

/**
 * Checks Pwned Passwords, a database of passwords that have been exposed in data breaches.
 * Sends the first 5 characters of the SHA-1 hash to a remote server and receives a list of breached
 * hashes that start with those 5 characters.
 * See more: https://haveibeenpwned.com/API/v2#PwnedPasswords
 * @param password the password to check
 */
export async function isPwnedPassword(password: string): Promise<number> {
  const hasher = crypto.createHash("sha1");
  hasher.update(password);
  const hash = hasher.digest("hex");

  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${hash.slice(0, 5)}`
  ).then(r => r.text());
  const suffixes: { [suffix: string]: number } = {};
  response.split("\n").forEach(line => {
    const split = line.split(":");
    suffixes[split[0]] = parseInt(split[1], 10);
  });

  const count = suffixes[hash.toUpperCase().slice(5)] || 0;
  return count;
}
