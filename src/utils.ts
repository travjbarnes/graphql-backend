import * as jwt from 'jsonwebtoken'
import { Context } from 'graphql-yoga/dist/types';

export function getPersonId(ctx: Context) {
  const Authorization = ctx.request.get('Authorization')
  if (Authorization) {
    const token = Authorization.replace('Bearer ', '')
    const { userId: personId } = jwt.verify(token, process.env.APP_SECRET) as { userId: string }
    return personId
  }

  throw new AuthError()
}

/**
 * Verifies that the user is a member of the group with `groupId`.
 * If not, throws an `AuthError`.
 */
export async function checkGroupMembership(ctx: Context, groupId: string): Promise<void> {
  const userId = getPersonId(ctx)
  const isMember = await ctx.prisma.$exists.group({
    id: groupId,
    members_some: {
      id: userId
    }
  })
  if (!isMember) {
    throw new AuthError()
  }
}

export class AuthError extends Error {
  constructor() {
    super('Not authorized')
  }
}
