'use strict'
const crypto = require('crypto')
const os = require('os')
const net = require('net')

module.exports = {
  toInt (string) {
    if (typeof string === 'number') return string
    if (!string) return string
    return parseInt(string) || 0
  },
  // 专门对数据进行md5加密的方法，输入明文返回密文
  getMd5Data (data) {
    const salt = crypto.randomBytes(4).toString('hex')
    const password = crypto.createHash('md5').update(data).digest('hex')
    return `${password}${salt}`
  },
  getIPAddress () {
    const interfaces = os.networkInterfaces()
    for (const devName in interfaces) {
      const iface = interfaces[devName]
      for (let i = 0; i < iface.length; i++) {
        const alias = iface[i]
        if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
          return alias.address
        }
      }
    }
  },
  generateToken (data) {
    if (!data) return null
    const token = crypto.createHash('md5').update(data).digest('hex')
    return token
  },
  async getAvailablePort (port) {
    const portInUse = (port) => {
      return new Promise((resolve, reject) => {
        const server = net.createServer().listen(port)
        server.on('listening', function () { // 能开通则关掉
          server.close()
          resolve(port)
        })
        server.on('error', function (err) {
          if (err.code === 'EADDRINUSE') {
            resolve(err)
          }
        })
      })
    }
    const tryUsePort = async function (port) {
      const res = await portInUse(port)
      if (res instanceof Error) {
        console.log(`端口：${port}被占用\n`)
        port++
        return tryUsePort(port)
      } else {
        return port
      }
    }
    return await tryUsePort(port)
  },
  async getFreePort () {
    const { ctx } = this
    const execGetPort = new Promise((resolve, reject) => {
      const server = ctx.app.listen(0, () => {
        const freePort = server.address().port
        server.close()
        console.log(`===>Listening on port: ${freePort}`);
        resolve(freePort)
      })
    })
    try {
      const freePort = await execGetPort
      return freePort
    } catch (error) {
      return -1
    }
  }

}
