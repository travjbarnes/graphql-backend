export const typeDefs = /* GraphQL */ `type AggregateGroup {
  count: Int!
}

type AggregatePerson {
  count: Int!
}

type AggregatePost {
  count: Int!
}

type AggregateThread {
  count: Int!
}

type AggregateWikiPage {
  count: Int!
}

type AggregateWikiPageContent {
  count: Int!
}

type BatchPayload {
  count: Long!
}

scalar DateTime

type Group {
  id: ID!
  name: String!
  createdAt: DateTime!
  description: String
  members(where: PersonWhereInput, orderBy: PersonOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Person!]
  threads(where: ThreadWhereInput, orderBy: ThreadOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Thread!]
}

type GroupConnection {
  pageInfo: PageInfo!
  edges: [GroupEdge]!
  aggregate: AggregateGroup!
}

input GroupCreateInput {
  name: String!
  description: String
  members: PersonCreateManyWithoutGroupsInput
  threads: ThreadCreateManyWithoutGroupInput
}

input GroupCreateManyWithoutMembersInput {
  create: [GroupCreateWithoutMembersInput!]
  connect: [GroupWhereUniqueInput!]
}

input GroupCreateOneInput {
  create: GroupCreateInput
  connect: GroupWhereUniqueInput
}

input GroupCreateOneWithoutThreadsInput {
  create: GroupCreateWithoutThreadsInput
  connect: GroupWhereUniqueInput
}

input GroupCreateWithoutMembersInput {
  name: String!
  description: String
  threads: ThreadCreateManyWithoutGroupInput
}

input GroupCreateWithoutThreadsInput {
  name: String!
  description: String
  members: PersonCreateManyWithoutGroupsInput
}

type GroupEdge {
  node: Group!
  cursor: String!
}

enum GroupOrderByInput {
  id_ASC
  id_DESC
  name_ASC
  name_DESC
  createdAt_ASC
  createdAt_DESC
  description_ASC
  description_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type GroupPreviousValues {
  id: ID!
  name: String!
  createdAt: DateTime!
  description: String
}

input GroupScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  description: String
  description_not: String
  description_in: [String!]
  description_not_in: [String!]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  AND: [GroupScalarWhereInput!]
  OR: [GroupScalarWhereInput!]
  NOT: [GroupScalarWhereInput!]
}

type GroupSubscriptionPayload {
  mutation: MutationType!
  node: Group
  updatedFields: [String!]
  previousValues: GroupPreviousValues
}

input GroupSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: GroupWhereInput
  AND: [GroupSubscriptionWhereInput!]
  OR: [GroupSubscriptionWhereInput!]
  NOT: [GroupSubscriptionWhereInput!]
}

input GroupUpdateDataInput {
  name: String
  description: String
  members: PersonUpdateManyWithoutGroupsInput
  threads: ThreadUpdateManyWithoutGroupInput
}

input GroupUpdateInput {
  name: String
  description: String
  members: PersonUpdateManyWithoutGroupsInput
  threads: ThreadUpdateManyWithoutGroupInput
}

input GroupUpdateManyDataInput {
  name: String
  description: String
}

input GroupUpdateManyMutationInput {
  name: String
  description: String
}

input GroupUpdateManyWithoutMembersInput {
  create: [GroupCreateWithoutMembersInput!]
  delete: [GroupWhereUniqueInput!]
  connect: [GroupWhereUniqueInput!]
  set: [GroupWhereUniqueInput!]
  disconnect: [GroupWhereUniqueInput!]
  update: [GroupUpdateWithWhereUniqueWithoutMembersInput!]
  upsert: [GroupUpsertWithWhereUniqueWithoutMembersInput!]
  deleteMany: [GroupScalarWhereInput!]
  updateMany: [GroupUpdateManyWithWhereNestedInput!]
}

input GroupUpdateManyWithWhereNestedInput {
  where: GroupScalarWhereInput!
  data: GroupUpdateManyDataInput!
}

input GroupUpdateOneRequiredInput {
  create: GroupCreateInput
  update: GroupUpdateDataInput
  upsert: GroupUpsertNestedInput
  connect: GroupWhereUniqueInput
}

input GroupUpdateOneRequiredWithoutThreadsInput {
  create: GroupCreateWithoutThreadsInput
  update: GroupUpdateWithoutThreadsDataInput
  upsert: GroupUpsertWithoutThreadsInput
  connect: GroupWhereUniqueInput
}

input GroupUpdateWithoutMembersDataInput {
  name: String
  description: String
  threads: ThreadUpdateManyWithoutGroupInput
}

input GroupUpdateWithoutThreadsDataInput {
  name: String
  description: String
  members: PersonUpdateManyWithoutGroupsInput
}

input GroupUpdateWithWhereUniqueWithoutMembersInput {
  where: GroupWhereUniqueInput!
  data: GroupUpdateWithoutMembersDataInput!
}

input GroupUpsertNestedInput {
  update: GroupUpdateDataInput!
  create: GroupCreateInput!
}

input GroupUpsertWithoutThreadsInput {
  update: GroupUpdateWithoutThreadsDataInput!
  create: GroupCreateWithoutThreadsInput!
}

input GroupUpsertWithWhereUniqueWithoutMembersInput {
  where: GroupWhereUniqueInput!
  update: GroupUpdateWithoutMembersDataInput!
  create: GroupCreateWithoutMembersInput!
}

input GroupWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  description: String
  description_not: String
  description_in: [String!]
  description_not_in: [String!]
  description_lt: String
  description_lte: String
  description_gt: String
  description_gte: String
  description_contains: String
  description_not_contains: String
  description_starts_with: String
  description_not_starts_with: String
  description_ends_with: String
  description_not_ends_with: String
  members_every: PersonWhereInput
  members_some: PersonWhereInput
  members_none: PersonWhereInput
  threads_every: ThreadWhereInput
  threads_some: ThreadWhereInput
  threads_none: ThreadWhereInput
  AND: [GroupWhereInput!]
  OR: [GroupWhereInput!]
  NOT: [GroupWhereInput!]
}

input GroupWhereUniqueInput {
  id: ID
  name: String
}

scalar Long

type Mutation {
  createGroup(data: GroupCreateInput!): Group!
  updateGroup(data: GroupUpdateInput!, where: GroupWhereUniqueInput!): Group
  updateManyGroups(data: GroupUpdateManyMutationInput!, where: GroupWhereInput): BatchPayload!
  upsertGroup(where: GroupWhereUniqueInput!, create: GroupCreateInput!, update: GroupUpdateInput!): Group!
  deleteGroup(where: GroupWhereUniqueInput!): Group
  deleteManyGroups(where: GroupWhereInput): BatchPayload!
  createPerson(data: PersonCreateInput!): Person!
  updatePerson(data: PersonUpdateInput!, where: PersonWhereUniqueInput!): Person
  updateManyPersons(data: PersonUpdateManyMutationInput!, where: PersonWhereInput): BatchPayload!
  upsertPerson(where: PersonWhereUniqueInput!, create: PersonCreateInput!, update: PersonUpdateInput!): Person!
  deletePerson(where: PersonWhereUniqueInput!): Person
  deleteManyPersons(where: PersonWhereInput): BatchPayload!
  createPost(data: PostCreateInput!): Post!
  updatePost(data: PostUpdateInput!, where: PostWhereUniqueInput!): Post
  updateManyPosts(data: PostUpdateManyMutationInput!, where: PostWhereInput): BatchPayload!
  upsertPost(where: PostWhereUniqueInput!, create: PostCreateInput!, update: PostUpdateInput!): Post!
  deletePost(where: PostWhereUniqueInput!): Post
  deleteManyPosts(where: PostWhereInput): BatchPayload!
  createThread(data: ThreadCreateInput!): Thread!
  updateThread(data: ThreadUpdateInput!, where: ThreadWhereUniqueInput!): Thread
  updateManyThreads(data: ThreadUpdateManyMutationInput!, where: ThreadWhereInput): BatchPayload!
  upsertThread(where: ThreadWhereUniqueInput!, create: ThreadCreateInput!, update: ThreadUpdateInput!): Thread!
  deleteThread(where: ThreadWhereUniqueInput!): Thread
  deleteManyThreads(where: ThreadWhereInput): BatchPayload!
  createWikiPage(data: WikiPageCreateInput!): WikiPage!
  updateWikiPage(data: WikiPageUpdateInput!, where: WikiPageWhereUniqueInput!): WikiPage
  upsertWikiPage(where: WikiPageWhereUniqueInput!, create: WikiPageCreateInput!, update: WikiPageUpdateInput!): WikiPage!
  deleteWikiPage(where: WikiPageWhereUniqueInput!): WikiPage
  deleteManyWikiPages(where: WikiPageWhereInput): BatchPayload!
  createWikiPageContent(data: WikiPageContentCreateInput!): WikiPageContent!
  updateWikiPageContent(data: WikiPageContentUpdateInput!, where: WikiPageContentWhereUniqueInput!): WikiPageContent
  updateManyWikiPageContents(data: WikiPageContentUpdateManyMutationInput!, where: WikiPageContentWhereInput): BatchPayload!
  upsertWikiPageContent(where: WikiPageContentWhereUniqueInput!, create: WikiPageContentCreateInput!, update: WikiPageContentUpdateInput!): WikiPageContent!
  deleteWikiPageContent(where: WikiPageContentWhereUniqueInput!): WikiPageContent
  deleteManyWikiPageContents(where: WikiPageContentWhereInput): BatchPayload!
}

enum MutationType {
  CREATED
  UPDATED
  DELETED
}

interface Node {
  id: ID!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}

type Person {
  id: ID!
  email: String!
  createdAt: DateTime!
  password: String!
  name: String!
  groups(where: GroupWhereInput, orderBy: GroupOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Group!]
}

type PersonConnection {
  pageInfo: PageInfo!
  edges: [PersonEdge]!
  aggregate: AggregatePerson!
}

input PersonCreateInput {
  email: String!
  password: String!
  name: String!
  groups: GroupCreateManyWithoutMembersInput
}

input PersonCreateManyWithoutGroupsInput {
  create: [PersonCreateWithoutGroupsInput!]
  connect: [PersonWhereUniqueInput!]
}

input PersonCreateOneInput {
  create: PersonCreateInput
  connect: PersonWhereUniqueInput
}

input PersonCreateWithoutGroupsInput {
  email: String!
  password: String!
  name: String!
}

type PersonEdge {
  node: Person!
  cursor: String!
}

enum PersonOrderByInput {
  id_ASC
  id_DESC
  email_ASC
  email_DESC
  createdAt_ASC
  createdAt_DESC
  password_ASC
  password_DESC
  name_ASC
  name_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type PersonPreviousValues {
  id: ID!
  email: String!
  createdAt: DateTime!
  password: String!
  name: String!
}

input PersonScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  password: String
  password_not: String
  password_in: [String!]
  password_not_in: [String!]
  password_lt: String
  password_lte: String
  password_gt: String
  password_gte: String
  password_contains: String
  password_not_contains: String
  password_starts_with: String
  password_not_starts_with: String
  password_ends_with: String
  password_not_ends_with: String
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  AND: [PersonScalarWhereInput!]
  OR: [PersonScalarWhereInput!]
  NOT: [PersonScalarWhereInput!]
}

type PersonSubscriptionPayload {
  mutation: MutationType!
  node: Person
  updatedFields: [String!]
  previousValues: PersonPreviousValues
}

input PersonSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: PersonWhereInput
  AND: [PersonSubscriptionWhereInput!]
  OR: [PersonSubscriptionWhereInput!]
  NOT: [PersonSubscriptionWhereInput!]
}

input PersonUpdateDataInput {
  email: String
  password: String
  name: String
  groups: GroupUpdateManyWithoutMembersInput
}

input PersonUpdateInput {
  email: String
  password: String
  name: String
  groups: GroupUpdateManyWithoutMembersInput
}

input PersonUpdateManyDataInput {
  email: String
  password: String
  name: String
}

input PersonUpdateManyMutationInput {
  email: String
  password: String
  name: String
}

input PersonUpdateManyWithoutGroupsInput {
  create: [PersonCreateWithoutGroupsInput!]
  delete: [PersonWhereUniqueInput!]
  connect: [PersonWhereUniqueInput!]
  set: [PersonWhereUniqueInput!]
  disconnect: [PersonWhereUniqueInput!]
  update: [PersonUpdateWithWhereUniqueWithoutGroupsInput!]
  upsert: [PersonUpsertWithWhereUniqueWithoutGroupsInput!]
  deleteMany: [PersonScalarWhereInput!]
  updateMany: [PersonUpdateManyWithWhereNestedInput!]
}

input PersonUpdateManyWithWhereNestedInput {
  where: PersonScalarWhereInput!
  data: PersonUpdateManyDataInput!
}

input PersonUpdateOneRequiredInput {
  create: PersonCreateInput
  update: PersonUpdateDataInput
  upsert: PersonUpsertNestedInput
  connect: PersonWhereUniqueInput
}

input PersonUpdateWithoutGroupsDataInput {
  email: String
  password: String
  name: String
}

input PersonUpdateWithWhereUniqueWithoutGroupsInput {
  where: PersonWhereUniqueInput!
  data: PersonUpdateWithoutGroupsDataInput!
}

input PersonUpsertNestedInput {
  update: PersonUpdateDataInput!
  create: PersonCreateInput!
}

input PersonUpsertWithWhereUniqueWithoutGroupsInput {
  where: PersonWhereUniqueInput!
  update: PersonUpdateWithoutGroupsDataInput!
  create: PersonCreateWithoutGroupsInput!
}

input PersonWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  email: String
  email_not: String
  email_in: [String!]
  email_not_in: [String!]
  email_lt: String
  email_lte: String
  email_gt: String
  email_gte: String
  email_contains: String
  email_not_contains: String
  email_starts_with: String
  email_not_starts_with: String
  email_ends_with: String
  email_not_ends_with: String
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  password: String
  password_not: String
  password_in: [String!]
  password_not_in: [String!]
  password_lt: String
  password_lte: String
  password_gt: String
  password_gte: String
  password_contains: String
  password_not_contains: String
  password_starts_with: String
  password_not_starts_with: String
  password_ends_with: String
  password_not_ends_with: String
  name: String
  name_not: String
  name_in: [String!]
  name_not_in: [String!]
  name_lt: String
  name_lte: String
  name_gt: String
  name_gte: String
  name_contains: String
  name_not_contains: String
  name_starts_with: String
  name_not_starts_with: String
  name_ends_with: String
  name_not_ends_with: String
  groups_every: GroupWhereInput
  groups_some: GroupWhereInput
  groups_none: GroupWhereInput
  AND: [PersonWhereInput!]
  OR: [PersonWhereInput!]
  NOT: [PersonWhereInput!]
}

input PersonWhereUniqueInput {
  id: ID
  email: String
}

type Post {
  id: ID!
  createdAt: DateTime!
  author: Person!
  content: String!
  thread: Thread!
}

type PostConnection {
  pageInfo: PageInfo!
  edges: [PostEdge]!
  aggregate: AggregatePost!
}

input PostCreateInput {
  author: PersonCreateOneInput!
  content: String!
  thread: ThreadCreateOneWithoutPostsInput!
}

input PostCreateManyWithoutThreadInput {
  create: [PostCreateWithoutThreadInput!]
  connect: [PostWhereUniqueInput!]
}

input PostCreateWithoutThreadInput {
  author: PersonCreateOneInput!
  content: String!
}

type PostEdge {
  node: Post!
  cursor: String!
}

enum PostOrderByInput {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  content_ASC
  content_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type PostPreviousValues {
  id: ID!
  createdAt: DateTime!
  content: String!
}

input PostScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  content: String
  content_not: String
  content_in: [String!]
  content_not_in: [String!]
  content_lt: String
  content_lte: String
  content_gt: String
  content_gte: String
  content_contains: String
  content_not_contains: String
  content_starts_with: String
  content_not_starts_with: String
  content_ends_with: String
  content_not_ends_with: String
  AND: [PostScalarWhereInput!]
  OR: [PostScalarWhereInput!]
  NOT: [PostScalarWhereInput!]
}

type PostSubscriptionPayload {
  mutation: MutationType!
  node: Post
  updatedFields: [String!]
  previousValues: PostPreviousValues
}

input PostSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: PostWhereInput
  AND: [PostSubscriptionWhereInput!]
  OR: [PostSubscriptionWhereInput!]
  NOT: [PostSubscriptionWhereInput!]
}

input PostUpdateInput {
  author: PersonUpdateOneRequiredInput
  content: String
  thread: ThreadUpdateOneRequiredWithoutPostsInput
}

input PostUpdateManyDataInput {
  content: String
}

input PostUpdateManyMutationInput {
  content: String
}

input PostUpdateManyWithoutThreadInput {
  create: [PostCreateWithoutThreadInput!]
  delete: [PostWhereUniqueInput!]
  connect: [PostWhereUniqueInput!]
  set: [PostWhereUniqueInput!]
  disconnect: [PostWhereUniqueInput!]
  update: [PostUpdateWithWhereUniqueWithoutThreadInput!]
  upsert: [PostUpsertWithWhereUniqueWithoutThreadInput!]
  deleteMany: [PostScalarWhereInput!]
  updateMany: [PostUpdateManyWithWhereNestedInput!]
}

input PostUpdateManyWithWhereNestedInput {
  where: PostScalarWhereInput!
  data: PostUpdateManyDataInput!
}

input PostUpdateWithoutThreadDataInput {
  author: PersonUpdateOneRequiredInput
  content: String
}

input PostUpdateWithWhereUniqueWithoutThreadInput {
  where: PostWhereUniqueInput!
  data: PostUpdateWithoutThreadDataInput!
}

input PostUpsertWithWhereUniqueWithoutThreadInput {
  where: PostWhereUniqueInput!
  update: PostUpdateWithoutThreadDataInput!
  create: PostCreateWithoutThreadInput!
}

input PostWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  author: PersonWhereInput
  content: String
  content_not: String
  content_in: [String!]
  content_not_in: [String!]
  content_lt: String
  content_lte: String
  content_gt: String
  content_gte: String
  content_contains: String
  content_not_contains: String
  content_starts_with: String
  content_not_starts_with: String
  content_ends_with: String
  content_not_ends_with: String
  thread: ThreadWhereInput
  AND: [PostWhereInput!]
  OR: [PostWhereInput!]
  NOT: [PostWhereInput!]
}

input PostWhereUniqueInput {
  id: ID
}

type Query {
  group(where: GroupWhereUniqueInput!): Group
  groups(where: GroupWhereInput, orderBy: GroupOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Group]!
  groupsConnection(where: GroupWhereInput, orderBy: GroupOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): GroupConnection!
  person(where: PersonWhereUniqueInput!): Person
  persons(where: PersonWhereInput, orderBy: PersonOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Person]!
  personsConnection(where: PersonWhereInput, orderBy: PersonOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): PersonConnection!
  post(where: PostWhereUniqueInput!): Post
  posts(where: PostWhereInput, orderBy: PostOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Post]!
  postsConnection(where: PostWhereInput, orderBy: PostOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): PostConnection!
  thread(where: ThreadWhereUniqueInput!): Thread
  threads(where: ThreadWhereInput, orderBy: ThreadOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Thread]!
  threadsConnection(where: ThreadWhereInput, orderBy: ThreadOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): ThreadConnection!
  wikiPage(where: WikiPageWhereUniqueInput!): WikiPage
  wikiPages(where: WikiPageWhereInput, orderBy: WikiPageOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [WikiPage]!
  wikiPagesConnection(where: WikiPageWhereInput, orderBy: WikiPageOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): WikiPageConnection!
  wikiPageContent(where: WikiPageContentWhereUniqueInput!): WikiPageContent
  wikiPageContents(where: WikiPageContentWhereInput, orderBy: WikiPageContentOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [WikiPageContent]!
  wikiPageContentsConnection(where: WikiPageContentWhereInput, orderBy: WikiPageContentOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): WikiPageContentConnection!
  node(id: ID!): Node
}

type Subscription {
  group(where: GroupSubscriptionWhereInput): GroupSubscriptionPayload
  person(where: PersonSubscriptionWhereInput): PersonSubscriptionPayload
  post(where: PostSubscriptionWhereInput): PostSubscriptionPayload
  thread(where: ThreadSubscriptionWhereInput): ThreadSubscriptionPayload
  wikiPage(where: WikiPageSubscriptionWhereInput): WikiPageSubscriptionPayload
  wikiPageContent(where: WikiPageContentSubscriptionWhereInput): WikiPageContentSubscriptionPayload
}

type Thread {
  id: ID!
  createdAt: DateTime!
  title: String!
  posts(where: PostWhereInput, orderBy: PostOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [Post!]
  group: Group!
}

type ThreadConnection {
  pageInfo: PageInfo!
  edges: [ThreadEdge]!
  aggregate: AggregateThread!
}

input ThreadCreateInput {
  title: String!
  posts: PostCreateManyWithoutThreadInput
  group: GroupCreateOneWithoutThreadsInput!
}

input ThreadCreateManyWithoutGroupInput {
  create: [ThreadCreateWithoutGroupInput!]
  connect: [ThreadWhereUniqueInput!]
}

input ThreadCreateOneWithoutPostsInput {
  create: ThreadCreateWithoutPostsInput
  connect: ThreadWhereUniqueInput
}

input ThreadCreateWithoutGroupInput {
  title: String!
  posts: PostCreateManyWithoutThreadInput
}

input ThreadCreateWithoutPostsInput {
  title: String!
  group: GroupCreateOneWithoutThreadsInput!
}

type ThreadEdge {
  node: Thread!
  cursor: String!
}

enum ThreadOrderByInput {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  title_ASC
  title_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type ThreadPreviousValues {
  id: ID!
  createdAt: DateTime!
  title: String!
}

input ThreadScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  title: String
  title_not: String
  title_in: [String!]
  title_not_in: [String!]
  title_lt: String
  title_lte: String
  title_gt: String
  title_gte: String
  title_contains: String
  title_not_contains: String
  title_starts_with: String
  title_not_starts_with: String
  title_ends_with: String
  title_not_ends_with: String
  AND: [ThreadScalarWhereInput!]
  OR: [ThreadScalarWhereInput!]
  NOT: [ThreadScalarWhereInput!]
}

type ThreadSubscriptionPayload {
  mutation: MutationType!
  node: Thread
  updatedFields: [String!]
  previousValues: ThreadPreviousValues
}

input ThreadSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: ThreadWhereInput
  AND: [ThreadSubscriptionWhereInput!]
  OR: [ThreadSubscriptionWhereInput!]
  NOT: [ThreadSubscriptionWhereInput!]
}

input ThreadUpdateInput {
  title: String
  posts: PostUpdateManyWithoutThreadInput
  group: GroupUpdateOneRequiredWithoutThreadsInput
}

input ThreadUpdateManyDataInput {
  title: String
}

input ThreadUpdateManyMutationInput {
  title: String
}

input ThreadUpdateManyWithoutGroupInput {
  create: [ThreadCreateWithoutGroupInput!]
  delete: [ThreadWhereUniqueInput!]
  connect: [ThreadWhereUniqueInput!]
  set: [ThreadWhereUniqueInput!]
  disconnect: [ThreadWhereUniqueInput!]
  update: [ThreadUpdateWithWhereUniqueWithoutGroupInput!]
  upsert: [ThreadUpsertWithWhereUniqueWithoutGroupInput!]
  deleteMany: [ThreadScalarWhereInput!]
  updateMany: [ThreadUpdateManyWithWhereNestedInput!]
}

input ThreadUpdateManyWithWhereNestedInput {
  where: ThreadScalarWhereInput!
  data: ThreadUpdateManyDataInput!
}

input ThreadUpdateOneRequiredWithoutPostsInput {
  create: ThreadCreateWithoutPostsInput
  update: ThreadUpdateWithoutPostsDataInput
  upsert: ThreadUpsertWithoutPostsInput
  connect: ThreadWhereUniqueInput
}

input ThreadUpdateWithoutGroupDataInput {
  title: String
  posts: PostUpdateManyWithoutThreadInput
}

input ThreadUpdateWithoutPostsDataInput {
  title: String
  group: GroupUpdateOneRequiredWithoutThreadsInput
}

input ThreadUpdateWithWhereUniqueWithoutGroupInput {
  where: ThreadWhereUniqueInput!
  data: ThreadUpdateWithoutGroupDataInput!
}

input ThreadUpsertWithoutPostsInput {
  update: ThreadUpdateWithoutPostsDataInput!
  create: ThreadCreateWithoutPostsInput!
}

input ThreadUpsertWithWhereUniqueWithoutGroupInput {
  where: ThreadWhereUniqueInput!
  update: ThreadUpdateWithoutGroupDataInput!
  create: ThreadCreateWithoutGroupInput!
}

input ThreadWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  title: String
  title_not: String
  title_in: [String!]
  title_not_in: [String!]
  title_lt: String
  title_lte: String
  title_gt: String
  title_gte: String
  title_contains: String
  title_not_contains: String
  title_starts_with: String
  title_not_starts_with: String
  title_ends_with: String
  title_not_ends_with: String
  posts_every: PostWhereInput
  posts_some: PostWhereInput
  posts_none: PostWhereInput
  group: GroupWhereInput
  AND: [ThreadWhereInput!]
  OR: [ThreadWhereInput!]
  NOT: [ThreadWhereInput!]
}

input ThreadWhereUniqueInput {
  id: ID
}

type WikiPage {
  id: ID!
  createdAt: DateTime!
  content(where: WikiPageContentWhereInput, orderBy: WikiPageContentOrderByInput, skip: Int, after: String, before: String, first: Int, last: Int): [WikiPageContent!]
  group: Group!
}

type WikiPageConnection {
  pageInfo: PageInfo!
  edges: [WikiPageEdge]!
  aggregate: AggregateWikiPage!
}

type WikiPageContent {
  id: ID!
  createdAt: DateTime!
  page: WikiPage!
  title: String!
  content: String!
  author: Person!
  deleted: Boolean!
}

type WikiPageContentConnection {
  pageInfo: PageInfo!
  edges: [WikiPageContentEdge]!
  aggregate: AggregateWikiPageContent!
}

input WikiPageContentCreateInput {
  page: WikiPageCreateOneWithoutContentInput!
  title: String!
  content: String!
  author: PersonCreateOneInput!
  deleted: Boolean!
}

input WikiPageContentCreateManyWithoutPageInput {
  create: [WikiPageContentCreateWithoutPageInput!]
  connect: [WikiPageContentWhereUniqueInput!]
}

input WikiPageContentCreateWithoutPageInput {
  title: String!
  content: String!
  author: PersonCreateOneInput!
  deleted: Boolean!
}

type WikiPageContentEdge {
  node: WikiPageContent!
  cursor: String!
}

enum WikiPageContentOrderByInput {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  title_ASC
  title_DESC
  content_ASC
  content_DESC
  deleted_ASC
  deleted_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type WikiPageContentPreviousValues {
  id: ID!
  createdAt: DateTime!
  title: String!
  content: String!
  deleted: Boolean!
}

input WikiPageContentScalarWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  title: String
  title_not: String
  title_in: [String!]
  title_not_in: [String!]
  title_lt: String
  title_lte: String
  title_gt: String
  title_gte: String
  title_contains: String
  title_not_contains: String
  title_starts_with: String
  title_not_starts_with: String
  title_ends_with: String
  title_not_ends_with: String
  content: String
  content_not: String
  content_in: [String!]
  content_not_in: [String!]
  content_lt: String
  content_lte: String
  content_gt: String
  content_gte: String
  content_contains: String
  content_not_contains: String
  content_starts_with: String
  content_not_starts_with: String
  content_ends_with: String
  content_not_ends_with: String
  deleted: Boolean
  deleted_not: Boolean
  AND: [WikiPageContentScalarWhereInput!]
  OR: [WikiPageContentScalarWhereInput!]
  NOT: [WikiPageContentScalarWhereInput!]
}

type WikiPageContentSubscriptionPayload {
  mutation: MutationType!
  node: WikiPageContent
  updatedFields: [String!]
  previousValues: WikiPageContentPreviousValues
}

input WikiPageContentSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: WikiPageContentWhereInput
  AND: [WikiPageContentSubscriptionWhereInput!]
  OR: [WikiPageContentSubscriptionWhereInput!]
  NOT: [WikiPageContentSubscriptionWhereInput!]
}

input WikiPageContentUpdateInput {
  page: WikiPageUpdateOneRequiredWithoutContentInput
  title: String
  content: String
  author: PersonUpdateOneRequiredInput
  deleted: Boolean
}

input WikiPageContentUpdateManyDataInput {
  title: String
  content: String
  deleted: Boolean
}

input WikiPageContentUpdateManyMutationInput {
  title: String
  content: String
  deleted: Boolean
}

input WikiPageContentUpdateManyWithoutPageInput {
  create: [WikiPageContentCreateWithoutPageInput!]
  delete: [WikiPageContentWhereUniqueInput!]
  connect: [WikiPageContentWhereUniqueInput!]
  set: [WikiPageContentWhereUniqueInput!]
  disconnect: [WikiPageContentWhereUniqueInput!]
  update: [WikiPageContentUpdateWithWhereUniqueWithoutPageInput!]
  upsert: [WikiPageContentUpsertWithWhereUniqueWithoutPageInput!]
  deleteMany: [WikiPageContentScalarWhereInput!]
  updateMany: [WikiPageContentUpdateManyWithWhereNestedInput!]
}

input WikiPageContentUpdateManyWithWhereNestedInput {
  where: WikiPageContentScalarWhereInput!
  data: WikiPageContentUpdateManyDataInput!
}

input WikiPageContentUpdateWithoutPageDataInput {
  title: String
  content: String
  author: PersonUpdateOneRequiredInput
  deleted: Boolean
}

input WikiPageContentUpdateWithWhereUniqueWithoutPageInput {
  where: WikiPageContentWhereUniqueInput!
  data: WikiPageContentUpdateWithoutPageDataInput!
}

input WikiPageContentUpsertWithWhereUniqueWithoutPageInput {
  where: WikiPageContentWhereUniqueInput!
  update: WikiPageContentUpdateWithoutPageDataInput!
  create: WikiPageContentCreateWithoutPageInput!
}

input WikiPageContentWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  page: WikiPageWhereInput
  title: String
  title_not: String
  title_in: [String!]
  title_not_in: [String!]
  title_lt: String
  title_lte: String
  title_gt: String
  title_gte: String
  title_contains: String
  title_not_contains: String
  title_starts_with: String
  title_not_starts_with: String
  title_ends_with: String
  title_not_ends_with: String
  content: String
  content_not: String
  content_in: [String!]
  content_not_in: [String!]
  content_lt: String
  content_lte: String
  content_gt: String
  content_gte: String
  content_contains: String
  content_not_contains: String
  content_starts_with: String
  content_not_starts_with: String
  content_ends_with: String
  content_not_ends_with: String
  author: PersonWhereInput
  deleted: Boolean
  deleted_not: Boolean
  AND: [WikiPageContentWhereInput!]
  OR: [WikiPageContentWhereInput!]
  NOT: [WikiPageContentWhereInput!]
}

input WikiPageContentWhereUniqueInput {
  id: ID
}

input WikiPageCreateInput {
  content: WikiPageContentCreateManyWithoutPageInput
  group: GroupCreateOneInput!
}

input WikiPageCreateOneWithoutContentInput {
  create: WikiPageCreateWithoutContentInput
  connect: WikiPageWhereUniqueInput
}

input WikiPageCreateWithoutContentInput {
  group: GroupCreateOneInput!
}

type WikiPageEdge {
  node: WikiPage!
  cursor: String!
}

enum WikiPageOrderByInput {
  id_ASC
  id_DESC
  createdAt_ASC
  createdAt_DESC
  updatedAt_ASC
  updatedAt_DESC
}

type WikiPagePreviousValues {
  id: ID!
  createdAt: DateTime!
}

type WikiPageSubscriptionPayload {
  mutation: MutationType!
  node: WikiPage
  updatedFields: [String!]
  previousValues: WikiPagePreviousValues
}

input WikiPageSubscriptionWhereInput {
  mutation_in: [MutationType!]
  updatedFields_contains: String
  updatedFields_contains_every: [String!]
  updatedFields_contains_some: [String!]
  node: WikiPageWhereInput
  AND: [WikiPageSubscriptionWhereInput!]
  OR: [WikiPageSubscriptionWhereInput!]
  NOT: [WikiPageSubscriptionWhereInput!]
}

input WikiPageUpdateInput {
  content: WikiPageContentUpdateManyWithoutPageInput
  group: GroupUpdateOneRequiredInput
}

input WikiPageUpdateOneRequiredWithoutContentInput {
  create: WikiPageCreateWithoutContentInput
  update: WikiPageUpdateWithoutContentDataInput
  upsert: WikiPageUpsertWithoutContentInput
  connect: WikiPageWhereUniqueInput
}

input WikiPageUpdateWithoutContentDataInput {
  group: GroupUpdateOneRequiredInput
}

input WikiPageUpsertWithoutContentInput {
  update: WikiPageUpdateWithoutContentDataInput!
  create: WikiPageCreateWithoutContentInput!
}

input WikiPageWhereInput {
  id: ID
  id_not: ID
  id_in: [ID!]
  id_not_in: [ID!]
  id_lt: ID
  id_lte: ID
  id_gt: ID
  id_gte: ID
  id_contains: ID
  id_not_contains: ID
  id_starts_with: ID
  id_not_starts_with: ID
  id_ends_with: ID
  id_not_ends_with: ID
  createdAt: DateTime
  createdAt_not: DateTime
  createdAt_in: [DateTime!]
  createdAt_not_in: [DateTime!]
  createdAt_lt: DateTime
  createdAt_lte: DateTime
  createdAt_gt: DateTime
  createdAt_gte: DateTime
  content_every: WikiPageContentWhereInput
  content_some: WikiPageContentWhereInput
  content_none: WikiPageContentWhereInput
  group: GroupWhereInput
  AND: [WikiPageWhereInput!]
  OR: [WikiPageWhereInput!]
  NOT: [WikiPageWhereInput!]
}

input WikiPageWhereUniqueInput {
  id: ID
}
`