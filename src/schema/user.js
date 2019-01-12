import { gql } from 'apollo-server-express'

export default gql`
  type Query {
    me: User
    user(id: ID!): User
    users: [User]
  }

  type User {
    id: ID!
    username: String!
    email: String!
    messages: [Message!]
  }
`
