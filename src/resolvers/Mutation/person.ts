import { MutationResolvers } from "../../generated/graphqlgen";
import { Person, PersonPromise } from "../../generated/prisma-client";
import { getPasswordHash, getPersonId } from "../../utils";

export const person: Pick<MutationResolvers.Type, "updatePerson"> = {
  updatePerson: async (parent, { email, password, name }, ctx) => {
    if (!email && !password && !name) {
      throw new Error("Cannot edit no fields");
    }

    const personId = getPersonId(ctx);
    const currentInfo = await ctx.prisma.person({ id: personId });

    if (email !== currentInfo.email) {
      // TODO: handle email change
    }

    if (password) {
      password = await getPasswordHash(password);
    }

    return ctx.prisma.updatePerson({
      where: {
        id: personId
      },
      data: {
        email: email as string | undefined,
        password: password as string | undefined,
        name: name as string | undefined
      }
    });
  }
};
