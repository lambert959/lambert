const Controller = require('egg').Controller
const formidable = require('formidable')

class ProjectController extends Controller {
  constructor (ctx) {
    super(ctx)
    this.projectRule = {
      name: { type: 'string', required: true, allowEmpty: false, max: 50 },
      type: { type: 'number', required: true, allowEmpty: false },
      template: { type: 'number', required: true, allowEmpty: false },
      description: { type: 'string', required: false, max: 200 }
    }
    this.otherRule = {
      id: { type: 'number', required: true }
    }
  }

  async getSearchList () {
    const { ctx } = this
    const useId = ctx.user.id
    const { chooseType, searchName } = ctx.query
    let result = []
    if (chooseType === '1') {
      result = await ctx.service.projectUser.findOwnProject(useId, searchName)
    } else {
      result = await ctx.service.projectUser.findJoinProject(useId, searchName)
    }
    ctx.body = {
      code: 0,
      data: result,
      msg: ctx.__('success')
    }
  }

  async openProject () {
    const { ctx } = this
    const projectId = ctx.helper.toInt(ctx.query.projectId)
    const project = await ctx.service.project.find(projectId)
    const projectUrl = project.ide_url || await ctx.service.projectIde.open(project)
    if (projectUrl) {
      ctx.body = {
        code: 0,
        data: projectUrl,
        msg: ctx.__('success')
      }
    } else {
      ctx.body = {
        code: -1,
        data: null,
        msg: ctx.__('project.openFailed')
      }
    }
  }

  // Open all the projects in the IDE
  async openAllProject () {
    const { ctx } = this
    const id = ctx.helper.toInt(ctx.user.id)
    const user = await ctx.service.user.find(id)
    const projectUrl = user.ide_url || await ctx.service.projectIde.openAll(user)
    if (projectUrl) {
      ctx.body = {
        code: 0,
        data: `ide/user/${user.username}`,
        msg: ctx.__('success')
      }
    } else {
      ctx.body = {
        code: -1,
        data: null,
        msg: ctx.__('project.openFailed')
      }
    }
  }

  async closeProject () {
    const { ctx } = this
    const projectId = ctx.query.projectId
    const project = await ctx.service.project.find(projectId)
    await ctx.service.projectIde.close(project)
    ctx.body = {
      code: 0,
      data: null,
      msg: ctx.__('success')
    }
  }

  async getProjectMem () {
    const { ctx } = this
    const projectId = ctx.query.projectId
    const members = await ctx.service.projectUser.findUsers(projectId)
    ctx.body = {
      code: 0,
      data: members,
      msg: ctx.__('success')
    }
  }

  async addProjectMem () {
    const { ctx } = this
    const { projectId, userId } = ctx.request.body
    const { userProject, created } = await ctx.service.projectUser.addMember(projectId, userId)
    if (created) {
      ctx.body = {
        code: 0,
        data: userProject,
        msg: ctx.__('success')
      }
    } else {
      ctx.body = {
        code: -1,
        data: null,
        msg: ctx.__('project.memberExists')
      }
    }
  }

  async deleteProjectMem () {
    const { ctx } = this
    const { projectId, userId } = ctx.query
    await ctx.service.projectUser.deleteMember(projectId, userId)
    ctx.body = {
      code: 0,
      data: null,
      msg: ctx.__('success')
    }
  }

  async listPage () {
    const { ctx } = this
    await ctx.render('project/list/list.js', {})
  }

  async createPage () {
    const { ctx } = this
    await ctx.render('project/create/create.js', {})
  }

  async index () {
    const { ctx } = this
    const projectList = await ctx.service.project.index(ctx.query)
    ctx.body = {
      code: 0,
      data: projectList,
      msg: ctx.__('success')
    }
  }

  async show () {
    const { ctx } = this
    ctx.body = await ctx.service.project.find(ctx.helper.toInt(ctx.params.id))
  }

