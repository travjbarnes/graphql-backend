import { MutationResolvers } from "../../generated/graphqlgen";
import { checkGroupMembership, getPersonId } from "../../utils";

export const group: Pick<
  MutationResolvers.Type,
  "createGroup" | "joinGroup" | "leaveGroup"
> = {
  createGroup: (parent, { name, description }, ctx, info) => {
    const personId = getPersonId(ctx);
    return ctx.prisma.createGroup({
      name,
      description: description as string | undefined,
      members: {
        connect: { id: personId }
      }
    });
  },

  joinGroup: (parent, { groupId }, ctx, info) => {
    const personId = getPersonId(ctx);
    return ctx.prisma.updateGroup({
      data: {
        members: {
          connect: { id: personId }
        }
      },
      where: {
        id: groupId
      }
    });
  },

  leaveGroup: async (parent, { groupId }, ctx, info) => {
    const personId = getPersonId(ctx);
    checkGroupMembership(ctx, groupId);

    const leftGroup = await ctx.prisma.updateGroup({
      where: { id: groupId },
      data: {
        members: {
          disconnect: {
            id: personId
          }
        }
      }
    });
    return {
      id: leftGroup.id,
      success: true,
      message: `Successfully left group ${leftGroup.name}`
    };
  }
};
