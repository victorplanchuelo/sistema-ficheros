/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import Vue from 'vue'
import VueRouter from 'vue-router'

import Login from './components/login/Index.vue'
import NotFound from './components/404/NotFound.vue'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        component: Login
    },
    {
        path: '/*',
        component: NotFound
    }
];

export default new VueRouter({
    mode: 'history',
    routes,
    scrollBehavior(from,to,savedPosition) {
        return {x:0, y:0}
    }
})