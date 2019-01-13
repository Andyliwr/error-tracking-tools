import { gql } from 'apollo-server-express'
import { mergeTypes } from 'merge-graphql-schemas'

import userSchema from './user'
import messageSchema from './message'

// The linkSchema defines all types shared within the schemas.
// GraphQL Custom Scalars
const linkSchema = gql`
  scalar Date  

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }

  type Subscription {
    _: Boolean
  }
`

export default mergeTypes([linkSchema, userSchema, messageSchema], { all: true })
