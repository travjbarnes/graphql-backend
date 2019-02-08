import { QueryResolvers } from "../generated/graphqlgen";
import { getPersonId } from "../utils";

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
  }
};
