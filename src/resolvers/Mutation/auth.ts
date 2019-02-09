import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

import { MutationResolvers } from "../../generated/graphqlgen";
import { getPasswordHash } from "../../utils";

export const auth: Pick<MutationResolvers.Type, "signup" | "login"> = {
  signup: async (parent, args, ctx) => {
    const password = await getPasswordHash(args.password);
    // TODO:
    // * check if the email is in use and if so, give a descriptive error message
    // * verify password complexity
    // * verify that the email is real
    // * verify that the name is valid (not too long)
    const person = await ctx.prisma.createPerson({ ...args, password });

    if (!process.env.APP_SECRET) {
      throw new Error("Server error");
    }

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
