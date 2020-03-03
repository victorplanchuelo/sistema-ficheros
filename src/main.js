import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import store from './store/store'
import router from './routes'
import Vuelidate from 'vuelidate'

/*Vue Material*/
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(VueMaterial)

/*Vue Resource*/
Vue.use(VueResource)
Vue.http.options.root='https://ingelyt-fichajes.firebaseio.com/'

/*Vuelidate*/
Vue.use(Vuelidate);

window.$ = window.jQuery = require('jquery')

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
