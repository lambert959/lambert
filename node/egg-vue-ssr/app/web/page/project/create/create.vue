<template>
  <Layout :title="$t('project.createPro')">
    <HomeContainer :user-name="userName" :role-type="roleType" :version="version">
      <div class="content-header">
        <span class="content-title choosed">{{ $t('project.createPro') }}</span>
      </div>
      <div class="content-box">
        <el-form
          ref="projectForm" :model="projectForm" label-width="100px" label-position="top"
          :rules="formRule"
        >
          <el-form-item label="" prop="name">
            <el-input v-model="projectForm.name" :placeholder="$t('project.nameTip')" />
          </el-form-item>
          <el-form-item label="" prop="type">
            <el-select v-model="projectForm.type">
              <el-option label="Prolin" :value="1" />
              <el-option label="Andriod" :value="2" />
            </el-select>
          </el-form-item>
          <el-form-item label="" prop="template">
            <el-radio-group v-model="projectForm.template">
              <el-radio :label="1">
                {{ $t('project.emptyPro') }}
              </el-radio>
              <el-radio :label="2">
                {{ $t('project.templatePro') }}
              </el-radio>
              <el-radio :label="3">
                {{ $t('project.importPro') }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="" prop="type">
            <el-select v-model="projectForm.users" multiple :placeholder="$t('project.selectUsers')">
              <el-option v-for="(user, index) in userList" :key="index" :label="user.username" :value="user.id" />
            </el-select>
          </el-form-item>
          <el-form-item v-if="projectForm.template === 3" label="" prop="uploadFile">
            <UploadBox @uploadFile="handleUpload" />
          </el-form-item>
          <el-form-item label="">
            <el-input
              v-model="projectForm.description"
              type="textarea"
              :rows="3"
              show-word-limit
              maxlength="200"
              resize="none"
            />
          </el-form-item>
          <el-form-item label="" prop="pass">
            <el-button v-loading="fullscreenLoading" style="width: 100%" type="primary" @click="handleConfirm">
              {{ $t('ok') }}
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </HomeContainer>
  </Layout>
</template>

<script type="text/babel">
import UploadBox from '../../../components/UploadBox.vue'
import { regProjectName } from '../../../framework/utils/validate'
export default {
  components: { UploadBox },
  data () {
    return {
      fullscreenLoading: false,
      projectForm: {
        name: '',
        type: 1,
        template: 1,
        users: [],
        description: ''
      },
      uploadFile: null,
      userList: []
    }
  },
  computed: {
    formRule () {
      return {
        name: [
          { required: true, message: this.$t('project.enterName'), trigger: 'blur' },
          { pattern: regProjectName, message: this.$t('project.projectNameTip'), trigger: 'blur' }
        ]
      }
    }
  },
  created () {
    this.getAllUsers()
  },
  mounted () {

  },
  methods: {
    getAllUsers () {
      this.$request.get(`/api/users`, { status: 1 }).then(res => {
        if (res.code === 0) {
          this.userList = res.data.rows || []
        } else {
          that.$message.warning(res.msg)
        }
      })
    },
    handleUpload (file) {
      this.uploadFile = file
    },
    handleConfirm () {
      this.$refs.projectForm.validate(valid => {
        if (valid) {
          this.createAjax()
        }
      })
    },
    createAjax () {
      if (this.projectForm.template === 3 && !this.uploadFile) {
        this.$message.error(this.$t('project.uploadFormatTip'))
        return
      }
      const fd = new FormData()
      fd.append('name', this.projectForm.name)
      fd.append('type', this.projectForm.type)
      fd.append('template', this.projectForm.template)
      fd.append('users', this.projectForm.users)
      fd.append('description', this.projectForm.description)
      if (this.projectForm.template === 3) {
        fd.append('uploadFile', this.uploadFile)
      }
      this.fullscreenLoading = true
      this.$request.post(`/api/project`, fd).then(res => {
        console.log(res)
        this.fullscreenLoading = false
        if (res.code === 0) {
          console.log(res)
          window.location.href = '/myprojects'
        } else {
          this.$message.warning(res.msg)
        }
      }).catch(() => { this.fullscreenLoading = false })
    }
  }
}
</script>
