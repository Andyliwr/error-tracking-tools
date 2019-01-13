import { ForbiddenError } from 'apollo-server-express'
import { combineResolvers } from 'graphql-resolvers'
import { isAuthenticated, isMessageOwner } from './authorizaion'

// Provide resolver functions for your schema fields
export default {
  Query: {
    message: async (parent, { id }, { models }) => {
      return await models.Message.findById(id)
    },
    messages: async (parent, args, { models }) => {
      return await models.Message.findAll()
    }
  },
  Mutation: {
    // add authentization middleware to createMessage
    createMessage: combineResolvers(isAuthenticated, async (parent, { text }, { me, models }) => {
      if (!me) {
        throw new ForbiddenError('请先登录')
      }
      return await models.Message.create({
        text,
        userId: me.id
      })
      // define you owner error message, graphql will transfrom it
      // try {
      //   // do something
      // } catch(err) {
      //   throw new Error('you owner error message')
      // }
    }),
    deleteMessage: combineResolvers(isAuthenticated, isMessageOwner, async (parent, { id }, { me, models }) => {
      return await models.Message.destroy({
        where: {
          id
        }
      })
    })
  },
  Message: {
    user: (message, args, { models }) => {
      return models.User.findById(message.userId)
    }
  }
}
