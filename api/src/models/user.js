import bcrypt from 'bcrypt'

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
    },
    role: {
      type: DataTypes.STRING
    }
  })

  // relation
  User.associate = models => {
    User.hasMany(models.Message, { onDelete: 'CASCADE' })
  }

  // define a hook function that is executed every time a user entity is created
  // use bcrypt to hash user password
  User.beforeCreate(async user => {
    user.password = await user.generatePasswordHash()
  })

  // generatePasswordHash added to the user’s prototype chain. so the instance of User can call it
  User.prototype.generatePasswordHash = async function() {
    const saltRounds = 12
    return await bcrypt.hash(this.password, saltRounds)
  }

  User.prototype.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password)
  }

  // find user by name or email
  // define a database method
  User.findByLogin = async nameOrEmail => {
    return await User.findOne({
      where: {
        $or: {
          username: nameOrEmail,
          email: nameOrEmail
        }
      }
    })
  }

  return User
}

export default user
