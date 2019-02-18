import { GroupResolvers } from "../generated/graphqlgen";

export const Group: GroupResolvers.Type = {
  ...GroupResolvers.defaultResolvers,
  // TODO: lock down some info to only members of the group
  members: (parent, args, ctx) =>
    ctx.prisma
      .group({
        id: parent.id
      })
      .members(),
  threads: (parent, args, ctx) =>
    ctx.prisma
      .group({
        id: parent.id
      })
      .threads(),
  memberCount: (parent, args, ctx) =>
    ctx.prisma
      .groupsConnection({ where: { id: parent.id } })
      .aggregate()
      .count(),
  mainWikiPageId: (parent, args, ctx) =>
    ctx.prisma
      .wikiPages({
        where: {
          group: {
            id: parent.id
          },
          mainPage: true
        },
        first: 1
      })
      .then(pages => pages[0].id) // there's only ever one main page
};
