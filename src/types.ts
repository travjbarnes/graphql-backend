import { Person, Prisma } from "./generated/prisma-client";

export interface IContext {
  prisma: Prisma;
  req: any;
}

/**
 * Subscriptions (over WebSockets) have a different context than regular HTTP connections.
 * See the bit in `server.ts` where the `new ApolloServer(...)` is created.
 */
export interface IWebSocketContext {
  prisma: Prisma;
  personId: string;
}

/**
 * Types for GraphQLGen.
 * Don't change these -- they're required by the autogenerated code.
 */
// tslint:disable:interface-name
export interface AuthPayload {
  token: string;
  person: Person;
}
export interface DeletionResponse {
  id: string;
  success: boolean;
  message: string | null;
}
export interface GroupSearchResponse {
  id: string;
  name: string;
  description: string | null;
}
