import { Person, Prisma } from "./generated/prisma-client";

export interface IContext {
  prisma: Prisma;
  request: any;
}

// tslint:disable-next-line:interface-name
export interface AuthPayload {
  token: string;
  person: Person;
}

// tslint:disable-next-line:interface-name
export interface DeletionResponse {
  id: string;
  success: boolean;
  message: string | null;
}
