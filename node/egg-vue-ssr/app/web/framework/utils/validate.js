const regUserName = /^[A-Za-z0-9]{5,50}$/
const regPwd = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[~!@#$%^&*])[A-Za-z0-9~!@#$%^&*=]{6,64}$/
const regEmail = /([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,50})+/
const regPhone = /^[^\u4e00-\u9fa5]+$/
const regProjectName = /^[A-Za-z0-9_]{1,50}$/

export {
  regUserName,
  regPwd,
  regEmail,
  regPhone,
  regProjectName
}
