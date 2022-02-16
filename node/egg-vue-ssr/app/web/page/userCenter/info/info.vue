<template>
  <Layout :title="$t('userCenter.userInfo')">
    <HomeContainer :user-info="userInfo" :user-name="userName" :role-type="roleType" :version="version">
      <div class="content-header">
        <div>
          <span class="content-title choosed">{{ $t('userCenter.userInfo') }}</span>
          <span class="content-title" @click="routerHandler">{{ $t('userCenter.modifyPwd') }}</span>
        </div>
      </div>
      <div class="content-box">
        <el-form
          ref="form" :model="form" :rules="formRule" label-width="0"
          class="form-box"
        >
          <el-form-item label="" prop="username">
            <el-input v-model="form.username" type="username" :placeholder="$t('userCenter.enterNameTip')" disabled />
          </el-form-item>
          <el-form-item label="" prop="email">
            <el-input
              v-model="form.email" type="email" :placeholder="$t('userCenter.emailEmptyTip')" :maxlength="50"
              auto-complete="off"
            />
          </el-form-item>
          <el-form-item label="" prop="phone">
            <el-input
              v-model="form.phone" type="phone" :placeholder="$t('userCenter.phoneEmptyTip')" :maxlength="20"
              auto-complete="off"
            />
          </el-form-item>
          <el-button v-loading.fullscreen.lock="loading" style="width: 100%" type="primary" @click="modifyHandler">
            {{ $t('update') }}
          </el-button>
        </el-form>
      </div>
    </HomeContainer>
  </Layout>
</template>
<script>
import './info.scss'
import { regEmail, regPhone } from '../../../framework/utils/validate'
export default {
  data () {
    return {
      form: {
        username: '',
        email: '',
        phone: ''
      },
      loading: false
    }
  },
  computed: {
    formRule () {
      return {
        email: [
          { required: true, message: this.$t('userCenter.emailEmptyTip'), trigger: 'blur' },
          { pattern: regEmail, message: this.$t('userCenter.emailTip'), trigger: 'blur' }
        ],
        phone: [
          { required: true, message: this.$t('userCenter.phoneEmptyTip'), trigger: 'blur' },
          { pattern: regPhone, message: this.$t('userCenter.phoneTip'), trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.form = {
      username: this.userInfo.username,
      email: this.userInfo.email,
      phone: this.userInfo.phone
    }
  },
  methods: {
    modifyHandler () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true
          this.$request.post(`/api/person/updateInfo`, {
            email: this.form.email,
            phone: this.form.phone
          }).then(res => {
            this.loading = false
            if (res.code !== 0) {
              this.$message.error(res.msg)
              return
            }
            this.$message.success(res.msg)
          }).catch(e => {
            this.loading = false
          })
        }
      })
    },
    routerHandler () {
      window.location.href = '/person/modifyPwd'
    }
  }
}
</script>
