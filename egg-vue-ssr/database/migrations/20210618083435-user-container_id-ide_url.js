'use strict'

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.addColumn('users', 'container_id', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t }),
        queryInterface.addColumn('users', 'ide_url', {
          type: Sequelize.DataTypes.STRING
        }, { transaction: t })
      ])
    })
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(t => {
      return Promise.all([
        queryInterface.removeColumn('users', 'container_id', { transaction: t }),
        queryInterface.removeColumn('users', 'ide_url', { transaction: t })
      ])
    })
  }
}
