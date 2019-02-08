import { getPersonId } from '../utils'
import { QueryResolvers } from '../generated/graphqlgen';

export const Query: QueryResolvers.Type = {
  ...QueryResolvers.defaultResolvers,
  groups: (parent, args, ctx) => {
    const id = getPersonId(ctx)
    return ctx.prisma.person({id}).groups()
  },
  group: (parent, {id}, ctx) => {
    return ctx.prisma.group({id})
  },
  me: (parent, args, ctx) => {
    const id = getPersonId(ctx)
    return ctx.prisma.person({ id })
  }
}
