import Vue from 'vue'
import App from '@/App.vue'

import uView from '@/uni_modules/uview-ui'
import request from '@/request.js'
import store from '@/store.js'
import moment from '@/node_modules/moment'
Vue.config.productionTip = false
Vue.use(uView)
// Vue.use(TabBar)



Vue.prototype.$http = request

Vue.filter('dateFormat', function(value, formatStr = 'YYYY-MM-DD') {
  return moment(value).format(formatStr)
})

App.mpType = 'app'


const app = new Vue({
  store,
  ...App
})
app.$mount()
