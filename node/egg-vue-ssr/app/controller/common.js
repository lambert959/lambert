const Controller = require('egg').Controller
const fs = require('fs')
const path = require('path')
const { decrypt, generateKeys } = require('../util/rsa/index')

class CommonController extends Controller {
  constructor (ctx) {
    super(ctx)
    this.createRule = {
      username: { type: 'string', required: true, allowEmpty: false, max: 50 },
      password: { type: 'password', required: true, allowEmpty: false, min: 6, max: 500 },
      email: { type: 'email', required: true, allowEmpty: false, max: 50 },
      phone: { type: 'string', required: false, max: 20 }
    }
  }

  async getPublicKey () {
    const { ctx } = this
    generateKeys()
    const publicKey = fs.readFileSync(path.resolve(__dirname, '../util/rsa/public.cer'), 'utf8')
    // console.log('getPublicKey===================', publicKey)
    if (publicKey) {
      ctx.body = {
        code: 0,
        data: publicKey,
        msg: ctx.__('success')
      }
      return
    }
    ctx.body = {
      code: -1,
      data: null,
      msg: ctx.__('error')
    }
  }

  async registerPage () {
    const { ctx } = this
    await ctx.render('register/index/index.js', {})
  }

  async registerResultPage () {
    const { ctx } = this
    await ctx.render('register/result/result.js', {})
  }

  async login () {
    const { ctx } = this
    await ctx.render('login/login.js', {})
  }

  async loginCallback () {
    const { ctx } = this
    if (ctx.isAuthenticated()) {
      ctx.locals.userName = ctx.user.username
      ctx.locals.roleType = ctx.user.role_type
      const status = ctx.user.status
      if (status !== 1) {
        const msg = status === 2 ? ctx.__('underReview') : status === 3 ? ctx.__('reviewFailed') : ctx.__('accountUnactived')
        ctx.body = {
          code: -1,
          data: null,
          msg: msg
        }
        return
      }
      let user = await ctx.service.user.findByUsername(ctx.user.username)
      if (!user) {
        ctx.body = {
          code: -10010,
          msg: ctx.__('userNotExist')
        }
        return
      }
      user = await ctx.service.user.update({ id: user.id, updates: { lastLoginAt: new Date() }})
      ctx.body = {
        code: 0,
        data: user,
        msg: ctx.__('success')
      }
    } else {
      ctx.body = {
        code: -1,
        data: null,
        msg: ctx.__('invalidUserOrPass')
      }
    }
  }

  async logout () {
    const { ctx } = this
    ctx.logout()
    ctx.redirect(ctx.get('referer') || '/login')
  }

  async register () {
    const { ctx } = this
    const { username, password, email, phone } = ctx.request.body
    ctx.validate(this.createRule)
    const countSamename = await ctx.service.user.countAllbyUsername(username)
    if (countSamename) {
      ctx.body = {
        code: -10010,
        msg: ctx.__('usernameTaken')
      }
      return
    }
    if (await ctx.service.user.countAllbyEmail(email)) {
      ctx.body = {
        code: -10011,
        msg: ctx.__('emailTaken')
      }
      return
    }
    const decryptedPwd = ctx.helper.getMd5Data(decrypt(password))

    const tm = new Date()
    const tmsnap = tm.getTime()
    const tokenJson = { username, email, phone, decryptedPwd, ctime: tmsnap }
    const token = ctx.helper.generateToken(JSON.stringify(tokenJson))
    this.app.redis.set(token, JSON.stringify(tokenJson), 'EX', 24 * 60 * 60)

    const subject = ctx.__('activateAccount')
    const text = ctx.__('activateAccountTip')
    const html = ctx.__('activateAccountHtml', [username, ctx.app.config.origin, token, tm])

    const isSent = await this.service.tool.sendMail(email, subject, text, html, token)
    // if (!isSent) {
    //   ctx.logger.error(`激活账号发送邮件失败:token-${token}`)
    //   ctx.body = {
    //     code: -1007,
    //     data: null, // user,
    //     msg: ctx.__('emailSendFail')
    //   }
    //   return
    // }
    if (!isSent) {
      ctx.body = {
        code: -10013,
        msg: ctx.__('registerFali')
      }
      return
    } else {
      ctx.body = {
        code: 0,
        msg: ctx.__('waitForActivate')
      }
    }
  }

  // 用户点击的激活链接页面
  async activationPage () {
    const { ctx } = this
    console.log(ctx.query)
    await ctx.render('register/finish/finish.js')
  }

  async activate () {
    const { ctx } = this
    const token = ctx.params.token
    const data = await this.app.redis.get(token)
    if (!data) {
      ctx.body = {
        code: -10014,
        msg: ctx.__('linkInvalid')
      }
      return
    }
    const userdata = JSON.parse(data)
    const username = userdata.username
    const email = userdata.email
    const phone = userdata.phone
    const decryptedPwd = userdata.decryptedPwd

    const countSamename = await ctx.service.user.countAllbyUsername(username)
    if (countSamename) {
      ctx.body = {
        code: -10010,
        msg: ctx.__('usernameTaken')
      }
      return
    }
    if (await ctx.service.user.countAllbyEmail(email)) {
      ctx.body = {
        code: -10011,
        msg: ctx.__('emailTaken')
      }
      return
    }
    const user = await ctx.service.user.create({
      username,
      password: decryptedPwd,
      email,
      phone
    })

    if (user) {
      this.app.redis.del(token)
      ctx.body = {
        code: 0,
        msg: ctx.__('waitForReview')
      }
      return
    } else {
      ctx.body = {
        code: -1015,
        msg: ctx.__('activateErr')
      }
    }
  }
}

module.exports = CommonController
