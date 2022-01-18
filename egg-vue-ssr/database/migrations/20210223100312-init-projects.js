'use strict'

module.exports = {
  // 在执行数据库升级时调用的函数，创建 projects 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize
    await queryInterface.createTable('projects', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: STRING(50), allowNull: false },
      type: { type: INTEGER, allowNull: false, defaultValue: 1 },
      address: { type: STRING(100), allowNull: false },
      description: STRING(200),
      created_user_id: { type: INTEGER, allowNull: false },
      container_id: STRING(20),
      ide_url: STRING(200),
      created_at: DATE,
      updated_at: DATE
    })
  },
  // 在执行数据库降级时调用的函数，删除 projects 表
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('projects')
  }
}
