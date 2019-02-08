import { Prisma, Person } from "./generated/prisma-client";

export interface Context {
  prisma: Prisma
  request: any
}

export interface AuthPayload {
  token: string
  person: Person
}

export interface DeletionResponse {
  id: string
  success: boolean
  message: string | null
}
