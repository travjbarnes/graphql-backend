import { GroupResolvers } from "../generated/graphqlgen";

export const Group: GroupResolvers.Type = {
    ...GroupResolvers.defaultResolvers,
    members: (parent, args, ctx) => ctx.prisma.group({
        id: parent.id
    }).members(),
    threads: (parent, args, ctx) => ctx.prisma.group({
        id: parent.id
    }).threads()
}
