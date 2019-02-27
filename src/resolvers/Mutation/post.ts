import { MutationResolvers } from "../../generated/graphqlgen";
import { AuthError, getPersonId } from "../../utils";

export const post: Pick<
  MutationResolvers.Type,
  "createPost" | "editPost" | "deletePost"
> = {
  createPost: async (parent, { threadId, content }, ctx, info) => {
    const personId = getPersonId(ctx);
    const isGroupMember = await ctx.prisma.$exists.group({
      members_some: {
        id: personId
      },
      threads_some: {
        id: threadId
      }
    });
    if (!isGroupMember) {
      throw new AuthError();
    }

    return ctx.prisma.createPost({
      content,
      firstPost: false,
      author: {
        connect: {
          id: personId
        }
      },
      thread: {
        connect: {
          id: threadId
        }
      }
    });
  },

  editPost: async (parent, { postId, content }, ctx, info) => {
    const personId = getPersonId(ctx);
    const isAuthor = await ctx.prisma.$exists.post({
      id: postId,
      author: {
        id: personId
      }
    });
    if (!isAuthor) {
      throw new AuthError();
    }
    return await ctx.prisma.updatePost({
      where: {
        id: postId
      },
      data: {
        content
      }
    });
  },

  deletePost: async (parent, { postId }, ctx, info) => {
    const personId = getPersonId(ctx);
    const isAuthor = await ctx.prisma.$exists.post({
      id: postId,
      author: {
        id: personId
      }
    });
    if (!isAuthor) {
      throw new AuthError();
    }
    await ctx.prisma.deletePost({
      id: postId
    });

    return {
      id: postId,
      success: true,
      message: `Successfully deleted post`
    };
  }
};
