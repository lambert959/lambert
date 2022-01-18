/*
* 这些是请求页面资源的路由
*/
module.exports = app => {
  const { router, controller } = app

  // Projects
  router.get('home', '/', controller.home.index)
  router.get('/myprojects', controller.home.index)
  router.get('/project/list', controller.project.listPage)
  router.get('/project/create', controller.project.createPage)

  // Users
  router.get('/users/list/:type', controller.users.userManage)

  // Person
  router.get('/person/info', controller.person.userCenterPage)
  router.get('/person/modifyPwd', controller.person.modifyPwdPage)
  router.get('/resetPwd', controller.person.resetPwdPage)
  router.get('/findPwd', controller.person.forgetPwdPage)

  // common
  router.get('/logout', controller.common.logout)
  router.get('/login', controller.common.login)
  router.get('/register', controller.common.registerPage)
  router.get('/registerResult', controller.common.registerResultPage)
  router.get('/loginCallback', controller.common.loginCallback)
  router.get('/activate', controller.common.activationPage)

  // ide
  router.get('/ide/user/:name', controller.ide.openPage)
}
