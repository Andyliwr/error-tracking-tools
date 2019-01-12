import uuid from 'uuid'

// Provide resolver functions for your schema fields
export default {
  Query: {
    message: (parent, {id}, {models}) => {
      return models.messages[id]
    },
    messages: (parent, args, {models}) => {
      return Object.values(models.messages)
    }
  },
  Mutation: {
    createMessage: (parent, {text}, {me, models}) => {
      const id = uuid.v1()
      const message = {
        id,
        text,
        userid: me.id
      }
      models.messages[id] = message
      console.log(models.messages)
      models.users[me.id].messageIds.push(id)
      return message
    },
    deleteMessage: (parent, {id}, {me, models}) => {
      if (models.messages[id]) {
        delete models.messages[id]
        models.users[me.id].messageIds = models.users[me.id].messageIds.filter(item => {
          return item !== id
        })
        return true
      } else {
        return false
      }
    }
  },
  Message: {
    user: (message, args, {models}) => {
      return models.users[message.userid]
    }
  }
}
