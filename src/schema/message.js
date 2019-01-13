import { gql } from 'apollo-server-express'

export default gql`
  type Query {
    messages(cursor: String, limit: Int): [Message!]!
    message(id: ID!): Message
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
`
