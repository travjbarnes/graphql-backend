import { MutationResolvers } from "../../generated/graphqlgen";
import {
  checkForPwnedPassword,
  getPasswordHash,
  getPersonId,
  validatePersonFields
} from "../../utils";

export const person: Pick<MutationResolvers.Type, "updatePerson"> = {
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
        email: email as string | undefined,
        password: hash as string | undefined,
        name: name as string | undefined
      }
    });
  }
};
