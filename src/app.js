import express from 'express'
import cors from 'cors';
import { ApolloServer } from 'apollo-server-express'

import schema from './schema'
import resolvers from './resolvers'
import models, { sequelize } from './models'
import config from './config'

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  context: {
    models,
    me: models.User.findByNameOrEmail('Andyliwr')
  }
})
 
const app = express()
app.use(cors())
server.applyMiddleware({ app, path: '/graphql' })

const eraseDatabaseOnSync = true // drop database when application started

sequelize.sync({ force: eraseDatabaseOnSync }).then(async () => {
  if (eraseDatabaseOnSync) createUserWithMessage()
  app.listen({ port: config.port || 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:${4000}${server.graphqlPath}`)
  )
})

// create testing user and message
async function createUserWithMessage() {
  await models.User.create({
    username: 'Andyliwr',
    messages: [
      {
        text: 'Hello, GraphQL!'
      }
    ]
  }, {
    include: [models.Message]
  })
}
