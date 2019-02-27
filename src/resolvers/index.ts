import { Resolvers } from "../generated/graphqlgen";

import { AuthPayload } from "./AuthPayload";
import { DeletionResponse } from "./DeletionResponse";
import { Group } from "./Group";
import { GroupSearchResponse } from "./GroupSearchResponse";
import { Mutation } from "./Mutation";
import { Person } from "./Person";
import { Post } from "./Post";
import { Query } from "./Query";
import { Subscription } from "./Subscription";
import { Thread } from "./Thread";

const resolvers: Resolvers = {
  Query,
  Mutation,
  Person,
  Group,
  Thread,
  Post,
  AuthPayload,
  DeletionResponse,
  GroupSearchResponse,
  Subscription
};
export default resolvers;
