'use strict'

const Service = require('egg').Service
const { Op } = require('sequelize')
const cp = require('child_process')

class User extends Service {
  async list (query) {
    const { ctx } = this
    const { pageNum = 1, pageSize = 10, status = '' } = query
    const offset = (ctx.helper.toInt(pageNum) - 1) * ctx.helper.toInt(pageSize)
    const limit = ctx.helper.toInt(pageSize)
    const where = {
      status: ctx.helper.toInt(status)
    }
    return await ctx.model.User.findAndCountAll({
      offset,
      limit,
      where,
      attributes: { exclude: ['password'] },
      order: [[ 'created_at', 'desc' ], [ 'id', 'desc' ]]
    })
  }

  async find (id) {
    const user = await this.ctx.model.User.findByPk(id)
    if (!user) {
      this.ctx.throw(404, 'user not found')
    }
    return user
  }

  async fuzzyQuery (queryString) {
    const users = await this.ctx.model.User.findAll({
      raw: true,
      attributes: ['id', 'username', 'status'],
      where: {
        username: {
          [Op.like]: `%${queryString}%`
        }
      }
    })
    return users
  }

  async findByEmail (queryString) {
    const users = await this.ctx.model.User.findAll({
      raw: true,
      attributes: ['id', 'email', 'status', 'username'],
      where: {
        email: {
          [Op.like]: `%${queryString}%`
        }
      }
    })
    return users
  }

  async findByUsername (username) {
    const count = await this.ctx.model.User.findOne({
      where: {
        username
      }
    })
    return count
  }

  async countAllbyUsername (username) {
    const count = await this.ctx.model.User.count({
      where: {
        username: {
          [Op.eq]: username
        }
      }
    })
    return count
  }

  async countAllbyEmail (email) {
    const count = await this.ctx.model.User.count({
      where: {
        email
      }
    })
    return count
  }

  async create (user) {
    user['createdAt'] = new Date()
    return this.ctx.model.User.create(user)
  }

  async update ({ id, updates }) {
    console.log('userid', id)
    const user = await this.ctx.model.User.findByPk(id)
    if (!user) {
      this.ctx.throw(404, 'user not found')
    }
    return user.update(updates)
  }

  async delete (id) {
    const user = await this.ctx.model.User.findByPk(id)
    if (!user) {
      this.ctx.throw(404, 'user not found')
    }

    // Delete the relative container when user is deleted
    const containerId = user.container_id
    if (containerId) {
      cp.exec(`docker stop ${containerId}; docker rm ${containerId}`, function (err, stdout, stderr) {
        if (err) {
          console.error(err)
        }
        // await user.update({ container_id: '', ide_url: '' })
      })
    }
    // Delete the relative emulator when user is deleted
    const emulatorId = user.emulator_id
    if (emulatorId) {
      cp.exec(`docker stop ${emulatorId}; docker rm ${emulatorId}`, function (err, stdout, stderr) {
        if (err) {
          console.error(err)
        }
        // await user.update({ container_id: '', ide_url: '' })
      })
    }
    return user.destroy()
  }
}

module.exports = User
