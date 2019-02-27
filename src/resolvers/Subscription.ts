import { SubscriptionResolvers } from "../generated/graphqlgen";
import { IWebSocketContext } from "../types";

export const Subscription: SubscriptionResolvers.Type = {
  postAdded: {
    subscribe: (parent, args, ctx) => {
      const wsCtx: IWebSocketContext = ctx as any; // hack to get around bad typings in apollo/the generated code
      const personId = wsCtx.personId;
      return wsCtx.prisma.$subscribe
        .post({
          node: {
            // don't tell a subscriber about their own posts
            author: {
              id_not: personId
            },
            // don't create subscription events for the first post, since that's a new thread
            // and the threadAdded subscription handles that
            firstPost: false,
            // only tell subscribers about posts in groups they're a member of
            // TODO: would it be more efficient to get groupIds above and then use { group: { id_in: groupIds } } ?
            thread: {
              group: {
                members_some: {
                  id: personId
                }
              }
            }
          }
        })
        .node();
    },
    // @ts-ignore TODO: open ticket for these bad types in graphqlgen
    resolve: payload => payload
  },
  threadAdded: {
    subscribe: (parent, args, ctx) => {
      const wsCtx: IWebSocketContext = ctx as any; // hack to get around bad typings in apollo/the generated code
      const personId = wsCtx.personId;
      return wsCtx.prisma.$subscribe
        .thread({
          node: {
            // don't tell a subscriber about threads they've created
            // we use posts_every because there'll only be one post initially
            posts_every: {
              author: {
                id_not: personId
              }
            },
            // only notify group members
            group: {
              members_some: {
                id: personId
              }
            }
          }
        })
        .node();
    },
    // @ts-ignore TODO: open ticket for these bad types in graphqlgen
    resolve: payload => payload
  }
};
