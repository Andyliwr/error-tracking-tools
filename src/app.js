import express from 'express'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import { AuthenticationError, ApolloServer } from 'apollo-server-express'

import schema from './schema'
import resolvers from './resolvers'
import models, { sequelize } from './models'
import config from './config'

const getMe = async req => {
  const token = req.headers['x-token']
  // allow http request without x-token, like signIn and signUp
  if (token) {
    try {
      return await jwt.verify(token, config.jwt_token_secret)
    } catch (err) {
      // when token invilid or expired
      throw new AuthenticationError('登录状态失效，请重新登录')
    }
  }
}

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async ({ req }) => {
    // The function is invoked every time a request hits your GraphQL API
    const me = await getMe(req)
    return {
      models,
      me,
      secret: config.jwt_token_secret
    }
  },
  // format error message by yourself
  formatError: error => {
    // remove the internal sequelize error message
    // leave only the important validation error
    const message = error.message.replace('SequelizeValidationError: ', '').replace('Validation error: ', '')
    return {
      ...error,
      message
    }
  }
})

const app = express()
app.use(cors())
server.applyMiddleware({ app, path: '/graphql' })

const eraseDatabaseOnSync = false // drop database when application started

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) {
    createUserWithMessage()
  }
  app.listen({ port: config.port || 4000 }, () => console.log(`🚀 Server ready at http://localhost:${4000}${server.graphqlPath}`))
})

// create testing user and message
async function createUserWithMessage() {
  await models.User.create(
    {
      username: 'andyliwr',
      email: 'andyliwr@outlook.com',
      password: '12345678',
      role: 'admin',
      messages: [
        {
          text: 'Hello, GraphQL!',
          createdAt: new Date()
        }
      ]
    },
    {
      include: [models.Message]
    }
  )
}
