/*
* 这些是controller调用的api请求路由
*/
module.exports = app => {
  const { router, controller } = app

  // projects
  // app.resources('project', '/api/project', controller.project);
  router.get('/api/project/users', controller.project.getProjectMem)
  router.delete('/api/project/users', controller.project.deleteProjectMem)
  router.post('/api/project/users', controller.project.addProjectMem)
  router.get('/api/project/list', controller.project.getSearchList)
  // router.get('/api/project/open', controller.project.openProject) // Open the project of the current user
  router.get('/api/project/open', controller.project.openAllProject) // Open all the projects of the current user
  router.get('/api/project/close', controller.project.closeProject)
  app.resources('project', '/api/project', controller.project)

  // common
  router.get('/api/getPublicKey', controller.common.getPublicKey)
  router.post('/api/register', controller.common.register)
  router.get('/api/activate/:token', controller.common.activate)
  const localStrategy = app.passport.authenticate('local', { successRedirect: '/loginCallback', failureRedirect: '/loginCallback' })
  router.post('/api/login', localStrategy)

  // Users
  router.get('/api/users/search', controller.users.findSome)
  app.resources('users', '/api/users', controller.users)
  router.post('/api/users/pass/:id', controller.users.passHandle)

  // person
  router.post('/api/person/modifyPwd', controller.person.modifyPwd)
  router.post('/api/forgetPwd', controller.person.forgetPwd)
  router.post('/api/person/resetPwd', controller.person.resetPwd)
  router.post('/api/person/updateInfo', controller.person.updateInfo)
}
