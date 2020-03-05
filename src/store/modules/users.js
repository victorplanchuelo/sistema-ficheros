/* eslint-disable no-unused-vars */
import Vue from 'vue';

const FbAuth = 'https://identitytoolkit.googleapis.com/v1/accounts'
const FbApiKey = 'AIzaSyDs8lAS8H79byBqwCG6Q4c-c7q2nBQevj0'

const users = {
    namespaced: true,
    state: {
        user: null,
    },
    getters: {
        getUser(state) {
            return state.user
        },
        getAvatar(state) {
            return (state.user!==null) ? require(`../../assets/usuarios/${state.user.imagen}`) : require('../../assets/usuarios/default-avatar.png');
        },
        getUsername(state) {
            return state.user.email.substring(0, state.user.email.lastIndexOf("@"));
        }
    },
    mutations: {
        getUser(state, user) {
            state.user = user
        },
    },
    actions: {
        async getUserData({commit, dispatch}) {
            const token = localStorage.getItem('token')
            let user;
            if(token)
            {
                await Vue.http.post(`${FbAuth}:lookup?key=${FbApiKey}`, {
                    idToken: token
                })
                .then(response => response.json())
                .then( data => {
                    user = data.users[0]
                })

                await dispatch('users/getUser',  {user} , { root: true })
                .then(() => {
                    return this.state.users.user
                })
            }
            else
            {
                //Si no tenemos el token correctamente refrescamos para recuperarlo del refreshToken y luego volvemos a llamar a la función
                dispatch('admin/refreshToken')
                dispatch('getUserData')
            }
        },
        async getUser({commit}, payload) {
            let username = payload.user.email.substring(0, payload.user.email.lastIndexOf("@"));
            await Vue.http.get(`usuarios.json?orderBy="$key"&equalTo="${username}"`)
            .then(response => response.json())
            .then(response => {
                let user = {}
                for( let key in response) {
                    user = {
                        ...response [key]
                    }
                }

                commit('getUser', user)
            })
        }
    }
}

export default users;