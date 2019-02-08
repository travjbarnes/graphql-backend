import { getPersonId, checkGroupMembership } from '../../utils'
import { MutationResolvers } from '../../generated/graphqlgen';

export const group: Pick <MutationResolvers.Type, "createGroup" | "joinGroup" | "leaveGroup"> = {

  createGroup: (parent, {name, description}, ctx, info) => {
    const userId = getPersonId(ctx)
    return ctx.prisma.createGroup({
      name,
      description: description as string | undefined,
      members: {
        connect: {id: userId}
      }
    })
  },

  joinGroup: (parent, {groupId}, ctx, info) => {
    const userId = getPersonId(ctx)
    return ctx.prisma.updateGroup({
      data: {
        members: {
          connect: {id: userId}
        }
      },
      where: {
        id: groupId
      }
    })
  },

  leaveGroup: async (parent, {groupId}, ctx, info) => {
    const userId = getPersonId(ctx)
    checkGroupMembership(ctx, groupId)

    const group = await ctx.prisma.updateGroup({
      where: {id: groupId},
      data: {
        members: {
          disconnect: {
            id: userId
          }
        }
      }
    })
    return {
      id: group.id,
      success: true,
      message: `Successfully left group ${group.name}`
    }
  }
}
