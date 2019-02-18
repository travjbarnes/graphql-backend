import { ApolloEngine } from "apollo-engine";
import { GraphQLServer } from "graphql-yoga";
import { Server as HttpServer } from "http";

import { prisma } from "./generated/prisma-client";
import resolvers from "./resolvers";

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: resolvers as any,
  context: request => ({
    ...request,
    prisma
  })
});
let httpServer: HttpServer;

export const port =
  process.env.NODE_ENV === "test"
    ? 4001
    : parseInt(process.env.PORT || "4000", 10);
const playground = process.env.NODE_ENV === "dev" ? "/" : false;

export const startServer = async () => {
  if (process.env.ENGINE_API_KEY && process.env.NODE_ENV === "production") {
    const engine = new ApolloEngine({
      apiKey: process.env.ENGINE_API_KEY
    });
    httpServer = server.createHttpServer({
      tracing: true,
      cacheControl: true,
      playground
    });

    engine.listen(
      {
        port,
        httpServer,
        graphqlPaths: ["/"]
      },
      () =>
        // tslint:disable-next-line:no-console
        console.log(
          `Server with Apollo Engine is running on http://localhost:${port}`
        )
    );
  } else {
    httpServer = (await server.start(
      {
        port,
        playground
      },
      // tslint:disable-next-line:no-console
      () => console.log(`Server is running on http://localhost:${port}`)
    )) as HttpServer;
  }
};

export const stopServer = async () => {
  await httpServer.close();
};
