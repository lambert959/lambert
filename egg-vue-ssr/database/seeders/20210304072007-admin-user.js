'use strict'
const crypto = require('crypto')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const salt = crypto.randomBytes(4).toString('hex') // length=8;
    const password = crypto.createHash('md5').update('Pax@123456').digest('hex')
    return queryInterface.bulkInsert('users', [{
      username: 'admin',
      password: `${password}${salt}`,
      email: 'admin@paxsz.com',
      role_type: 1,
      status: 1,
      created_at: new Date(),
      updated_at: new Date(),
      last_login_at: new Date()
    }], {})
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('users', null, {})
  }
}
