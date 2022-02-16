<template>
  <div class="upload-box-container">
    <el-upload
      drag
      action=""
      accept=".zip"
      :http-request="fileUpload"
    >
      <div v-show="!isUpload" class="icon-upload" />
      <div v-show="!isUpload" class="el-upload__text">
        {{ $t('project.uploadTip') }}
      </div>
      <div v-show="isUpload" class="file-icon" />
      <div v-show="isUpload" class="file-name">
        {{ filename }}
      </div>
    </el-upload>
  </div>
</template>

<script>
export default {
  name: 'Upload',
  data: () => ({
    isUpload: false,
    filename: ''
  }),
  methods: {
    // 覆盖默认的上传行为
    fileUpload (obj) {
      this.isUpload = true
      this.filename = obj.file.name
      this.$emit('uploadFile', obj.file)
    }
  }
}
</script>

<style scoped lang="scss">
.upload-box-container {
  width: 100%;
  height: 100%;
  /deep/.el-upload {
    display: block;
    height: 100%;
  }
  /deep/.el-upload-dragger {
    width: 100%;
    height: 212px;
    border: dashed 2px #e1e7ea;
    display: flex;
    flex-direction: column;
    justify-content: center;
    &:hover {
      border-color: #409EFF;
    }
    .icon-upload {
      height: 189px;
      background: url(../asset/images/upload_model.png) no-repeat center;
    }
    .el-upload__text {
      color: #3a3d3e;
      position: relative;
      top: -24px;
    }
    .file-icon {
      height: 187px;
      background: url(../asset/images/package.png) no-repeat center;
    }
    .file-name {
      font-size: 16px;
      color: #686d6f;
      position: relative;
      top: -40px;
    }
  }
  /deep/.el-upload-list {
    display: none;
  }
}
</style>
