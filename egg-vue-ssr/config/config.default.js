/* eslint valid-jsdoc: "off" */

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
const path = require('path')
const fs = require('fs')
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {}

  config.siteFile = {
    '/favicon.ico': fs.readFileSync(path.join(appInfo.baseDir, 'app/web/asset/images/favicon.ico'))
  }

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1611109875957_5848'

  // 保证构建的静态资源文件能够被访问到
  config.static = {
    prefix: '/public/',
    dir: path.join(appInfo.baseDir, 'public')
  }

  config.vuessr = {
    layout: path.join(appInfo.baseDir, 'app/web/view/layout.html'),
    renderOptions: {
      basedir: path.join(appInfo.baseDir, 'app/view')
    }
  }

  config.session = {
    key: 'SESSION_ID',
    maxAge: 24 * 60 * 60 * 1000, // 过期时间
    httpOnly: true,
    encrypt: true,
    renew: true // 延长会话有效期
  }

  config.passportLocal = {
    usernameField: 'username',
    passwordField: 'password'
  }

  config.i18n = {
    defaultLocale: 'cn'
  }

  // add your middleware config here
  config.middleware = ['checkLogin', 'checkPrevilege', 'errorHandler', 'locals']

  // 版本号
  config.version = 'V1.0.20210610'

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }

  return {
    ...config,
    ...userConfig
  }
}
