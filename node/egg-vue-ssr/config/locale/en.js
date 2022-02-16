module.exports = {
  success: 'success',
  error: 'error',
  account: 'Account',
  underReview: 'Account is under review',
  reviewFailed: 'Account review failed',
  accountUnactive: 'Account is unactived',
  userNotExist: 'Account does not exist',
  invalidUserOrPass: 'Invalid account or password',
  usernameTaken: 'Account is already taken',
  emailTaken: 'Email is already taken',
  registerFali: 'registration failed',
  emailSendFail: 'Failed to send the mail',
  waitForActivate: 'Please check the email and complete the activation',
  linkInvalid: 'The link has expired',
  waitForReview: 'Please wait for the administrator to review',
  activateErr: 'Activate failed',
  activateAccount: 'Activate account',
  activateAccountTip: 'Please click the link below to activate the account',
  activateAccountHtml: '<p>{0}<br/>Please click on the link to activate your account.</p><p><a class="elem-a" href="{1}/activate?token={2}">Click to activate</a></p><p>Note that the link will expire after 24 hours.</p><p>{3}</p>',
  users: {
    invalidUserInfo: 'Invalid user information'
  },
  project: {
    openFailed: 'Open project failed',
    memberExists: 'Member already exists',
    parameterErr: 'Parameter is error',
    projectNameTaken: 'Project name has been taken'
  },
  person: {
    invalidUserInfo: 'Invalid user information',
    oldPassword: 'Please enter the original password',
    newPassword: 'Please enter a new password',
    notSamePassword: 'The new password cannot be the same as the original password',
    oldPasswordErr: 'The original password is incorrect',
    resetPassword: 'Reset password',
    resetPasswordTip: 'Please click the link below to reset your password',
    resetPasswordHtml: '<p>{0}</p><p>Please click on the link to reset your password.</p><p><a class="elem-a" href="{1}/resetPwd?token={2}">Click to reset</a></p><p>Note that the link will expire after 24 hours.</p><p>{3}</p>',
    emailInvalid: 'Email does not exist',
    abnormalUser: 'Abnormal user',
    emailSendSuccess: 'Email has been sent',
    emailSendFail: 'Failed to send the mail',
    linkExpired: 'Link has expired'
  }
}
