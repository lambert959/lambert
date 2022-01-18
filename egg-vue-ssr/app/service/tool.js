const Service = require('egg').Service

const nodemailer = require('nodemailer')
const USER_EMAIL = 'PPDC@paxsz.com'
const PWD = 'wdxt@pAx123'

const transporter = nodemailer.createTransport({
  host: 'mail.paxsz.com',
  port: 25,
  // secure: true,
  // debug: true,
  logger: true,
  auth: {
    user: 'PPDC', // 账号
    pass: PWD // 授权码
  }
})

class ToolService extends Service {
  async sendMail (email, subject, text, html, token) {
    const { ctx } = this
    const mailOptions = {
      from: USER_EMAIL, // 发送者,与上面的user一致
      to: email, // 接收者,可以同时发送多个,以逗号隔开
      subject, // 标题
      text, // 文本
      html
    }
    console.log('准备发送邮件====')
    try {
      await transporter.sendMail(mailOptions)
      return true
    } catch (err) {
      // console.log(err)
      ctx.logger.error(`激活账号发送邮件失败:token-${token}`)
      return false
    }
  }
}

module.exports = ToolService

