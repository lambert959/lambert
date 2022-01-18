module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize

  const User = app.model.define('User', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: STRING(50), allowNull: false, unique: true },
    password: {
      type: STRING(64),
      allowNull: false
    },
    email: { type: STRING(50), allowNull: false, unique: true },
    phone: STRING(20),
    role_type: { type: INTEGER, allowNull: false, defaultValue: 2 }, // 1:超级管理员, 2:普通用户
    status: { type: INTEGER, allowNull: false, defaultValue: 2 }, // 0:禁用, 1:正常, 2:未审核默认, 3:审核不通过, 4: 待激活
    container_id: STRING(20),
    ide_url: STRING(200),
    emulator_id: STRING(20),
    emulator_url: STRING(200),
    xcb_channel: STRING(50),
    createdAt: {
      type: DATE,
      get () {
        const timeStamp = new Date(this.getDataValue('createdAt')).getTime()
        return timeStamp
      }
    },
    updatedAt: {
      type: DATE,
      get () {
        const timeStamp = new Date(this.getDataValue('updatedAt')).getTime()
        return timeStamp
      }
    },
    lastLoginAt: {
      type: DATE,
      get () {
        const timeStamp = new Date(this.getDataValue('lastLoginAt')).getTime()
        return timeStamp
      }
    }
  })

  User.associate = function () {
    app.model.User.belongsToMany(app.model.Project, { through: 'UserProjects' })
  }
  User.validPassword = async function (id, password) {
    const user = await this.findOne({
      where: { id }
    })
    const eq = password === user.password.slice(0, -8)
    console.log(eq)
    return eq
  }
  return User
}
