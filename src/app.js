import http from 'http'
import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import jwt from 'jsonwebtoken'
import DataLoader from 'dataloader'
import { AuthenticationError, ApolloServer } from 'apollo-server-express'

import schema from './schema'
import resolvers from './resolvers'
import models, { sequelize } from './models'
import loaders from './loaders'
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

// dataloader
const userLoader = new DataLoader(keys => loaders.user.batchUsers(keys, models))

const app = express()
app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

const httpServer = http.createServer(app)
const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: async ({ req, connection }) => {
    // The function is invoked every time a request hits your GraphQL API
    // if it is subscription, only contains connection and no req
    if (connection) {
      return {
        models,
        loaders: {
          user: userLoader
        }
      }
    }
    // if it is request, connection is undefined
    if (req) {
      const me = await getMe(req)
      return {
        models,
        me,
        secret: config.jwt_token_secret,
        loaders: {
          user: userLoader
        }
      }
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

server.installSubscriptionHandlers(httpServer)
server.applyMiddleware({ app, path: '/graphql' })

const eraseDatabaseOnSync = false // drop database when application started

sequelize.sync({ force: eraseDatabaseOnSync || !!process.env.TEST_DATABASE }).then(async () => {
  // in test mode, start application after clean at every times
  if (eraseDatabaseOnSync || !!process.env.TEST_DATABASE) {
    createUserWithMessage()
  }
  httpServer.listen({ port: config.port || 4000 }, () => console.log(`🚀 Server ready at http://localhost:${4000}${server.graphqlPath}`))
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
  await models.User.create(
    {
      username: 'andyliwr2',
      email: 'andyliwr2@outlook.com',
      password: '12345678',
      role: 'user',
      messages: [
        {
          text: 'I love you!',
          createdAt: new Date()
        }
      ]
    },
    {
      include: [models.Message]
    }
  )
}
