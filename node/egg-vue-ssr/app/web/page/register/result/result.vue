<template>
  <Layout :title="$t('register.registerResult')">
    <HomeContainer :version="version" type="register">
      <div class="result-box">
        <el-icon class="el-icon-circle-check" />
        <br>{{ $t('register.resultTip') }}
      </div>
    </HomeContainer>
  </Layout>
</template>
<script type="text/babel">
import './result.scss'
export default {
  name: 'RegisterResult',
  data () {
    return {
      publicKey: ''
    }
  },
  mounted () {
    setTimeout(() => {
      window.location.href = '/login'
    }, 10 * 1000)
  }
}
</script>
