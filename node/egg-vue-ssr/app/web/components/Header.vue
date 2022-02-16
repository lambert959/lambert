<template>
  <el-header height="56px">
    <div class="header-container">
      <div class="header-left">
        <template v-if="userName">
          <a class="logo-box" @click="gotoHome">Cloud IDE</a>
          <a :class="{'choosed': menuType === 1}" href="/">{{ $t('menu.home') }}</a>
          <a v-if="roleType === 1" :class="{'choosed': menuType === 2}" href="/project/list">{{ $t('menu.projects') }}</a>
          <a v-if="roleType === 1" :class="{'choosed': menuType === 3}" href="/users/list/2">{{ $t('menu.users') }}</a>
        </template>
      </div>
      <div class="header-right">
        <div class="language-btn">
          <span :class="{choosed: $t('lang.text') === '中文'}" @click="switchLang('cn')">中</span>/
          <span :class="{choosed: $t('lang.text') === 'English'}" @click="switchLang('en')">En</span>
        </div>
        <el-dropdown v-if="userName">
          <span class="admin-header-btn">
            <i class="iconfont iconyonghu" />
            {{ userName }}
          </span>
          <el-dropdown-menu slot="dropdown" class="user-info-menu">
            <el-dropdown-item><a href="/person/info">{{ $t('menu.personalCenter') }}</a></el-dropdown-item>
            <el-dropdown-item><a href="javascript:;" @click="logoutHandler">{{ $t('logout.logout') }}</a></el-dropdown-item>
            <!-- <el-dropdown-item @click.native="logout"><a href="javascript:;">{{$t('menu.logout')}}</a></el-dropdown-item> -->
          </el-dropdown-menu>
        </el-dropdown>
        <span v-if="['register', 'findPwd', 'resetPwd'].includes(type)">
          {{ $t('login.alreadyAccount') }}<a class="login-link" href="/login">{{ $t('login.register') }}</a>
        </span>
      </div>
    </div>
  </el-header>
</template>
<script>
export default {
  props: ['userName', 'menuType', 'roleType', 'type'],
  data () {
    return {

    }
  },
  methods: {
    switchLang (lang) {
      // this.$i18n.locale = lang
      // document.cookie = `locale=${lang}`
      // console.log(document.cookie)
      window.location.href = `${window.location.pathname}?locale=${lang}`
    },
    logoutHandler () {
      this.$confirm(this.$t('logout.logoutTip'), this.$t('logout.logout'), {
        confirmButtonText: this.$t('ok'),
        cancelButtonText: this.$t('cancel'),
        type: 'warning'
      }).then(() => {
        window.location.replace('/logout')
      }).catch(() => {
      })
    },
    gotoHome () {
      const pathname = window.location.pathname
      if (pathname === '/') return
      window.location.href = '/'
    }
  }
}
</script>
<style lang="scss" scoped>
.el-header {
  width: 100%;
  display: flex;
  background: #FFFFFF;
  padding: 0;
  margin-bottom: 16px;
  .header-container {
    display: flex;
    width: 100%;
    max-width: 1440px;
    min-width: 768px;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
  }
  .header-left {
    display: flex;
    align-items: center;
    a {
      margin-left: 20px;
      margin-right: 20px;
      height: 56px;
      line-height: 56px;
      &:hover {
        color: #242D63;
      }
      &.choosed {
        color: #242D63;
        font-weight: bold;
        border-bottom: 2px solid #242D63;
      }
    }
  }
  .logo-box {
      display: block;
      width: 134px;
      color: #242D63;
      font-size: 20px;
      font-weight: bold;
  }
  .admin-header-btn {
    height: 56px;
    text-align: center;
    line-height: 56px;
    padding: 0 20px;
    color: #333333;
    overflow: hidden;
    cursor: pointer;
  }
  .header-right {
    display: flex;
    align-items: center;
    padding-right: 20px;
    .user-info-menu{
      a{
        text-align: center;
      }
    }
    .login-link{
      color: #242D63;
      font-weight: bold;
    }
  }
  .language-btn {
    display: inline-block;
    padding: 0 20px;
    line-height: 1;
    span {
      cursor: pointer;
      &:hover{
        color: #242D63;
        font-weight: bold;
      }
      &.choosed {
        color: #242D63;
        font-size: 16px;
        font-weight: bold;
      }
    }
  }
  .logout-btn {
    display: inline-block;
    cursor: pointer;
    margin-left: 20px;
  }
}
</style>
