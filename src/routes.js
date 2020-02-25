/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store/store'

import Login from './components/login/Index.vue'
import Dashboard from './components/dashboard/Index.vue'
import NotFound from './components/404/NotFound.vue'


Vue.use(VueRouter);


const authGuard = {
    beforeEnter: (to, from, next) => {
        const redirect = () => {
            (store.state.auth.token) 
            ? 
                (to.path === '/') ? next('/dashboard') : next() 
            :
                (to.path === '/') ? next() : next('/')
        }

        if( store.state.auth.refreshLoading) {
            //// async code
            store.watch((state, getters) => getters['auth/refreshLoading'], () => {
                redirect();
            })
        }
        else {
            redirect();
        }  
    }
}


const routes = [
    {
        path: '/',
        component: Login,
        ...authGuard 
    },
    {
        path: '/dashboard',
        component: Dashboard,
        ...authGuard 
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