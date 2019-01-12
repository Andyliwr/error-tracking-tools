// Provide resolver functions for your schema fields
export default {
  Query: {
    me: (parent, args, {me}) => {
      return me
    },
    user: (parent, args, context, info) => {
      /**
       * parent: always returns the previously resolved field
       * args: parameters for detail query
       * content: save global data or user auth data
       * info: gives you internal information about the GraphQL request, used for debugging, error handling
       */
      return context.models.users[args.id]
    },
    users: (parent, args, {models}) => {
      return Object.values(models.users) // return all enumerable key value of users
    }
  },
  User: {
    // new resolves to fromat some filed of user, user equal parent
    username: user => { 
      return 'This is ' + user.username
    },
    messages: (user, args, {models}) => {
      return Object.values(models.messages).filter(item => {
        return item.userid === user.id
      })
    }
  }
}
