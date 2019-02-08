import { getPersonId, checkGroupMembership } from '../../utils';
import { MutationResolvers } from '../../generated/graphqlgen';

export const thread: Pick<MutationResolvers.Type, "createThread" | "editThread" | "deleteThread"> = {
  createThread: (parent, { groupId, title, content }, ctx, info) => {
    const userId = getPersonId(ctx)
    checkGroupMembership(ctx, groupId)

    return ctx.prisma.createThread({
      title,
      posts: {
        create: {
          author: {
            connect: {
              id: userId
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
    })
  },

  editThread: async (parent, {threadId, title}, ctx, info) => {
    const groupId = await ctx.prisma.thread({
      id: threadId
    }).group().id()
    checkGroupMembership(ctx, groupId)
    return await ctx.prisma.updateThread({
      where: {
        id: threadId
      },
      data: {
        title
      }
    })
  },

  deleteThread: async (parent, {threadId}, ctx, info) => {
    const groupId = await ctx.prisma.thread({
      id: threadId
    }).group().id()
    checkGroupMembership(ctx, groupId)
    const thread = await ctx.prisma.deleteThread({
      id: threadId
    })
    return {
      id: threadId,
      success: true,
      message: `Successfully deleted thread`
    }
  }
}