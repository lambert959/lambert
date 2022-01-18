<template>
  <Layout :title="$t('login.login')">
    <HomeContainer :version="version">
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
                <el-input v-model="loginForm.username" :placeholder="$t('login.usernameEmptyTip')" :maxlength="50" />
              </el-form-item>
              <el-form-item label="" prop="password">
                <el-input
                  v-model="loginForm.password" type="password" :placeholder="$t('login.pwdEmptyTip')" :maxlength="64"
                  auto-complete="off" @keyup.enter.native="jumpHome"
                />
              </el-form-item>
              <el-form-item label="" prop="pass">
                <el-button v-loading="operating" class="login-btn" type="success" @click="jumpHome">
                  {{ $t('login.login') }}
                </el-button>
              </el-form-item>
              <div class="link-box">
                <a href="/register">{{ $t('login.regBtn') }}</a>
                <a href="/findPwd">{{ $t('login.forgetPwd') }}</a>
              </div>
            </el-form>
          </div>
        </div>
      </div>
    </HomeContainer>
  </Layout>
</template>
<script type="text/babel">

import './login.scss'
import { regUserName, regPwd } from '../../framework/utils/validate'
const scriptjs = EASY_ENV_IS_BROWSER ? require('scriptjs') : ''
export default {
  name: 'AdminLogin',
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      operating: false
    }
  },
  computed: {
    loginFormRule () {
      return {
        username: [
          { required: true, message: this.$t('login.usernameEmptyTip'), trigger: 'blur' },
          { pattern: regUserName, message: this.$t('register.usernameTip'), trigger: 'blur' }
        ],
        password: [
          { required: true, message: this.$t('login.pwdEmptyTip'), trigger: 'blur' },
          { pattern: regPwd, message: this.$t('register.pwdTip'), trigger: 'blur' }
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
    jumpHome () {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loginAjax()
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
    loginAjax () {
      if (this.operating) return
      this.operating = true
      const that = this
      const encrypt = new JSEncrypt()
      encrypt.setPublicKey(this.publicKey)
      this.$request.post(`/api/login`, {
        username: this.loginForm.username,
        password: encrypt.encrypt(this.loginForm.password)
      }).then(res => {
        // console.log("登录成功");
        // console.log(res);
        this.operating = false
        if (res.code === 0) {
          console.log(res)
          // that.$router.push("/home");
          // sessionStorage.setItem("curMenu", "/home");
          // sessionStorage.setItem('uname',res.data.username);
          // sessionStorage.setItem('USERNAME', res.data.username);
          window.location.replace('/')
        } else {
          that.$message.warning(res.msg || this.$t('login.loginErr'))
        }
      }).catch(e => {
        this.operating = false
      })
    }
  }
}
</script>
