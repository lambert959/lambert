import Layout from '../../layout/default.js'
import plugin from 'framework/plugin'
import ElementUI from 'element-ui'
import HomeContainer from '../../components/HomeContainer'

// vue-entry-loader 自定义全局注册钩子，如果在该目录下面存在该 template.js 框架自动加载，用于注册全局的组件
export default function (Vue) {
  Vue.use(plugin)
  Vue.use(ElementUI)
  Vue.component(Layout.name, Layout)
  Vue.component('HomeContainer', HomeContainer)
}
