/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  require('./routers/api')(app)
  require('./routers/resources')(app)
}
