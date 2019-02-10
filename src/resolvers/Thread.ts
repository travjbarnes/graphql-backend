import { ThreadResolvers } from "../generated/graphqlgen";

export const Thread: ThreadResolvers.Type = {
  ...ThreadResolvers.defaultResolvers,
  posts: (parent, { first }, ctx) => {
    first = first || undefined;
    return ctx.prisma
      .thread({
        id: parent.id
      })
      .posts({ first });
  },
  group: (parent, args, ctx) =>
    ctx.prisma
      .thread({
        id: parent.id
      })
      .group()
};
