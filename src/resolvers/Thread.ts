import { ThreadResolvers } from "../generated/graphqlgen";

export const Thread: ThreadResolvers.Type = {
  ...ThreadResolvers.defaultResolvers,
  posts: (parent, { first, last }, ctx) => {
    first = first || undefined;
    last = last || undefined;
    return ctx.prisma
      .thread({
        id: parent.id
      })
      .posts({ first, last });
  },
  group: (parent, args, ctx) =>
    ctx.prisma
      .thread({
        id: parent.id
      })
      .group()
};
