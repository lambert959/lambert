const Controller = require('egg').Controller
const fs = require('fs')
const path = require('path')
const { decrypt, generateKeys } = require('../util/rsa/index')

class PersonController extends Controller {
  constructor (ctx) {
    super(ctx)
  }

  // 个人中心页面
  async userCenterPage () {
    const { ctx } = this
    const user = ctx.user
    const userInfo = await ctx.service.user.find(ctx.helper.toInt(user.id))
    await ctx.render('userCenter/info/info.js', { userInfo })
    // await ctx.render('userManage/list/list.js', { type: ctx.params.type });
  }

  // 修改密码页面
  async modifyPwdPage () {
    const { ctx } = this
    await ctx.render('userCenter/modifyPwd/modifyPwd.js', {})
  }

  // 忘记密码输入邮箱页面
  async forgetPwdPage () {
    const { ctx } = this
    await ctx.render('forgetPwd/forgetPwd.js')
  }

  // 忘记密码输入密码页面
  async resetPwdPage () {
    const { ctx } = this
    await ctx.render('resetPwd/resetPwd.js')
  }

  async updateInfo () {
    const { ctx } = this
    const userInfo = ctx.user
    const id = ctx.helper.toInt(userInfo.id)
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
      data: null, // user,
      msg: ctx.__('success')
    }
  }

  async modifyPwd () {
    const ctx = this.ctx
    const userInfo = ctx.user
    const { oldPwd, newPwd } = ctx.request.body
    if (!oldPwd) {
      ctx.body = {
        code: -1001,
        data: null,
        msg: ctx.__('person.oldPassword')
      }
      return
    }
    if (!newPwd) {
      ctx.body = {
        code: -1002,
        data: null,
        msg: ctx.__('person.newPassword')
      }
      return
    }
    if (oldPwd === newPwd) {
      ctx.body = {
        code: -1003,
        data: null,
        msg: ctx.__('person.notSamePassword')
      }
      return
    }
    if (userInfo.password.slice(0, -8) !== ctx.helper.getMd5Data(decrypt(oldPwd)).slice(0, -8)) {
      ctx.body = {
        code: -1004,
        data: null,
        msg: ctx.__('person.oldPasswordErr')
      }
      return
    }
    const user = await ctx.service.user.update({ id: ctx.helper.toInt(userInfo.id), updates: { password: ctx.helper.getMd5Data(decrypt(newPwd)) }})
    ctx.body = {
      code: 0,
      data: null,
      msg: ctx.__('success')
    }
  }

  // 忘记密码api
  async forgetPwd () {
    const ctx = this.ctx
    const { email } = ctx.request.body
    const user = await ctx.service.user.findByEmail(email)
    const { id, status, username } = user && user.length ? user[0] : {}
    if (!id) {
      ctx.body = {
        code: -1005,
        data: null,
        msg: ctx.__('person.emailInvalid')
      }
      return
    }

    if (status !== 1) {
      ctx.body = {
        code: -1006,
        data: null,
        msg: ctx.__('person.abnormalUser')
      }
      return
    }

    const tm = new Date()
    const tmsnap = tm.getTime()
    const tokenJson = { id: id, ctime: tmsnap }
    const token = ctx.helper.generateToken(JSON.stringify(tokenJson))
    this.app.redis.set(token, JSON.stringify(tokenJson), 'EX', 24 * 60 * 60)
    const subject = ctx.__('person.resetPassword')
    const text = ctx.__('person.resetPasswordTip')
    const html = ctx.__('person.resetPasswordHtml', [username, ctx.app.config.origin, token, tm])

    const isSent = await this.service.tool.sendMail(email, subject, text, html)
    if (!isSent) {
      ctx.logger.error(`忘记密码发送邮件失败:token-${token}`)
      ctx.body = {
        code: -1007,
        data: null, // user,
        msg: ctx.__('person.emailSendFail')
      }
      return
    }
    // this.ctx.cookies.set('FLAG', id, {httpOnly: true})
    ctx.body = {
      code: 0,
      data: null, // user,
      msg: ctx.__('person.emailSendSuccess')
    }
  }

  async resetPwd () {
    const ctx = this.ctx
    const { token, newPwd } = ctx.request.body
    if (!token) {
      ctx.body = {
        code: -1008,
        data: null,
        msg: ctx.__('person.invalidUserInfo')
      }
      return
    }
    if (!newPwd) {
      ctx.body = {
        code: -1002,
        data: null,
        msg: ctx.__('person.newPassword')
      }
      return
    }
    const data = await this.app.redis.get(token)
    if (!data) {
      ctx.body = {
        code: -10014,
        msg: ctx.__('person.linkExpired')
      }
      return
    }
    const id = JSON.parse(data).id
    const user = await ctx.service.user.find(ctx.helper.toInt(id))
    const { status } = user

    if (status !== 1) {
      ctx.body = {
        code: -1006,
        data: null,
        msg: ctx.__('person.abnormalUser')
      }
      return
    }

    await ctx.service.user.update({ id: ctx.helper.toInt(id), updates: { password: ctx.helper.getMd5Data(decrypt(newPwd)) }})
    ctx.body = {
      code: 0,
      data: null,
      msg: ctx.__('success')
    }
  }
}

module.exports = PersonController
