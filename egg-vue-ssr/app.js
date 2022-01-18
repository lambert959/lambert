const LocalStrategy = require('passport-local').Strategy
const { decrypt, generateKeys } = require('./app/util/rsa/index')
const crypto = require('crypto')

module.exports = app => {
  // if (app.config.env === 'local' || app.config.env === 'unittest') {
  //   app.beforeStart(async () => {
  //     await app.model.sync({force: true});
  //   });
  // }

  // 挂载 strategy
  app.passport.use(new LocalStrategy({
    // 将请求信息传递到callback界面
    passReqToCallback: true
    // 中间件会自动从username和passport字段读取用户名和密码，如果需要更改：
    // usernameField: 'email',
    // passwordField: 'passwd'
  }, (req, username, password, done) => {
    // format user
    const user = {
      provider: 'local',
      username,
      password
    }
    app.passport.doVerify(req, user, done)
  }))

  // 处理用户信息
  app.passport.verify(async (ctx, user) => {
    generateKeys()
    // 查找数据库，并验证密码是否正确
    const foundUser = await ctx.model.User.findOne({ where: { username: user.username }})
    // if(!foundUser || foundUser.password != ctx.helper.getMd5Data(user.password)) return false;
    // console.log('校验密码', foundUser.password.slice(0, -8), decrypt(user.password))
    const passwordMD5 = crypto.createHash('md5').update(decrypt(user.password)).digest('hex')
    if (!foundUser || !(await ctx.model.User.validPassword(foundUser.id, passwordMD5))) {
      console.log('password error')
      return false
    }
    /* if (foundUser.status !== 1) {
      console.log('status error')
      return false
    } */
    console.log('User verify OK')
    return foundUser
  })

  // 序列化和反序列化用于保存用户信息。
  app.passport.serializeUser(async (ctx, user) => {
    // const {id, username} = user;
    // done(null, {id, username});
    const { username, role_type } = user
    return { username, role_type }
  })
  app.passport.deserializeUser(async (ctx, user) => {
    // User.findById(user.id, function(err, user) {
    //   done(err, user);
    // });
    const foundUser = await ctx.model.User.findOne({ where: { username: user.username }})
    return foundUser
  })
}
