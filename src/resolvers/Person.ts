import { PersonResolvers } from "../generated/graphqlgen";

export const Person: PersonResolvers.Type = {
  ...PersonResolvers.defaultResolvers,
  // TODO: lock down some info to only the person themself
  groups: (parent, args, ctx) =>
    ctx.prisma
      .person({
        id: parent.id
      })
      .groups()
};
