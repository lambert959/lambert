const Controller = require('egg').Controller

class IdeController extends Controller {
  constructor (ctx) {
    super(ctx)
  }

  async openPage () {
    const { ctx } = this
    const url = ctx.user.ide_url
    const emulatorUrl = ctx.user.emulator_url
    const xcbChannel = ctx.user.xcb_channel
    if (url) {
      await ctx.render('ide/ide.js', { url, emulatorUrl, xcbChannel })
    }
  }
}

module.exports = IdeController

