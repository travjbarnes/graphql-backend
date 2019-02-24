import { Person, Prisma } from "./generated/prisma-client";

export interface IContext {
  prisma: Prisma;
  req: any;
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
export interface GroupSearchResponse {
  id: string;
  name: string;
  description: string | null;
}
