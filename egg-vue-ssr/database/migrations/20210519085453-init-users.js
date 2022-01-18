'use strict'

'use strict'

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize
    await queryInterface.createTable('users', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      username: { type: STRING(50), allowNull: false, unique: true },
      password: { type: STRING(64), allowNull: false },
      email: { type: STRING(50), allowNull: false, unique: true },
      phone: STRING(20),
      role_type: { type: INTEGER, allowNull: false, defaultValue: 2 },
      status: { type: INTEGER, allowNull: false, defaultValue: 2 },
      created_at: DATE,
      updated_at: DATE,
      last_login_at: DATE
    })
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users')
  }
}
