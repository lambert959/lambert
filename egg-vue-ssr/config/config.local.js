
module.exports = () => {
  const config = exports = {}
  config.vuessr = {
    // 本地开发 css 采用 inline 方式, 无需注入 css 链接。
    injectCss: false
  }
  config.origin = 'http://172.16.2.64:7001'

  config.sequelize = {
    dialect: 'mysql',
    port: 3306,
    database: 'cloudIDE',
    // host: '172.16.2.64',
    // username: 'sunyanduo',
    // password: 'pax123456'
    host: 'localhost',
    username: 'root',
    password: 'root'
    // dialectOptions: {//格式化时间，去掉UTC标志
    //   dateStrings: true,
    //   typeCast: true
    // }
  }

  config.redis = {
    client: {
      port: 6379, // Redis port
      host: '172.16.2.64', // Redis host
      password: 'pax123456',
      db: 0
    }
  }

  return config
}
