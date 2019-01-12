const message = (squelize, DataTypes) => {
  const Message = squelize.define('message', {
    text: {
      type: DataTypes.STRING
    }
  })

  Message.associate = models => {
    Message.belongsTo(models.User)
  }

  return Message
}

export default message
