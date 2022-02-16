'use strict'

const Service = require('egg').Service
const fs = require('fs')
const fsPromises = fs.promises
const path = require('path')
const compressing = require('compressing')
const fse = require('fs-extra')

class ProjectAddrService extends Service {
  async copyTempFile (address, type) {
    const srcDir = path.join(this.config.baseDir, `projects/template/${type}`) // 源目录
    const dstDir = address
    return await this.copyDir(srcDir, dstDir)
  }

  async copyUserDir(address, dstUserId) {
    const srcDir = address
    const dstDir = path.join(this.config.baseDir, 'projects', dstUserId, path.basename(address))
    return await this.copyDir(srcDir, dstDir)
  }

  async copyDir(srcDir, dstDir) {
    try {
      await fse.copy(srcDir, dstDir)
      // console.log('===>copy success')
    } catch (err) {
      // console.log(err)
    }
  }

  async uploadFile (address, file) {
    try {
      await compressing.zip.uncompress(file.path, address)
    } catch (error) {
      console.error(error)
    }
    // let result = await new Promise((resolve, reject) => {
    //   fs.copyFile(file.path, dist, (error) => {
    //     if (error) {
    //       reject(error);
    //       console.log("fail");
    //     } else {
    //       resolve(true);
    //       console.log("success");
    //     }
    //   });
    // });
    // return result
  }

  async getAddr (name) {
    const { ctx } = this
    /*
    const now = new Date()
    const year = now.getFullYear() // 得到年份
    let month = now.getMonth()// 得到月份
    let date = now.getDate()// 得到日期
    const hour = now.getHours()// 得到小时
    const minute = now.getMinutes()// 得到分钟
    month = month + 1
    if (month < 10) month = '0' + month
    if (date < 10) date = '0' + date
    const number = now.getSeconds() % 43 // 这将产生一个基于目前时间的0到42的整数。
    const dirname = year + month + date + hour + minute + '_' + number
    */
    const dirname = name
    const projectDir = path.join(this.config.baseDir, 'projects', `${ctx.user.id}`, dirname) // Each user has a unique project path
    fs.mkdirSync(projectDir, { recursive: true })
    return projectDir
  }

  async rmdirAsync (filePath) {
    const stat = await fsPromises.stat(filePath)
    if (stat.isFile()) {
      await fsPromises.unlink(filePath)
    } else {
      fs.rm(filePath, { recursive: true }, err => { // fs.rm Added in: v14.14.0
	  });
	  //let dirs = await fsPromises.readdir(filePath)
      //dirs = dirs.map(dir => rmdirAsync(path.join(filePath, dir)))
      //await Promise.all(dirs)
      //await fsPromises.rmdir(filePath)
    }
  }
}

module.exports = ProjectAddrService
