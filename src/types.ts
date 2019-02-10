import { Person, Prisma } from "./generated/prisma-client";

export interface IContext {
  prisma: Prisma;
  request: any;
}

/* Types for GraphQLgen */

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
