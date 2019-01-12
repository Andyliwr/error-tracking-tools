const message = (squelize, DataTypes) => {
  const Message = squelize.define('message', {
    text: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: { args: true, msg: 'Text can\'t be an empty string' }
      }
    }
  })

  Message.associate = models => {
    Message.belongsTo(models.User)
  }

  return Message
}

export default message
