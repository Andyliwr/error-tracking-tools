import { gql } from 'apollo-server-express';

export default gql`
  type Query {
    messages: [Message!]!
    message(id: ID!): Message
  }

  type Message {
    id: ID!
    text: String!
    user: User!
  }

  type Mutation {
    createMessage(text: String!): Message!
    deleteMessage(id: ID!): Boolean
  }
`
