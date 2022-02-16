module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize

  const Project = app.model.define('Project', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: STRING(50), allowNull: false },
    type: { type: INTEGER, allowNull: false, defaultValue: 1 }, // 1:prolin
    address: { type: STRING(100), allowNull: false },
    description: STRING(200),
    created_user_id: { type: INTEGER, allowNull: false },
    container_id: STRING(20),
    ide_url: STRING(200),
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
    }
  })

  Project.findByNameAndUserId = async function(name, userId) {
    return await this.findOne({
      where: {
        name: name,
        created_user_id: userId
      }
    });
  }

  Project.associate = function () {
    app.model.Project.belongsToMany(app.model.User, { through: 'UserProjects' })
  }

  return Project
}
