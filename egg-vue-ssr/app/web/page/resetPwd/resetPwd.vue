<template>
  <Layout :title="$t('resetPwd.title')">
    <HomeContainer :version="version" type="resetPwd">
      <div class="content-header">
        <span class="content-title choosed">{{ $t('resetPwd.title') }}</span>
      </div>
      <div class="content-box">
        <el-form
          ref="form" :model="form" :rules="formRule" label-width="0"
          class="form-box"
        >
          <el-form-item label="" prop="newPwd">
            <el-input
              v-model="form.newPwd" type="password" :placeholder="$t('resetPwd.newpwdEmptyTip')" auto-complete="off"
              :maxlength="64"
            />
          </el-form-item>
          <el-form-item label="" prop="confirmNewPwd">
            <el-input
              v-model="form.confirmNewPwd" type="password" :placeholder="$t('resetPwd.newPwdRepetTip')" auto-complete="off"
              :maxlength="64" onpaste="return false"
            />
          </el-form-item>
          <el-form-item label="" prop="pass">
            <el-button v-loading="operating" style="width: 100%" type="primary" @click="resetPwdHandler">
              {{ $t('ok') }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </HomeContainer>
  </Layout>
</template>
<script>
import './resetPwd.scss'
import { regPwd } from '../../framework/utils/validate'
const scriptjs = EASY_ENV_IS_BROWSER ? require('scriptjs') : ''
export default {
  data () {
    return {
      form: {
        newPwd: '',
        confirmNewPwd: ''
      },
      operating: false
    }
  },
  computed: {
    formRule () {
      return {
        newPwd: [
          { required: true, message: this.$t('resetPwd.newpwdEmptyTip'), trigger: 'blur' },
          { pattern: regPwd, message: this.$t('resetPwd.newPwdTip'), trigger: 'blur' }
        ],
        confirmNewPwd: [
          { required: true, message: this.$t('resetPwd.newPwdRepetTip'), trigger: 'blur' },
          { validator: this.validConfirmNewPwd, trigger: 'blur' }
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
      if (value !== this.form.newPwd) {
        callback(new Error(this.$t('resetPwd.newPwdDiff')))
      } else {
        callback()
      }
    },
    getPublicKey () {
      this.$request.get('/api/getPublicKey').then(res => {
        if (res.code === 0) {
          this.publicKey = res.data
        }
      })
    },
    resetPwdHandler () {
      if (this.operating) return
      this.$refs.form.validate((valid) => {
        if (valid) {
          const encrypt = new JSEncrypt()
          encrypt.setPublicKey(this.publicKey)
          this.operating = true
          this.$request.post(`/api/person/resetPwd`, {
            token: window.location.href.split('?')[1].split('=')[1],
            newPwd: encrypt.encrypt(this.form.newPwd)
          }).then(res => {
            this.operating = false
            if (res.code !== 0) {
              this.$message.error(res.msg)
              return
            }
            this.$message.success(res.msg)
            window.location.replace('/login')
          }).catch(e => {
            this.operating = false
          })
        }
      })
    }
  }
}
</script>
