/* eslint-disable */
import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import users from './modules/users'
import schedules from './modules/schedules'

Vue.use(Vuex)

export default new Vuex.Store ({
    modules: {
        auth,
        users,
        schedules
    }
})