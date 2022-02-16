module.exports = {
  success: '成功',
  error: '失败',
  account: '账号',
  underReview: '账号待审核',
  reviewFailed: '账号审核未通过',
  accountUnactive: '账号待激活',
  userNotExist: '账号不存在',
  invalidUserOrPass: '账号或密码错误',
  usernameTaken: '账号名已被使用',
  emailTaken: '邮箱已被使用',
  registerFali: '账号注册失败',
  emailSendFail: '邮件发送失败',
  waitForActivate: '注册完成待激活',
  linkInvalid: '账号链接已经失效',
  waitForReview: '账号已激活，请等待管理员审核',
  activateErr: '账号激活失败',
  activateAccount: '激活账号',
  activateAccountTip: '请点击下方的链接激活账号',
  activateAccountHtml: '<p>{0}</p><p>你好，请点击链接激活你的账户。</p><p><a class="elem-a" href="{1}/activate?token={2}">点击激活</a></p><p>请注意，该链接将在24小时后失效。</p><p>{3}</p>',
  users: {
    invalidUserInfo: '无效用户信息'
  },
  project: {
    openFailed: '打开项目失败',
    memberExists: '成员已存在',
    parameterErr: '参数错误',
    projectNameTaken: '工程名已被使用'
  },
  person: {
    invalidUserInfo: '无效用户信息',
    oldPassword: '请输入原密码',
    newPassword: '请输入新密码',
    notSamePassword: '新密码和原密码不能一样',
    oldPasswordErr: '原密码不正确',
    resetPassword: '重置密码',
    resetPasswordTip: '请点击下方的链接重置密码',
    resetPasswordHtml: '<p>{0}</p><p>你好，请点击链接重置你的密码。</p><p><a class="elem-a" href="{1}/resetPwd?token={2}">点击重置</a></p><p>请注意，该链接将在24小时后失效。</p><p>{3}</p>',
    emailInvalid: '邮箱不存在',
    abnormalUser: '非正常用户',
    emailSendSuccess: '邮件已发送',
    emailSendFail: '邮件发送失败',
    linkExpired: '链接已失效'
  }
}
