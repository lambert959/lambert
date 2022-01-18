module.exports = () => {
  return async function locale (ctx, next) {
    if (ctx.query.locale) {
      ctx.cookies.set('locale', ctx.query.locale)
    }
    ctx.locals.locale = ctx.query.locale || ctx.cookies.get('locale') || 'cn'
    await next()
  }
}
