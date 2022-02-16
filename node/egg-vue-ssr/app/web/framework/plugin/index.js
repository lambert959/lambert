import request from 'framework/network/request'
import VueI18n from 'vue-i18n'
import createI18n from 'framework/i18n'
import ElementLocale from 'element-ui/lib/locale'
import { dateFormat } from 'framework/utils/util'

export default {
  install (Vue) {
    if (!Vue.prototype.hasOwnProperty('$request')) {
      Vue.prototype.$request = request
    }
    if (!Vue.prototype.hasOwnProperty('$dateFormat')) {
      Vue.prototype.$dateFormat = dateFormat
    }
    // 自定义 hook 钩子，vue-entry-loader 自动加载
    if (!Vue.hook) {
      Vue.use(VueI18n)
      Vue.hook = {
        render (context, options) {
          // console.log('------------------------------------' + JSON.stringify(context.state))
          const i18n = createI18n(context.state.locale)
          ElementLocale.i18n((key, value) => i18n.t(key, value))
          options.i18n = i18n
        }
      }
    }
  }
}
