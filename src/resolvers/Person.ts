import { PersonResolvers } from "../generated/graphqlgen";

export const Person: PersonResolvers.Type = {
    ...PersonResolvers.defaultResolvers,
    groups: (parent, args, ctx) => ctx.prisma.person({
        id: parent.id
    }).groups()
}
