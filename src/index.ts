import { ApolloEngine } from "apollo-engine";
import { GraphQLServer } from "graphql-yoga";

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

const port = parseInt(process.env.PORT || "4000", 10) || 4000;
const playground = process.env.NODE_ENV === "dev" ? "/" : false;

if (process.env.ENGINE_API_KEY) {
  const engine = new ApolloEngine({
    apiKey: process.env.ENGINE_API_KEY
  });
  const httpServer = server.createHttpServer({
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
  server.start(
    {
      port,
      playground
    },
    // tslint:disable-next-line:no-console
    () => console.log(`Server is running on http://localhost:${port}`)
  );
}
