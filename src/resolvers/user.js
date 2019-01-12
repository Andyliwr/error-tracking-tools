import jwt from 'jsonwebtoken'
import { AuthenticationError, UserInputError } from 'apollo-server-express'

const createToken = async (user, secret, expiresIn) => {
  const { id, email, username } = user;
  return await jwt.sign({ id, email, username }, secret, { expiresIn })
}

// Provide resolver functions for your schema fields
export default {
  Query: {
    me: async (parent, args, { me, models }) => {
      if (!me) {
        return null
      }
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
  Mutation: {
    signUp: async (parent, { username, email, password }, { models, secret }) => {
      const user = await models.User.create({
        username,
        email,
        password
      })

      return { token: createToken(user, secret, '2h') }
    },
    signIn: async (parent, { login, password }, { models, secret }) => {
      const user = await models.User.findByLogin(login)
      if (!user) {
        throw new UserInputError('用户名或邮箱错误')
      }

      const isValid = await user.validatePassword(password)
      if (!isValid) {
        throw new AuthenticationError('密码错误')
      }

      return { token: createToken(user, secret, '2h') }
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
