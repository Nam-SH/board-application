import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Cookies from 'js-cookie'

import BootstrapVue from 'bootstrap-vue'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.config.productionTip = false
Vue.use(BootstrapVue)

function init() {
  const savedToken = Cookies.get('accessToken')
  if (savedToken) {
    return store.dispatch('signinByToken', savedToken)
  }
  else {
    return Promise.resolve()
  }
}
init().then(() => {
  new Vue({
    el: '#app',
    router,
    store,
    components: { App },
    render: h => h(App),
    template: '<App/>'
  })
})