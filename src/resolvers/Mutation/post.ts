import { getPersonId, AuthError } from '../../utils';
import { MutationResolvers } from '../../generated/graphqlgen';

export const post: Pick<MutationResolvers.Type, "createPost" | "editPost" | "deletePost"> = {
  createPost: async (parent, {threadId, content }, ctx, info) => {
    const userId = getPersonId(ctx)
    const isGroupMember = await ctx.prisma.$exists.group({
        members_some: {
            id: userId
        },
        threads_some: {
            id: threadId
        }
    })
    if (!isGroupMember) {
        throw new AuthError()
    }

    return ctx.prisma.createPost({
      content,
      author: {
        connect: {
          id: userId
        }
      },
      thread: {
        connect: {
          id: threadId
        }
      }
    })
  },

  editPost: async (parent, {postId, content}, ctx, info) => {
    const userId = getPersonId(ctx)
    const isAuthor = await ctx.prisma.$exists.post({
      id: postId,
      author: {
        id: userId
      }
    })
    if (!isAuthor) {
      throw new AuthError()
    }
    return await ctx.prisma.updatePost({
      where: {
        id: postId
      },
      data: {
        content
      }
    })
  },

  deletePost: async (parent, {postId}, ctx, info) => {
    const userId = getPersonId(ctx)
    const isAuthor = await ctx.prisma.$exists.post({
      id: postId,
      author: {
        id: userId
      }
    })
    if (!isAuthor) {
      throw new AuthError()
    }
    const post = await ctx.prisma.deletePost({
      id: postId
    })

    return {
      id: postId,
      success: true,
      message: `Successfully deleted post`
    }
  }
}
