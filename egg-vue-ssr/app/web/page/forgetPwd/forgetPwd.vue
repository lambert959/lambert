<template>
  <Layout :title="$t('forgetPwd.title')">
    <HomeContainer :version="version" type="findPwd">
      <div class="content-header">
        <span class="content-title choosed">{{ $t('forgetPwd.title') }}</span>
      </div>
      <div class="content-box">
        <el-form
          v-if="!sendSucc" ref="form" :model="form" :rules="formRule"
          label-width="0" class="form-box"
        >
          <el-form-item label="" prop="email">
            <el-input v-model="form.email" type="email" :placeholder="$t('forgetPwd.emailEmptyTip')" :maxlength="50" />
          </el-form-item>
          <el-button v-loading="operating" style="width: 100%" type="primary" @click="sendEmail">
            {{ $t('forgetPwd.send') }}
          </el-button>
        </el-form>
        <div v-else class="result-box">
          <el-icon class="el-icon-circle-check" /><br>
          {{ $t('forgetPwd.sentSuccTip') }}
        </div>
      </div>
    </HomeContainer>
  </Layout>
</template>
<script>
import './forgetPwd.scss'
import { regEmail } from '../../framework/utils/validate'
export default {
  data () {
    return {
      form: {
        email: ''
      },
      sendSucc: false,
      operating: false
    }
  },
  computed: {
    formRule () {
      return {
        email: [
          { required: true, message: this.$t('forgetPwd.emailEmptyTip'), trigger: 'blur' },
          { pattern: regEmail, message: this.$t('register.emailTip'), trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    sendEmail () {
      if (this.operating) return
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.operating = true
          this.$request.post(`/api/forgetPwd`, {
            email: this.form.email
          }).then(res => {
            this.operating = false
            if (res.code !== 0) {
              this.$message.error(res.msg)
              return
            }
            this.sendSucc = true
          }).catch(e => {
            this.operating = false
          })
        }
      })
    }
  }
}
</script>
