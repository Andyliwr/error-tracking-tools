import { gql } from 'apollo-server-express'

export default gql`
  type Query {
    messages(cursor: String, limit: Int): MessageConnect!
    message(id: ID!): Message
  }

  type MessageConnect {
    lists: [Message!]!,
    pageInfo: PageInfo!
  }

  type PageInfo {
    endCursor: String!
    hasNextPage: Boolean!
  }

  type Message {
    id: ID!
    text: String!
    createdAt: Date!
    user: User!
  }

  type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean
  }

  type Subscription {
    messageCreated: MessageCreated!
  }

  type MessageCreated {
    message: Message!
  }
`
