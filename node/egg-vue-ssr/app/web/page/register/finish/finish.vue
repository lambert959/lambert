<template>
  <Layout :title="$t('register.activate')">
    <HomeContainer :version="version" type="register">
      <div class="result-box">
        <el-icon v-if="success === 0" class="el-icon-circle-check" />
        <el-icon v-else class="el-icon-circle-close" />
        <br>{{ message }}
      </div>
    </HomeContainer>
  </Layout>
</template>
<script type="babel">
import './finish.scss'
export default {
  components: {
  },
  data () {
    return {
      message: '',
      success: 0
    }
  },
  mounted () {
    console.log(this.router)
    const search = window.location.search
    const token = search.split('=')[1]
    this.$request.get(`/api/activate/${token}`).then((res) => {
      console.log(res)
      this.success = res.code
      this.message = res.msg
    })
  }
}
</script>
