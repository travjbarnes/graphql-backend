import { ThreadResolvers } from "../generated/graphqlgen";

export const Thread: ThreadResolvers.Type = {
    ...ThreadResolvers.defaultResolvers,
    posts: (parent, args, ctx) => ctx.prisma.thread({
        id: parent.id
    }).posts(),
    group: (parent, args, ctx) => ctx.prisma.thread({
        id: parent.id
    }).group()
}
