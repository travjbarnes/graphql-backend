import { QueryResolvers } from "../generated/graphqlgen";
import { checkPersonExists, getPersonId } from "../utils";

export const Query: QueryResolvers.Type = {
  ...QueryResolvers.defaultResolvers,
  groups: (parent, args, ctx) => {
    const id = getPersonId(ctx);
    return ctx.prisma.person({ id }).groups({ orderBy: "createdAt_DESC" });
  },
  group: (parent, { id }, ctx) => {
    return ctx.prisma.group({ id });
  },
  me: (parent, args, ctx) => {
    const id = getPersonId(ctx);
    return ctx.prisma.person({ id });
  },
  searchGroups: (parent, { searchQuery }, ctx) => {
    checkPersonExists(ctx);
    return ctx.prisma.groups({
      where: {
        name_contains: searchQuery
      }
    });
  },
  // One day it'd be nice to order these by most recent thread.
  // It's not supported by Prisma at the moment so we do it client-side.
  threads: (parent, { groupId }, ctx) => {
    return ctx.prisma.threads({
      where: {
        group: {
          id: groupId
        }
      },
      orderBy: "createdAt_DESC"
    });
  },
  posts: (parent, { threadId }, ctx) => {
    return ctx.prisma.posts({
      where: {
        thread: {
          id: threadId
        }
      },
      orderBy: "createdAt_DESC"
    });
  }
};
