import uuid from 'uuid'

// Provide resolver functions for your schema fields
export default {
  Query: {
    message: async (parent, { id }, { models }) => {
      return await models.Message.findByPK(id)
    },
    messages: async (parent, args, { models }) => {
      return await models.Message.findAll()
    }
  },
  Mutation: {
    createMessage: async (parent, { text }, { me, models }) => {
      return await models.Message.create({
        text,
        userId: me.id
      })
    },
    deleteMessage: async (parent, { id }, { me, models }) => {
      return await models.Message.destroy({
        where: {
          id
        }
      })
    }
  },
  Message: {
    user: (message, args, { models }) => {
      return models.User.findByPK(message.userId)
    }
  }
}
