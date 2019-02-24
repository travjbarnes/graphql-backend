import { ApolloServer, gql } from "apollo-server";
import * as fs from "fs";
import * as path from "path";

import { prisma } from "./generated/prisma-client";
import resolvers from "./resolvers";

const playground = process.env.NODE_ENV === "dev" ? { endpoint: "/" } : false;

const typeDefs = gql`
  ${fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8").toString()}
`;

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: request => ({
    ...request,
    prisma
  }),
  playground
});
export const port =
  process.env.NODE_ENV === "test"
    ? 4001
    : parseInt(process.env.PORT || "4000", 10);

export const startServer = async () => {
  await server.listen({ port }).then(({ url }) => {
    // tslint:disable-next-line:no-console
    console.log(`🚀  Server ready at ${url}`);
  });
};

export const stopServer = async () => {
  await server.stop();
};
