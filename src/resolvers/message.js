import { ForbiddenError } from 'apollo-server-express'
import { combineResolvers } from 'graphql-resolvers'
import { isAuthenticated, isMessageOwner } from './authorizaion'
import pubsub, { EVENTS } from '../subscription'

// base64 cursor
const toCursorHash = string => Buffer.from(string).toString('base64')
const fromCursorHash = string => Buffer.from(string, 'base64').toString('ascii')

// Provide resolver functions for your schema fields
export default {
  Query: {
    message: async (parent, { id }, { models }) => {
      return await models.Message.findById(id)
    },
    messages: async (parent, { cursor = 0, limit = 10 }, { models }) => {
      // use curse based paganation
      const messages = await models.Message.findAll({
        order: [['createdAt', 'DESC']],
        limit,
        where: cursor
          ? {
              createdAt: { $lt: fromCursorHash(cursor) }
            }
          : null
      })

      return {
        lists: messages,
        pageInfo: {
          hasNextPage: messages.length >= limit,
          endCursor: toCursorHash(messages[messages.length - 1].createdAt.toString())
        }
      }
    }
  },
  Mutation: {
    // add authentization middleware to createMessage
    createMessage: combineResolvers(isAuthenticated, async (parent, { text }, { me, models }) => {
      if (!me) {
        throw new ForbiddenError('请先登录')
      }
      const message = await models.Message.create({
        text,
        userId: me.id
      })

      // publish the created message subscription
      pubsub.publish(EVENTS.MESSAGE.CREATED, {
        messageCreated: { message }
      })

      return message
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
  },
  // create message subscription
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.MESSAGE.CREATED)
    }
  }
}
