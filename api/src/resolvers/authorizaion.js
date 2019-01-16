import { ForbiddenError } from 'apollo-server-express'
import { skip, combineResolvers } from 'graphql-resolvers'
import models from '../models'

// check user is logined
export const isAuthenticated = (parent, args, { me }) => (me ? skip : new ForbiddenError('请先登录'))

// check user is the owner of message
export const isMessageOwner = async (parent, { id }, { models, me }) => {
  const message = await models.Message.findById(id, { row: true })
  if (!message) {
    throw new ForbiddenError('此消息不存在')
  }
  if (message.userId !== me.id) {
    throw new ForbiddenError('你没权限删除这条消息')
  }
  return skip
}

// check user is admin
export const isAdmin = combineResolvers(isAuthenticated, async (parent, args, { me }) => (me.role === 'admin' ? skip : new ForbiddenError('需要管理员权限')))
