import { MutationResolvers } from "../../generated/graphqlgen";
import { checkGroupMembership, getPersonId } from "../../utils";

export const thread: Pick<
  MutationResolvers.Type,
  "createThread" | "editThread" | "deleteThread" | "toggleThreadPinning"
> = {
  createThread: async (parent, { groupId, title, content }, ctx, info) => {
    const personId = getPersonId(ctx);
    await checkGroupMembership(ctx, groupId);

    return ctx.prisma.createThread({
      title,
      pinned: false,
      posts: {
        create: {
          author: {
            connect: {
              id: personId
            }
          },
          content,
          firstPost: true
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
    await checkGroupMembership(ctx, groupId);
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
    await checkGroupMembership(ctx, groupId);
    await ctx.prisma.deleteThread({
      id: threadId
    });
    return {
      id: threadId,
      success: true,
      message: `Successfully deleted thread`
    };
  },

  toggleThreadPinning: async (parent, { threadId }, ctx) => {
    const groupId = await ctx.prisma
      .thread({
        id: threadId
      })
      .group()
      .id();
    checkGroupMembership(ctx, groupId);
    const prevData = await ctx.prisma.thread({ id: threadId });
    return ctx.prisma.updateThread({
      where: { id: threadId },
      data: { pinned: !prevData.pinned }
    });
  }
};
