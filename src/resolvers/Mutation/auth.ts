import * as bcrypt from "bcryptjs";
import { inflect } from "inflection";
import * as jwt from "jsonwebtoken";

import { MutationResolvers } from "../../generated/graphqlgen";
import { getPasswordHash, isPwnedPassword } from "../../utils";

export const auth: Pick<MutationResolvers.Type, "signup" | "login"> = {
  signup: async (parent, { email, name, password }, ctx) => {
    const hashedPassword = await getPasswordHash(password);

    if (password.length < 10) {
      throw new Error("Password must be at least 10 characters");
    }

    // tslint:disable-next-line:no-string-literal
    if (process.env["NODE_ENV"] !== "dev") {
      const count = await isPwnedPassword(password);
      if (count > 0) {
        throw new Error(
          `This password has been seen ${count} ${inflect(
            "time",
            count
          )} in data breaches. Please choose a more secure one.`
        );
      }
    }

    if (await ctx.prisma.$exists.person({ email })) {
      throw new Error("Email unavailable");
    }

    // TODO:
    // * verify that the email is real
    // * verify that the name is valid (not too long)
    const person = await ctx.prisma.createPerson({
      email,
      name,
      password: hashedPassword
    });

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
