import Vue from 'vue'
import App from '@/App.vue'

import uView from '@/uni_modules/uview-ui'
import request from '@/request.js'
import store from '@/store.js'
import moment from '@/node_modules/moment'
import mixin from '@/mixin.js'
Vue.config.productionTip = false
Vue.use(uView)
// Vue.use(TabBar)

/**
 * 为了方便，uviewui有些部分已改动
 * 改动包括
 * u-icon vue组件结构（删除一个元素）icon字体文件路径
 * u-navbar 两个默认参数 autoBack: true, placeholder: true
 */


Vue.prototype.$http = request
uni.$mixin = mixin

Vue.filter('dateFormat', function(value, formatStr = 'YYYY-MM-DD') {
  return moment(value).format(formatStr)
})
Vue.filter('timeFormat', function(value, formatStr = 'YYYY-MM-DD HH:mm:ss') {
  return moment(value).format(formatStr)
})


App.mpType = 'app'


const app = new Vue({
  store,
  ...App
})
app.$mount()
