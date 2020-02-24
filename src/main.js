import Vue from 'vue'
import App from './App.vue'
import VueResource from 'vue-resource'
import router from './routes'
import Vuelidate from 'vuelidate'

/*Vue Material*/
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.min.css'
import 'vue-material/dist/theme/default.css'

Vue.use(VueMaterial)

/*Vue Resource*/
Vue.use(VueResource)

/*Vuelidate*/
Vue.use(Vuelidate);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
