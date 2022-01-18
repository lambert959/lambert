module.exports = app => {
  const { STRING, INTEGER, DATE } = app.Sequelize

  const UserProjects = app.model.define('UserProjects', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    user_id: {
      type: INTEGER,
      references: {
        model: app.model.User,
        key: 'id'
      }
    },
    project_id: {
      type: INTEGER,
      references: {
        model: app.model.Project,
        key: 'id'
      }
    },
    status: { type: INTEGER, allowNull: false, defaultValue: 0 } // 0关闭，1打开
  }, { timestamps: false })

  return UserProjects
}
