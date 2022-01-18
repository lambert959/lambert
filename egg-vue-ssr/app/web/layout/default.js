import '../asset/css/index.scss'
import createLayout from './layout'
const tpl = `<div id="app" data-server-rendered="true"><slot></slot></div>`
export default createLayout('Layout', {}, tpl)
