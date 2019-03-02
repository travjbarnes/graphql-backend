import { MutationResolvers } from "../../generated/graphqlgen";
import {
  checkForPwnedPassword,
  getPasswordHash,
  getPersonId,
  validatePersonFields
} from "../../utils";

export const person: Pick<
  MutationResolvers.Type,
  "updatePerson" | "addPushToken" | "deletePushToken"
> = {
  updatePerson: async (parent, { email, name, password }, ctx) => {
    if (!email && !name && !password) {
      throw new Error("Did not receive fields to update");
    }

    // in case we did not receive a field to validate, pass a dummy value that will pass validation.
    // this is so we can use the same validator in the login and signup resolvers.
    validatePersonFields(
      email || "dummy@dummy.com",
      name || "dummy name",
      password || "dummy password"
    );

    const personId = getPersonId(ctx);
    const currentInfo = await ctx.prisma.person({ id: personId });

    if (email !== currentInfo.email) {
      // TODO: handle email change (i.e. verify new email)
    }

    let hash;
    if (password) {
      await checkForPwnedPassword(password);
      hash = await getPasswordHash(password);
    }

    return ctx.prisma.updatePerson({
      where: {
        id: personId
      },
      data: {
        email: email || undefined,
        password: hash || undefined,
        name: name || undefined
      }
    });
  },

  addPushToken: async (parent, { token }, ctx) => {
    const personId = getPersonId(ctx);
    return ctx.prisma.updatePerson({
      where: {
        id: personId
      },
      data: {
        pushTokens: {
          create: {
            token
          }
        }
      }
    });
  },

  deletePushToken: async (parent, { token }, ctx) => {
    const personId = getPersonId(ctx);
    if (
      !ctx.prisma.$exists.person({
        id_not: personId,
        pushTokens_some: { token }
      })
    ) {
      throw new Error(`Token ${token} not affiliated with user.`);
    }
    try {
      await ctx.prisma.deletePushToken({ token });
    } catch {
      return {
        id: token,
        success: false,
        message: "Failed to delete token"
      };
    }
    return {
      id: token,
      success: true,
      message: "Push token deleted"
    };
  }
};
