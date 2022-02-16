module.exports = (options, app) => {
  return async function (ctx, next) {
    try {
      await next()
    } catch (err) {
      app.emit('error', err, this)
      const status = err.status || 500
      // 生产环境时 500 错误的详细错误内容不返回给客户端，因为可能包含敏感信息
      const message = status === 500 && app.config.env === 'prod' ? 'Internal Server Error' : err.message
      ctx.body = {
        code: -1,
        msg: message
      }
      if (status === 422) {
        ctx.body = {
          code: -1,
          msg: err.errors
        }
      }
      ctx.status = status
    }
  }
}
