import { MutationResolvers } from "../../generated/graphqlgen";
import { checkGroupMembership, getPersonId } from "../../utils";

export const group: Pick<
  MutationResolvers.Type,
  "createGroup" | "joinGroup" | "leaveGroup"
> = {
  createGroup: async (parent, { name, description }, ctx, info) => {
    // TODO: more descriptive error if name already exists
    const personId = getPersonId(ctx);
    const dummyAuthor = await ctx.prisma.upsertPerson({
      where: {
        email: "wobbly@wobbly.app"
      },
      update: {
        name: "Wobbly",
        email: "wobbly@wobbly.app",
        password: "x"
      },
      create: {
        name: "Wobbly",
        email: "wobbly@wobbly.app",
        password: "x"
      }
    });
    return ctx.prisma.createGroup({
      name,
      description: description as string | undefined,
      members: {
        connect: { id: personId }
      },
      threads: {
        create: {
          title: "Welcome!",
          posts: {
            create: {
              content:
                "Welcome to your new group! Use this thread to introduce yourself.",
              author: {
                connect: {
                  id: dummyAuthor.id
                }
              }
            }
          }
        }
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
