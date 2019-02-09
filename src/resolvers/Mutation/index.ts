import { MutationResolvers } from "../../generated/graphqlgen";

import { auth } from "./auth";
import { group } from "./group";
import { person } from "./person";
import { post } from "./post";
import { thread } from "./thread";

export const Mutation: MutationResolvers.Type = {
  ...MutationResolvers.defaultResolvers,
  ...auth,
  ...group,
  ...post,
  ...thread,
  ...person
};
