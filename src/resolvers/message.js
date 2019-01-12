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
    createMessage: async (parent, { text }, { me, models }) => {
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
      return models.User.findById(message.userId)
    }
  }
}
