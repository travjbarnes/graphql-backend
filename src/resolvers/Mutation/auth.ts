import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

import { MutationResolvers } from "../../generated/graphqlgen";
import {
  checkForPwnedPassword,
  getPasswordHash,
  validatePersonFields
} from "../../utils";

export const auth: Pick<MutationResolvers.Type, "signup" | "login"> = {
  signup: async (parent, { email, name, password }, ctx) => {
    if (!process.env.APP_SECRET) {
      throw new Error("Server error");
    }

    validatePersonFields(email, name, password);
    await checkForPwnedPassword(password);
    if (await ctx.prisma.$exists.person({ email })) {
      throw new Error("Email unavailable");
    }

    const hashedPassword = await getPasswordHash(password);
    const person = await ctx.prisma.createPerson({
      email,
      name,
      password: hashedPassword
    });

    return {
      token: jwt.sign({ personId: person.id }, process.env.APP_SECRET),
      person
    };
  },

  login: async (parent, { email, password }, ctx) => {
    const person = await ctx.prisma.person({ email });
    if (!person) {
      throw new Error(`No such person found for email: ${email}`);
    }

    const valid = await bcrypt.compare(password, person.password);
    if (!valid) {
      throw new Error("Invalid password");
    }

    if (!process.env.APP_SECRET) {
      throw new Error("Server error");
    }

    return {
      token: jwt.sign({ personId: person.id }, process.env.APP_SECRET),
      person
    };
  }
};
