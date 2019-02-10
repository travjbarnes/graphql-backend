import { QueryResolvers } from "../generated/graphqlgen";
import { checkPersonExists, getPersonId } from "../utils";

export const Query: QueryResolvers.Type = {
  ...QueryResolvers.defaultResolvers,
  groups: (parent, args, ctx) => {
    const id = getPersonId(ctx);
    return ctx.prisma.person({ id }).groups();
  },
  group: (parent, { id }, ctx) => {
    return ctx.prisma.group({ id });
  },
  me: (parent, args, ctx) => {
    const id = getPersonId(ctx);
    return ctx.prisma.person({ id });
  },
  searchGroups: (parent, { searchQuery }, ctx) => {
    checkPersonExists(ctx);
    return ctx.prisma.groups({
      where: {
        name_contains: searchQuery
      }
    });
  }
};
