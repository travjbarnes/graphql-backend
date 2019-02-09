import { MutationResolvers } from "../../generated/graphqlgen";
import { checkGroupMembership, getPersonId } from "../../utils";

export const thread: Pick<
  MutationResolvers.Type,
  "createThread" | "editThread" | "deleteThread"
> = {
  createThread: (parent, { groupId, title, content }, ctx, info) => {
    const personId = getPersonId(ctx);
    checkGroupMembership(ctx, groupId);

    return ctx.prisma.createThread({
      title,
      posts: {
        create: {
          author: {
            connect: {
              id: personId
            }
          },
          content
        }
      },
      group: {
        connect: {
          id: groupId
        }
      }
    });
  },

  editThread: async (parent, { threadId, title }, ctx, info) => {
    const groupId = await ctx.prisma
      .thread({
        id: threadId
      })
      .group()
      .id();
    checkGroupMembership(ctx, groupId);
    return await ctx.prisma.updateThread({
      where: {
        id: threadId
      },
      data: {
        title: title as string | undefined
      }
    });
  },

  deleteThread: async (parent, { threadId }, ctx, info) => {
    const groupId = await ctx.prisma
      .thread({
        id: threadId
      })
      .group()
      .id();
    checkGroupMembership(ctx, groupId);
    await ctx.prisma.deleteThread({
      id: threadId
    });
    return {
      id: threadId,
      success: true,
      message: `Successfully deleted thread`
    };
  }
};
