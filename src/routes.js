/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
import Vue from 'vue'
import VueRouter from 'vue-router'
import store from './store/store'

import Login from './components/login/Index.vue'
import Dashboard from './components/dashboard/Index.vue'
import Main from './components/dashboard/pages/Main.vue'
import MainProfiles from './components/dashboard/pages/users/Main.vue'
import EditProfile from './components/dashboard/pages/users/EditProfile.vue'
import CreateProfile from './components/dashboard/pages/users/CreateProfile.vue'

import AdminSchedules from './components/dashboard/pages/schedules/admin/Main.vue'
import UserSchedules from './components/dashboard/pages/schedules/user/Main.vue'
import UserListSchedule from './components/dashboard/pages/schedules/user/List.vue'
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
        children: [
            {
                path: '/',
                component: Main
            },
            {
                path: 'profiles',
                component: MainProfiles,
            },
            {
                path: 'profiles/create',
                component: CreateProfile,
                props:true
            },
            {
                path: 'profiles/:username',
                component: EditProfile,
                props: true
            },
            {
                path: 'schedules/',
                component: AdminSchedules,
                props: true
            },
            {
                path: 'schedules/:username',
                component: UserSchedules,
                props: true
            },
            {
                path: 'schedules/:username/list',
                component: UserListSchedule,
                props: true
            },
        ],
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