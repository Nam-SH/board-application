import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false
import store from './store'

import Cookies from 'js-cookie'


const savedToken = Cookies.get('accessToken')
if (savedToken) {
  store.dispatch('signByToken', savedToken)
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  render: h => h(App),
  store
})
