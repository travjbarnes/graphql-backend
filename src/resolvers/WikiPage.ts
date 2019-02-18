import { WikiPageResolvers } from "../generated/graphqlgen";

export const WikiPage: WikiPageResolvers.Type = {
  ...WikiPageResolvers.defaultResolvers,
  updatedAt: (parent, args, ctx) =>
    ctx.prisma
      .wikiPage({ id: parent.id })
      .content({ orderBy: "createdAt_DESC", first: 1 })
      .then(content => content[0].createdAt),
  title: (parent, args, ctx) =>
    ctx.prisma
      .wikiPage({ id: parent.id })
      .content({ orderBy: "createdAt_DESC", first: 1 })
      .then(content => content[0].title),
  content: (parent, args, ctx) =>
    ctx.prisma
      .wikiPage({ id: parent.id })
      .content({ orderBy: "createdAt_DESC", first: 1 })
      .then(content => content[0].content)
};
