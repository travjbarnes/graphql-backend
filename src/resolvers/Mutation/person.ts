import * as bcrypt from "bcryptjs";

import { sendConfirmationEmail } from "../../communications/email";
import { MutationResolvers } from "../../generated/graphqlgen";
import {
  checkForPwnedPassword,
  getCode,
  getPasswordHash,
  getPersonId,
  InvalidPasswordError,
  validatePersonFields
} from "../../utils";

export const person: Pick<MutationResolvers.Type, "updatePerson"> = {
  updatePerson: async (
    parent,
    { email, name, oldPassword, newPassword },
    ctx
  ) => {
    let hash;
    let confirmationCode;
    let emailConfirmed;
    const personId = getPersonId(ctx);
    const currentInfo = await ctx.prisma.person({ id: personId });

    if (!email && !name && !newPassword) {
      throw new Error("Did not receive fields to update");
    }

    // in case we did not receive a field to validate, pass a dummy value that will pass validation.
    // this is so we can use the same validator in the login and signup resolvers.
    validatePersonFields(
      email || "dummy@dummy.com",
      name || "dummy name",
      newPassword || "dummy password"
    );

    const valid =
      oldPassword && (await bcrypt.compare(oldPassword, currentInfo.password));
    if (!valid) {
      throw new InvalidPasswordError();
    }

    if (newPassword) {
      await checkForPwnedPassword(newPassword);
      hash = await getPasswordHash(newPassword);
    }

    if (email && email !== currentInfo.email) {
      if (await ctx.prisma.$exists.person({ email })) {
        throw new Error("Email unavailable");
      }

      if (process.env.NODE_ENV !== "env") {
        confirmationCode = getCode(6);
        emailConfirmed = false;
        sendConfirmationEmail(email, confirmationCode);
      }
    }

    return ctx.prisma.updatePerson({
      where: {
        id: personId
      },
      data: {
        email: email as string | undefined,
        password: hash as string | undefined,
        name: name as string | undefined,
        confirmationCode: confirmationCode as string | undefined,
        emailConfirmed: emailConfirmed as boolean | undefined
      }
    });
  }
};
