<template>
  <Layout :title="$t('userCenter.modifyPwd')">
    <HomeContainer :user-name="userName" :role-type="roleType" :version="version">
      <div class="content-header">
        <div>
          <span class="content-title" @click="routerHandler">{{ $t('userCenter.userInfo') }}</span>
          <span class="content-title choosed">{{ $t('userCenter.modifyPwd') }}</span>
        </div>
      </div>
      <div class="content-box">
        <el-form
          ref="form" :model="form" :rules="formRule" label-width="0"
          class="form-box"
        >
          <el-form-item label="" prop="oldPwd">
            <el-input
              v-model="form.oldPwd" type="password" :placeholder="$t('userCenter.oldpwdEmptyTip')" auto-complete="off"
              :maxlength="64"
            />
          </el-form-item>
          <el-form-item label="" prop="newPwd">
            <el-input
              v-model="form.newPwd" type="password" :placeholder="$t('userCenter.newpwdEmptyTip')" auto-complete="off"
              :maxlength="64"
            />
          </el-form-item>
          <el-form-item label="" prop="confirmNewPwd">
            <el-input
              v-model="form.confirmNewPwd" type="password" :placeholder="$t('userCenter.newPwdRepetTip')" auto-complete="off"
              :maxlength="64" onpaste="return false"
            />
          </el-form-item>
          <el-button style="width: 100%" type="primary" @click="modifyPwdHandler">
            {{ $t('update') }}
          </el-button>
        </el-form>
      </div>
    </HomeContainer>
  </Layout>
</template>
<script>
const scriptjs = EASY_ENV_IS_BROWSER ? require('scriptjs') : ''
import { regPwd } from '../../../framework/utils/validate'
import './modifyPwd.scss'
export default {
  data () {
    return {
      form: {
        oldPwd: '',
        newPwd: '',
        confirmNewPwd: ''
      },
      publicKey: ''
    }
  },
  computed: {
    formRule () {
      return {
        oldPwd: [
          { required: true, message: this.$t('userCenter.oldpwdEmptyTip'), trigger: 'blur' },
          { pattern: regPwd, message: this.$t('register.pwdTip'), trigger: 'blur' }
        ],
        newPwd: [
          { required: true, message: this.$t('userCenter.newpwdEmptyTip'), trigger: 'blur' },
          { pattern: regPwd, message: this.$t('register.pwdTip'), trigger: 'blur' },
          { validator: this.validNewPwd, trigger: 'blur' }
        ],
        confirmNewPwd: [
          { required: true, message: this.$t('userCenter.newPwdRepetTip'), trigger: 'blur' },
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
    validNewPwd (rule, value, callback) {
      if (value === this.form.oldPwd) {
        callback(new Error(this.$t('userCenter.pwdDiff')))
      } else {
        callback()
      }
    },
    validConfirmNewPwd (rule, value, callback) {
      if (value !== this.form.newPwd) {
        callback(new Error(this.$t('userCenter.newPwdDiff')))
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
    modifyPwdHandler () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const encrypt = new JSEncrypt()
          encrypt.setPublicKey(this.publicKey)
          this.$request.post(`/api/person/modifyPwd`, {
            oldPwd: encrypt.encrypt(this.form.oldPwd),
            newPwd: encrypt.encrypt(this.form.newPwd)
          }).then(res => {
            if (res.code !== 0) {
              this.$message.error(res.msg)
              return
            }
            this.$message.success(res.msg)
            window.location.replace('/logout')
          })
        }
      })
    },
    routerHandler () {
      window.location.href = '/person/info'
    }
  }
}
</script>
