import Vue from 'vue'
import App from './App'
import router from './router'

Vue.config.productionTip = false

import store from './store'

import Cookies from 'js-cookie'


// const savedToken = Cookies.get('accessToken')
// if (savedToken) {
//   store.dispatch('signinByToken', savedToken)
// }

// new Vue({
//   el: '#app',
//   router,
//   store,
//   components: { App },
//   render: h => h(App),
//   template: '<App/>'
// })

function init() {
  const savedToken = Cookies.get('accessToken')
  if (savedToken) {
    return store.dispatch('signinByToken', savedToken)
  } else {
    return Promise.resolve()
  }
}

init()
  .then(() => {
    new Vue({
      el: '#app',
      router,
      store,
      components: {
        App
      },
      render: h => h(App),
      template: '<App/>'
    })
  })