<template>
  <Layout :title="$t('register.register')">
    <HomeContainer :version="version" type="register">
      <div class="login-container">
        <div class="left" />
        <div class="right">
          <div class="admin-login-main">
            <h2 class="admin-login-title">
              Cloud IDE
            </h2>
            <el-form
              ref="loginForm" :model="loginForm" :rules="loginFormRule" label-width="100px"
              label-position="top" class="demo-ruleForm"
            >
              <el-form-item label="" prop="username">
                <el-input v-model="loginForm.username" :placeholder="$t('register.usernameEmptyTip')" :maxlength="50" />
              </el-form-item>
              <el-form-item label="" prop="password">
                <el-input
                  v-model="loginForm.password" type="password" :placeholder="$t('register.pwdEmptyTip')" auto-complete="off"
                  :maxlength="64"
                />
              </el-form-item>
              <el-form-item label="" prop="confirmPassword">
                <el-input
                  v-model="loginForm.confirmPassword" type="password" :placeholder="$t('register.pwdRepetTip')" auto-complete="off"
                  :maxlength="64" onpaste="return false"
                />
              </el-form-item>
              <el-form-item label="" prop="email">
                <el-input v-model="loginForm.email" :placeholder="$t('register.emailEmptyTip')" :maxlength="50" />
              </el-form-item>
              <el-form-item label="" prop="phone">
                <el-input v-model="loginForm.phone" :placeholder="$t('register.phoneEmptyTip')" :maxlength="20" />
              </el-form-item>
              <el-form-item label="" prop="pass">
                <el-button v-loading="operating" class="login-btn" type="success" @click="jumpHome">
                  {{ $t('register.register') }}
                </el-button>
              </el-form-item>
              <div style="display:flex;justify-content:space-between;">
                <a style="color: #4E80F4" href="/login">{{ $t('register.backToLogin') }}</a>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </HomeContainer>
  </Layout>
</template>
<script type="text/babel">
import './index.scss'
import { regUserName, regPwd, regEmail, regPhone } from '../../../framework/utils/validate'
const scriptjs = EASY_ENV_IS_BROWSER ? require('scriptjs') : ''
export default {
  name: 'AdminLogin',
  data () {
    return {
      loginForm: {
        username: '',
        password: '',
        email: '',
        phone: ''
      },
      publicKey: '',
      operating: false
    }
  },
  computed: {
    loginFormRule () {
      return {
        username: [
          { required: true, message: this.$t('register.usernameEmptyTip'), trigger: 'blur' },
          { pattern: regUserName, message: this.$t('register.usernameTip'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('register.pwdEmptyTip'), trigger: 'blur' },
          { pattern: regPwd, message: this.$t('register.pwdTip'), trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: this.$t('register.pwdRepetTip'), trigger: 'blur' },
          { validator: this.validConfirmNewPwd, trigger: 'blur' }
        ],
        email: [
          { required: true, message: this.$t('register.emailEmptyTip'), trigger: 'blur' },
          { pattern: regEmail, message: this.$t('register.emailTip'), trigger: 'blur' }
        ],
        phone: [
          { required: true, message: this.$t('register.phoneEmptyTip'), trigger: 'blur' },
          { pattern: regPhone, message: this.$t('register.phoneTip'), trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    EASY_ENV_IS_BROWSER && scriptjs(
      [
        `/public/asset/js/jsencrypt.min.js`
      ])
  },
  mounted () {
    this.getPublicKey()
  },
  methods: {
    validConfirmNewPwd (rule, value, callback) {
      if (value !== this.loginForm.password) {
        callback(new Error(this.$t('register.pwdDiff')))
      } else {
        callback()
      }
    },
    jumpHome () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.registerAjax()
        }
      })
    },
    getPublicKey () {
      this.$request.get('/api/getPublicKey').then(res => {
        if (res.code === 0) {
          this.publicKey = res.data
        }
      })
    },
    registerAjax () {
      if (this.operating) return
      this.operating = true
      const that = this
      const encrypt = new JSEncrypt()
      encrypt.setPublicKey(this.publicKey)
      // console.log(encrypt.encrypt(this.loginForm.password))
      const params = {
        username: this.loginForm.username,
        password: encrypt.encrypt(this.loginForm.password),
        email: this.loginForm.email,
        phone: this.loginForm.phone
      }
      this.$request.post(`/api/register`, params).then((res) => {
        console.log(res)
        this.operating = false
        if (res.code === 0) {
          // that.$router.push("/home");
          // sessionStorage.setItem("curMenu", "/home");
          // sessionStorage.setItem('uname',res.data.username);
          // window.location.href = '/login'
          window.location.href = '/registerResult'
        } else {
          that.$message.warning(res.msg || this.$t('errTip'))
        }
      }).catch(e => {
        this.operating = false
      })
    }
  }
}
</script>
