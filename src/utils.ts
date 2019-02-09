import * as bcrypt from "bcryptjs";
import { Context } from "graphql-yoga/dist/types";
import * as jwt from "jsonwebtoken";

export function getPersonId(ctx: Context) {
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

/**
 * Verifies that the user is a member of the group with `groupId`.
 * If not, throws an `AuthError`.
 */
export async function checkGroupMembership(
  ctx: Context,
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
