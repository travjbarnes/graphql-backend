import { Resolvers } from "../generated/graphqlgen";

import { AuthPayload } from "./AuthPayload";
import { DeletionResponse } from "./DeletionResponse";
import { Group } from "./Group";
import { Mutation } from "./Mutation";
import { Person } from "./Person";
import { Post } from "./Post";
import { Query } from "./Query";
import { Thread } from "./Thread";

const resolvers: Resolvers = {
  Query,
  Mutation,
  Person,
  Group,
  Thread,
  Post,
  AuthPayload,
  DeletionResponse
};
export default resolvers;
