import * as bcrypt from 'bcryptjs'
import * as jwt from 'jsonwebtoken'
import { MutationResolvers } from '../../generated/graphqlgen';

export const auth: Pick<MutationResolvers.Type, "signup" | "login"> = {
  signup: async (parent, args, ctx) => {
    const password = await bcrypt.hash(args.password, 10)
    const person = await ctx.prisma.createPerson({ ...args, password })

    return {
      token: jwt.sign({ userId: person.id }, process.env.APP_SECRET),
      person,
    }
  },

  login: async (parent, { email, password }, ctx) => {
    const person = await ctx.prisma.person({ email })
    if (!person) {
      throw new Error(`No such user found for email: ${email}`)
    }

    const valid = await bcrypt.compare(password, person.password)
    if (!valid) {
      throw new Error('Invalid password')
    }

    return {
      token: jwt.sign({ userId: person.id }, process.env.APP_SECRET),
      person,
    }
  },
}
