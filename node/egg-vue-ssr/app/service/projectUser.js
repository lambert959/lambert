'use strict'

const Service = require('egg').Service
const { Op } = require('sequelize')

class ProjectUser extends Service {
  async findUsers (projectId) {
    const userProjects = await this.ctx.model.UserProjects.findAll({
      attributes: ['user_id'],
      where: {
        project_id: projectId
      }
    })
    const useIds = userProjects.map((item) => item.user_id)
    const users = await this.ctx.model.User.findAll({
      where: {
        id: {
          [Op.or]: useIds
        }
      }
    })
    return users
  }

  async findOne (projectId, userId) {
    const userProject = await this.ctx.model.UserProjects.findOne({ where: { user_id: userId, project_id: projectId }})
    return userProject
  }

  async addMember (projectId, userId) {
    const addList = Array.isArray(userId) ? userId.map(id => { return { user_id: id, project_id: projectId } }) : [{ user_id: userId, project_id: projectId }]
    const userProject = await this.ctx.model.UserProjects.bulkCreate(addList)
    return userProject
  }

  async deleteMember (projectId, userId) {
    return this.ctx.model.UserProjects.destroy({
      where: {
        project_id: projectId,
        user_id: userId
      }
    })
  }

  async findOwnProject (id, name) {
    const where = {}
    where.created_user_id = id
    if (name) {
      where.name = { [Op.like]: `%${name}%` }
    }
    const project = await this.ctx.model.Project.findAll({
      attributes: { exclude: ['address'] },
      where,
      order: [[ 'created_at', 'desc' ], [ 'id', 'desc' ]]
    })
    if (!project) {
      this.ctx.throw(404, 'project not found')
    }
    return project
  }

  async findJoinProject (id, name) {
    const projects = await this.ctx.model.UserProjects.findAll({
      attributes: ['project_id'],
      where: {
        user_id: id
      }
    })
    if (projects.length === 0) {
      return
    }
    const projectIds = projects.map((item) => item.project_id)

    const where = {}
    where.id = { [Op.or]: projectIds }
    where.created_user_id = { [Op.ne]: id }
    if (name) {
      where.name = { [Op.like]: `%${name}%` }
    }

    const joinProjects = await this.ctx.model.Project.findAll({
      attributes: { exclude: ['address', 'description'] },
      where,
      order: [[ 'created_at', 'desc' ], [ 'id', 'desc' ]]
    })
    if (!joinProjects) {
      this.ctx.throw(404, 'project not found')
    }
    return joinProjects
  }
}

module.exports = ProjectUser
