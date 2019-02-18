import { QueryResolvers } from "../generated/graphqlgen";
import { checkGroupMembership, checkPersonExists, getPersonId } from "../utils";

export const Query: QueryResolvers.Type = {
  ...QueryResolvers.defaultResolvers,
  groups: (parent, args, ctx) => {
    const id = getPersonId(ctx);
    return ctx.prisma.person({ id }).groups({ orderBy: "createdAt_DESC" });
  },
  group: (parent, { id }, ctx) => ctx.prisma.group({ id }),
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
  threads: async (parent, { groupId }, ctx) => {
    await checkGroupMembership(ctx, groupId);
    return ctx.prisma.threads({
      where: {
        group: {
          id: groupId
        }
      },
      orderBy: "createdAt_DESC"
    });
  },
  posts: async (parent, { threadId }, ctx) => {
    const groupId = await ctx.prisma
      .thread({ id: threadId })
      .group()
      .id();
    await checkGroupMembership(ctx, groupId);
    return ctx.prisma.posts({
      where: {
        thread: {
          id: threadId
        }
      },
      orderBy: "createdAt_DESC"
    });
  },
  wikiPages: async (parent, { groupId }, ctx) => {
    await checkGroupMembership(ctx, groupId);
    return ctx.prisma.wikiPages({
      where: {
        group: {
          id: groupId
        }
      }
    });
  }
};
