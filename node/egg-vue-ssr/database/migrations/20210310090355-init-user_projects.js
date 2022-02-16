'use strict'

module.exports = {
  // 在执行数据库升级时调用的函数，创建 user_projects 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER } = Sequelize
    await queryInterface.createTable('user_projects', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      user_id: { type: INTEGER },
      project_id: { type: INTEGER },
      status: { type: INTEGER, allowNull: false, defaultValue: 0 }
    })
  },
  // 在执行数据库降级时调用的函数，删除 user_projects 表
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('user_projects')
  }
}
