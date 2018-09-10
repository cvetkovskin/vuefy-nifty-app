import 'typeface-roboto'
import 'vuetify/dist/vuetify.css'
import Vue from 'vue'
import App from './App.vue'
import cordovaLoader from './cordovaLoader'
import vuetify from 'vuetify'
import router from './router'

Vue.config.productionTip = false

Vue.use(vuetify, {
  iconfont: 'fa'
})

/* eslint-disable */
Vue.prototype.ncmb = new NCMB(process.env.VUE_APP_NIFTY_APP_KEY, process.env.VUE_APP_NIFTY_CLIENT_KEY)
/* eslint-enable */

cordovaLoader(() => {
  new Vue({
    router,
    render: h => h(App)
  }).$mount('#app')
})
