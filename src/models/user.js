const user = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: { //validator will transform JavaScript errors into valid GraphQL output
        notEmpty: { args: true, msg: '用户名必填' }
      }
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: { args: true, msg: '邮箱必填' },
        isEmail: { args: true, msg: '邮箱格式不合法' }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { args: true, msg: '密码必填' },
        len: { args: [7, 42], msg: '密码长度需要在7到42位之间' }
      }
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
