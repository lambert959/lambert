const Controller = require('egg').Controller

class UsersController extends Controller {
  constructor (ctx) {
    super(ctx)
  }

  // 用户管理页面
  async userManage () {
    const { ctx } = this
    await ctx.render('userManage/list/list.js', { type: ctx.params.type })
  }

  async index () {
    const { ctx } = this
    const list = await ctx.service.user.list(ctx.query)
    list.rows = list.rows.filter(item => item.id !== ctx.user.id)
    ctx.body = {
      code: 0,
      data: list,
      msg: ctx.__('success')
    }
  }

  async show () {
    const { ctx } = this
    const user = await ctx.service.user.find(ctx.helper.toInt(ctx.params.id))
    if (!user) {
      ctx.body = {
        code: -1017,
        msg: ctx.__('error')
      }
      return
    }
    ctx.body = {
      code: 0,
      data: user,
      msg: ctx.__('success')
    }
  }

  async update () {
    const { ctx } = this
    const id = ctx.helper.toInt(ctx.params.id)
    const { email, phone } = ctx.request.body
    const user = await ctx.service.user.update({ id, updates: { email, phone }})
    if (!user) {
      ctx.body = {
        code: -1017,
        msg: ctx.__('error')
      }
      return
    }
    ctx.body = {
      code: 0,
      msg: ctx.__('success')
    }
  }

  async findSome () {
    const { ctx } = this
    const fuzzy = ctx.query.fuzzy
    const users = await ctx.service.user.fuzzyQuery(fuzzy)
    ctx.body = {
      code: 0,
      data: users,
      msg: ctx.__('success')
    }
  }

  async destroy () {
    const { ctx } = this
    const id = ctx.helper.toInt(ctx.params.id)
    // 删除项目需把关联的IDE docker容器清除
    await ctx.service.user.delete(id)
    ctx.status = 200
    ctx.body = {
      code: 0,
      data: null,
      msg: ctx.__('success')
    }
  }
  // 用户审核
  async passHandle () {
    const { ctx } = this
    const id = ctx.helper.toInt(ctx.params.id)
    if (!id) {
      ctx.body = {
        code: -1008,
        data: null,
        msg: ctx.__('users.invalidUserInfo')
      }
      return
    }

    const { status } = ctx.request.body
    if (!status) {
      ctx.body = {
        code: -1006,
        data: null,
        msg: ctx.__('users.invalidUserInfo')
      }
      return
    }

    await ctx.service.user.update({ id, updates: { status: ctx.helper.toInt(status) }})
    ctx.body = {
      code: 0,
      data: null, // user,
      msg: ctx.__('success')
    }
  }
}

module.exports = UsersController
