'use strict'

const Service = require('egg').Service
const { Op } = require('sequelize')

class ProjectService extends Service {
  // offset 起始页， limit 每页展示条数 offset = page * limit - limit
  async index (query) {
    const { ctx } = this
    const { pageNum, pageSize, name } = query
    const offset = (ctx.helper.toInt(pageNum) - 1) * ctx.helper.toInt(pageSize)
    const limit = ctx.helper.toInt(pageSize)
    const where = {}
    if (name) {
      where.name = { [Op.like]: `%${name}%` }
    }
    // 普通用户只能查询自己创建的项目列表
    if (ctx.user.role_type === 2) {
      where.created_user_id = ctx.user.id
    }
    return ctx.model.Project.findAndCountAll({
      offset,
      limit,
      attributes: { exclude: ['address'] },
      where,
      order: [[ 'created_at', 'desc' ], [ 'id', 'desc' ]]
    })
  }

  async find (id) {
    const project = await this.ctx.model.Project.findByPk(id)
    if (!project) {
      this.ctx.throw(404, 'project not found')
    }
    return project
  }

  async create (project) {
    const projectData = await this.ctx.model.Project.create(project)
    await this.ctx.model.UserProjects.create({ user_id: this.ctx.user.id, project_id: projectData.id, status: 0 })
    return projectData
  }

  async update ({ id, updates }) {
    const project = await this.ctx.model.Project.findByPk(id)
    if (!project) {
      this.ctx.throw(404, 'project not found')
    }
    return project.update(updates)
  }

  async delete (id) {
    const project = await this.ctx.model.Project.findByPk(id)
    if (!project) {
      this.ctx.throw(404, 'project not found')
    }
    this.ctx.service.projectAddr.rmdirAsync(project.address);
    await this.ctx.model.UserProjects.destroy({
      where: {
        project_id: project.id
      }
    })
    return project.destroy()
  }

  // Find the project by name and created_user_id
  async findByNameAndUserId (name, userId) {
    const project = await this.ctx.model.Project.findByNameAndUserId(name, userId)
    return project
  }
}

module.exports = ProjectService
