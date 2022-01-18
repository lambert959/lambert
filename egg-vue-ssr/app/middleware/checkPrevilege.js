module.exports = (options) => {
  return async function (ctx, next) {
    const config = {
      1: [ // 管理员权限
        '/users/list/',
        '/api/users/pass/',
        '/api/users/email'
      ]
    }
    const roleType = ctx.user && ctx.user.role_type
    if (roleType === 2 && config[1].some(item => ctx.request.url.includes(item))) {
      ctx.redirect('/')
    } else {
      await next()
    }
  }
}
