// Provide resolver functions for your schema fields
export default {
  Query: {
    me: async (parent, args, { me, models }) => {
      return await models.User.findById(me.id)
    },
    user: async (parent, args, context, info) => {
      /**
       * parent: always returns the previously resolved field
       * args: parameters for detail query
       * content: save global data or user auth data
       * info: gives you internal information about the GraphQL request, used for debugging, error handling
       */
      return await context.models.findById(args.id)
    },
    users: async (parent, args, { models }) => {
      return await models.User.findAll() // return all enumerable key value of users
    }
  },
  User: {
    // new resolves to fromat some filed of user, user equal parent
    username: user => {
      return 'This is ' + user.username
    },
    messages: async (user, args, { models }) => {
      return await models.Message.findAll({
        where: {
          userId: user.id
        }
      })
    }
  }
}
