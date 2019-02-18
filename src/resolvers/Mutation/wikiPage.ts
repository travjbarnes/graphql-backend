import { MutationResolvers } from "../../generated/graphqlgen";
import { checkGroupMembership, getPersonId } from "../../utils";

export const wikiPage: Pick<
  MutationResolvers.Type,
  "createWikiPage" | "editWikiPage" | "deleteWikiPage"
> = {
  createWikiPage: async (parent, { groupId, title, content }, ctx) => {
    const personId = getPersonId(ctx);
    await checkGroupMembership(ctx, groupId);
    return ctx.prisma.createWikiPage({
      group: {
        connect: {
          id: groupId
        }
      },
      mainPage: false,
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
    await checkGroupMembership(ctx, groupId);
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
    await checkGroupMembership(ctx, groupId);

    const page = await ctx.prisma.wikiPage({ id: pageId });
    if (page.mainPage) {
      throw new Error("Cannot delete main page");
    }

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
      .then(response => {
        return {
          id: response.id,
          success: true,
          message: `Deleted page ${prevPage.title}`
        };
      });
  }
};
