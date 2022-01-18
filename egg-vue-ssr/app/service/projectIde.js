'use strict'

const Service = require('egg').Service
const cp = require('child_process')
const path = require('path')

class ProjectIdeService extends Service {
  async open (project) {
    const projectAddr = project.address
    console.log('projectAddr', projectAddr)
    const { ctx } = this
    const usePort = await ctx.helper.getFreePort()
    const execPromise = new Promise((resolve, reject) => {
      cp.exec(`docker run --init -it -d -p ${usePort}:10443 -v ${projectAddr}:/home/project -e secure=0 -e token=${ctx.user.password}  --name prolin_theia_container${usePort} luxuecom/prolin_theia:latest`, function (err, stdout, stderr) {
        if (err) {
          console.error(err)
          reject()
        }
        setTimeout(() => {
          resolve(stdout.toString().substring(0, 12))// 前12位为docker容器编号
        }, 3000)
        // console.log("stdout:",stdout)
        // console.log("stderr:",stderr);
      })
    })
    let ide_url = ''
    let container_id = ''
    try {
      container_id = await execPromise
      ide_url = 'http://' + ctx.helper.getIPAddress() + `:${usePort}/?token=${ctx.user.password}`
      await project.update({ container_id, ide_url })
    } catch (error) {
      // ctx.throw(501, 'server is error');
    }

    return ide_url
  }

  // open all the project in the IDE
  async openAll (user) {
    const projectDir = path.join(this.config.baseDir, 'projects', `${user.id}`)
    const sdkDir = path.join(this.config.baseDir, 'projects/tool/sdk')
    const { ctx } = this
    const usePort = await ctx.helper.getFreePort()
    const token = ctx.user.password.substring(0, 4)
    const execPromise = new Promise((resolve, reject) => {
      cp.exec(`docker run --init -it -d -p ${usePort}:3000 -e target_project=/home/project -e token=${token} --mount type=bind,source=${sdkDir},target=/home/theia/sdk,readonly --mount type=bind,source=${projectDir},target=/home/project --name prolin_theia_container${usePort} luxuecom/prolin_theia_common:latest`, function (err, stdout, stderr) {
        if (err) {
          console.error(err)
          reject()
        }
        setTimeout(() => {
          resolve(stdout.toString().substring(0, 12))// 前12位为docker容器编号
        }, 3000)
        // console.log("stdout:",stdout)
        // console.log("stderr:",stderr);
      })
    })

    let ide_url = ''
    let container_id = ''
    let xcbPort = ''
    try {
      container_id = await execPromise
      ide_url = 'http://' + ctx.helper.getIPAddress() + `:${usePort}`
      await user.update({ container_id, ide_url })
    } catch (error) {
      // ctx.throw(501, 'server is error');
    }

    // for emulator
    const emulatorPort = await ctx.helper.getFreePort() // port for emulator browser
    xcbPort = await ctx.helper.getFreePort()            // port for xcb communcation
    const emulatorPromise = new Promise((resolve, reject) => {
      cp.exec(`docker run --privileged -d -p ${emulatorPort}:6080 -p ${xcbPort}:5555 --name prolin_emulator_container${emulatorPort} luxuecom/prolin_emulator`, function (err, stdout, stderr) {
        if (err) {
          console.error(err)
          reject()
        }
        setTimeout(() => {
          resolve(stdout.toString().substring(0, 12))// 前12位为docker容器编号
        }, 3000)
      }) 
    })

    try {
      const emulator_id = await emulatorPromise
      const ip = ctx.helper.getIPAddress()
      const emulator_url = 'http://' + ip + `:${emulatorPort}`
      const xcb_channel = `${ip}:${xcbPort}`
      await user.update({ emulator_id, emulator_url, xcb_channel })
    } catch (error) {
      // ctx.throw(501, 'server is error');
    }

    return ide_url
  }

  async close (project) {
    const containerId = project.container_id
    if (containerId) {
      cp.exec(`docker stop ${containerId}; docker rm ${containerId}`, function (err, stdout, stderr) {
        if (err) {
          console.error(err)
        }
        // console.log("stdout:",stdout)
        // console.log("stderr:",stderr);
      })
      await project.update({ container_id: '', ide_url: '' })
    }
    const emulatorId = project.emulator_id
    if (emulatorId) {
      cp.exec(`docker stop ${emulatorId}; docker rm ${emulatorId}`, function (err, stdout, stderr) {
        if (err) {
          console.error(err)
        }
        // console.log("stdout:",stdout)
        // console.log("stderr:",stderr);
      })
      await project.update({ emulator_id: '', emulator_url: '' })
    }
  }
}

module.exports = ProjectIdeService
