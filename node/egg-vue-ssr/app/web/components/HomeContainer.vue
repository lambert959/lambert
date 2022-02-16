<template>
  <el-container class="home-container">
    <Header
      v-if="showHeader" :user-name="userName" :role-type="roleType" :menu-type="menuType"
      :type="type"
    />
    <el-main v-loading="loading">
      <slot />
    </el-main>
    <Footer :version="version" />
  </el-container>
</template>
<script type='babel'>
import Header from './Header'
import Footer from './Footer'
export default {
  components: { Header, Footer },
  props: {
    userName: {
      type: String
    },
    menuType: {
      type: [String, Number]
    },
    roleType: {
      type: [String, Number]
    },
    version: {
      type: String,
      required: true
    },
    showHeader: {
      type: Boolean,
      default: true
    },
    type: {
      type: String
    }
  },
  data () {
    return {
      loading: false
    }
  },
  mounted () {
    // this.loading = true
  }
}
</script>
