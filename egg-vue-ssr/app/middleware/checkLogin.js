module.exports = (options) => {
  return async function (ctx, next) {
    const loginReg = /^(\/login)|(\/register)|(\/resetPwd)|(\/activate)|(\/api\/activate)|(\/api\/login)|(\/api\/register)|(\/loginCallback)|(\/logout)|(\/findPwd)|(\/api\/forgetPwd)|(\/api\/getPublicKey)/
    const url = ctx.url
    ctx.locals.origin = ctx.request.origin
    ctx.locals.version = ctx.app.config.version
    if (loginReg.test(url)) {
      await next()
      console.log('don’t need login=======================')
    } else {
      console.log('need login========================')
      if (ctx.isAuthenticated()) {
        if (ctx.user.status !== 1) {
          ctx.session.returnTo = ctx.path
          ctx.redirect('/login')
        }
        if (!ctx.locals.userName) {
          ctx.locals.userName = ctx.user.username
          ctx.locals.roleType = ctx.user.role_type
        }
        await next()
      } else {
        ctx.session.returnTo = ctx.path
        ctx.redirect('/login')
      }
    }
  }
}