  async create () {
    const { ctx } = this
    const form = new formidable.IncomingForm()
    const extraParams = await new Promise((resolve, reject) => {
      form.parse(ctx.req, (err, fields, files) => {
        resolve({ fields, files })
      })
    })
    const {
      name,
      type,
      users,
      template,
      description
    } = extraParams && extraParams.fields
    if (!name || !type || !template) {
      ctx.body = {
        code: -1,
        data: null,
        msg: ctx.__('project.parameterErr')
      }
      return
    }

    // if project name has been taken by the user
    const project = await ctx.service.project.findByNameAndUserId(name, ctx.user.id)
    if (project) {
      ctx.body = {
        code: -10010,
        msg: ctx.__('project.projectNameTaken'),
      }
      return
    }
    const address = await ctx.service.projectAddr.getAddr(name)
    if (Number(template) === 2) { // typeof template is string
      await ctx.service.projectAddr.copyTempFile(address, type)
    }
    if (Number(template) === 3) {
      const { uploadFile } = extraParams.files
      await ctx.service.projectAddr.uploadFile(address, uploadFile)
    }
    const projectData = await ctx.service.project.create({
      name,
      type,
      address,
      description,
      created_user_id: ctx.user.id
    })
    if (!projectData) {
      ctx.status = 405
      ctx.body = {
        code: 10010,
        data: null,
        msg: ctx.__('error')
      }
    }
    if (users) {
      const userArray = users.split(',')
      // Write database
      const { created } = await ctx.service.projectUser.addMember(projectData.id, userArray)
      if (!created) {
        ctx.status = 405
        ctx.body = {
          code: 10010,
          data: null,
          msg: ctx.__('error')
        }
      }
      // copy project files to every memeber
      const srcUsrId = `${ctx.user.id}`
      userArray.forEach(v => {
        const dstUserId = v
        ctx.service.projectAddr.copyUserDir(address, dstUserId)
      })
    }

    ctx.status = 201
    ctx.body = {
      code: 0,
      data: projectData,
      msg: ctx.__('success')
    }
  }

  async update () {
    const { ctx } = this
    const id = ctx.helper.toInt(ctx.params.id)
    const { name, description, users } = ctx.request.body
    const project = await ctx.service.project.update({ id, updates: { name, description }})
    if (!project) {
      ctx.body = {
        code: -1,
        data: null,
        msg: ctx.__('error')
      }
      return
    }
    let oldUsers = await ctx.service.projectUser.findUsers(id)
    oldUsers = oldUsers ? oldUsers.map(user => user.dataValues.id).filter(user => project.created_user_id !== id) : []
    // console.log('oldUsers, newUsers===============', oldUsers, users)
    if (oldUsers.length === 0) { // 没有旧成员
      const projectUser = await ctx.service.projectUser.addMember(id, users)
      if (!projectUser) {
        ctx.body = {
          code: -1,
          data: null,
          msg: ctx.__('success')
        }
        return
      }
      ctx.body = {
        code: 0,
        data: project,
        msg: ctx.__('success')
      }
      return
    }
    const newUsers = users
    const diffUsers = oldUsers.concat(newUsers).filter(function (v, i, arr) { // 不同的项
      return arr.indexOf(v) === arr.lastIndexOf(v)
    })
    const diffOldUsers = oldUsers.filter(user => diffUsers.includes(user)) // 旧列表中要删除的项
    const diffNewUsers = newUsers.filter(user => diffUsers.includes(user)) // 新列表中要新增的项
    if (diffUsers.length === 0) { // 没有改变成员
      ctx.body = {
        code: 0,
        data: project,
        msg: ctx.__('success')
      }
    }
    // console.log('oldUsers中不同的项===================', diffOldUsers)
    for (const user of diffOldUsers) {
      const delMember = await ctx.service.projectUser.deleteMember(id, user)
      if (!delMember) {
        // console.log('删除原有的失败====================', user)
        ctx.body = {
          code: -1,
          data: null,
          msg: ctx.__('success')
        }
        break
      }
    }
    // console.log('newUsers中不同的项===================', diffNewUsers)
    if (diffNewUsers.length > 0) {
      const projectUser = await ctx.service.projectUser.addMember(id, diffNewUsers)
      if (!projectUser) {
        ctx.body = {
          code: -1,
          data: null,
          msg: ctx.__('success')
        }
        return
      }
    }
    ctx.body = {
      code: 0,
      data: project,
      msg: ctx.__('success')
    }
  }

  async destroy () {
    const { ctx } = this
    const id = ctx.helper.toInt(ctx.params.id)
    // 删除项目需把关联的IDE docker容器清除
    const project = await ctx.service.project.find(id)
    await ctx.service.projectIde.close(project)
    await ctx.service.project.delete(id)
    ctx.status = 200
    ctx.body = {
      code: 0,
      data: null,
      msg: ctx.__('success')
    }
  }
}

module.exports = ProjectController
