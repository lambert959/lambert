const Controller = require('egg').Controller

class HomeController extends Controller {
  async index () {
    const { ctx } = this
    const { id } = ctx.user
    const ownProjects = await ctx.service.projectUser.findOwnProject(id)
    const joinProjects = await ctx.service.projectUser.findJoinProject(id)
    console.log('====================================', ctx.locals)
    await ctx.render('home/home.js', { ownProjects, joinProjects })
  }
}

module.exports = HomeController
