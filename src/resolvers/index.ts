import { Query } from './Query'
import { Mutation } from './Mutation'
import { Person } from './Person'
import { Group } from './Group'
import { Thread } from './Thread'
import { Post } from './Post'
import {AuthPayload} from './AuthPayload'
import {DeletionResponse} from './DeletionResponse'
import { Resolvers } from '../generated/graphqlgen';

const resolvers: Resolvers = {
  Query,
  Mutation,
  Person,
  Group,
  Thread,
  Post,
  AuthPayload,
  DeletionResponse
}
export default resolvers;
