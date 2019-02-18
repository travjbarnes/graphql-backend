import { MutationResolvers } from "../../generated/graphqlgen";
import { checkGroupMembership, getPersonId } from "../../utils";

export const wikiPage: Pick<
  MutationResolvers.Type,
  "createWikiPage" | "editWikiPage" | "deleteWikiPage"
> = {
  createWikiPage: (parent, { groupId, title, content }, ctx) => {
    const personId = getPersonId(ctx);
    checkGroupMembership(ctx, groupId);
    return ctx.prisma.createWikiPage({
      group: {
        connect: {
          id: groupId
        }
      },
      content: {
        create: {
          title,
          content,
          author: {
            connect: {
              id: personId
            }
          },
          deleted: false
        }
      }
    });
  },
  editWikiPage: async (parent, { pageId, title, content }, ctx) => {
    const personId = getPersonId(ctx);
    const groupId = await ctx.prisma
      .wikiPage({ id: pageId })
      .group()
      .id();
    checkGroupMembership(ctx, groupId);
    return ctx.prisma.updateWikiPage({
      where: {
        id: pageId
      },
      data: {
        content: {
          create: {
            title,
            content,
            author: {
              connect: {
                id: personId
              }
            },
            deleted: false
          }
        }
      }
    });
  },
  deleteWikiPage: async (parent, { pageId }, ctx) => {
    const personId = getPersonId(ctx);
    const groupId = await ctx.prisma
      .wikiPage({ id: pageId })
      .group()
      .id();
    checkGroupMembership(ctx, groupId);
    const prevPage = await ctx.prisma
      .wikiPage({ id: pageId })
      .content({ orderBy: "createdAt_DESC", first: 1 })
      .then(content => content[0]);
    return ctx.prisma
      .updateWikiPage({
        where: {
          id: pageId
        },
        data: {
          content: {
            create: {
              title: prevPage.title,
              content: prevPage.content,
              author: {
                connect: {
                  id: personId
                }
              },
              deleted: true
            }
          }
        }
      })
      .then(page => {
        return {
          id: page.id,
          success: true,
          message: `Deleted page ${prevPage.title}`
        };
      });
  }
};
