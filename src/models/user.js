const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING
    }
  })

  // relation
  User.associate = models => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' })
  }

  // find user by name or email
  // define a database method
  User.findByNameOrEmail = async nameOrEmail => {
    return await User.findOne({
      where: {
        username: nameOrEmail
      }
    })
  }

  return User
}

export default user
