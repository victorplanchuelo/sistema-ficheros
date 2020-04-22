/* eslint-disable no-unused-vars */
import Vue from 'vue';

const FbAuth = 'https://identitytoolkit.googleapis.com/v1/accounts'
const FbApiKey = 'AIzaSyDs8lAS8H79byBqwCG6Q4c-c7q2nBQevj0'
const DefaultImagen = "https://res.cloudinary.com/dfj8xaqmv/image/upload/v1583749912/ingelyt/users/default-avatar_jo0gu8.png"

const users = {
    namespaced: true,
    state: {
        user: null,
        imageUpload: null,
    },
    getters: {
        getUser(state) {
            return state.user
        },
        getAvatar(state) {
            return (state.user!==null) ? state.user.imagen : DefaultImagen;
        },
        getUsername(state) {
            return state.user.email.substring(0, state.user.email.lastIndexOf("@"));
        },
        imageUpload(state) {
            return state.imageUpload;
        },
    },
    mutations: {
        getUser(state, user) {
            state.user = user
        },
        imageUpload(state, imageData) {
            state.imageUpload = imageData.secure_url
        },
        clearImageUpload(state) {
            state.imageUpload = null
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
        },
        async getUserByUsername({commit}, payload) {
            return await Vue.http.get(`usuarios.json?orderBy="$key"&equalTo="${payload}"`)
            .then(response => response.json())
            .then(response => {
                let user = {}
                for( let key in response) {
                    user = {
                        ...response [key]
                    }
                }
                return user;
            })
        },
        async getAllUsers({commit}, payload) {
            return await Vue.http.get('usuarios.json?orderBy="$key"')
            .then(response => response.json())
            .then(response => {
                let user = []
                for( let key in response) {
                    user.push({
                        ...response[key],
                        id: key
                    })
                }
                return user;
            })
        },
        async imageUpload({commit, dispatch}, payload) {
            
            let url_imagen;
            const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dfj8xaqmv/image/upload';
            const CLOUDINARY_PRESET = 'axznd8a5'

            //En el payload está el usuario y el archivo. Una vez subido el archivo al servidor de cloudinary
            // debemos actualizar el campo imagen en Firebase
            
            let formData = new FormData();
            formData.append('file', payload.file);
            formData.append('upload_preset', CLOUDINARY_PRESET);
            formData.append('folder', 'ingelyt/users');

            await Vue.http.post(CLOUDINARY_URL, formData, {
                headers: {
                    'Content-type':'application/x-www-form-urlencoded'
                }
            })
            .then(response => response.json())
            .then(response => {
                // Actualizar el campo en Firebase
                url_imagen = response.secure_url;
            });

            return await dispatch('changeImage', {
                "username" : payload.username,
                "imagen" : url_imagen
            })
            .then(response => {
                return response
            })
            
        },
        async changeImage({commit}, payload) {
            return await Vue.http.patch(`usuarios/${payload.username}.json`, {
                "imagen": payload.imagen
            })
            .then(response => response.json())
            .then(response => {
                return payload.imagen
            })
        },
        async changeProfileData({commit,state}, payload) {
            Vue.http.patch(`usuarios/${payload.username}.json`, payload.form)
            .then(response => response.json())
            .then(response => {
            })
        },

        async createUserNode({commit}, payload) {
            let username = payload.email.substring(0, payload.email.lastIndexOf("@"));
            await Vue.http.post(`usuarios/${username}.json`, {})
            .then(response => {
                Vue.http.patch(`usuarios/${username}.json`, {
                    admin: 0,
                    email: payload.email,
                    imagen: DefaultImagen,
                    fichajes: {
                        debe_fichar: 1
                    },
                    tardes: {
                        lunes: 0,
                        martes: 0,
                        miercoles: 0,
                        jueves: 0,
                        viernes: 0
                    },
                    pwd: payload.password
                })
                .then((response) => {
                })
            });
        },

        async addScheduleData({commit, state}, payload) {
            let tardes = {
                lunes: 0,
                martes: 0,
                miercoles: 0,
                jueves: 0,
                viernes: 0
            }

            for (let tarde of payload.tardes) {
                switch (tarde) {
                    case '1':
                        tardes.lunes = 1
                        break;
                    case '2':
                        tardes.martes = 1
                        break;
                    case '3':
                        tardes.miercoles = 1
                        break;
                    case '4':
                        tardes.jueves = 1
                        break;
                    case '5':
                        tardes.viernes = 1
                        break;
                    default:
                        break;
                }
            }

            Vue.http.patch(`usuarios/${payload.username}.json`, {tardes})
            .then(response => response.json())
            .then(response => {
            }) 
        },
        async deleteUser({commit, dispatch}, payload) {
            // Primero debemos recuperar el token del usuario
            // Luego borramos los datos de la persona
            // Por ultimo borramos la cuenta
            let username = payload.email.substring(0, payload.email.lastIndexOf("@"));
            let token, pass; 

            return await new Promise((resolve, reject) => {
                dispatch('getUserByUsername', username)
                .then((response) => {
                    pass = response.pwd

                    console.log("pwd", pass)

                    Vue.http.post(`${FbAuth}:signInWithPassword?key=${FbApiKey}`, {
                        ...payload,
                        password: pass,
                        returnSecureToken: true
                    })
                    .then(response => response.json())
                    .then( authData => {
                        token = authData.idToken
    
                        console.log("token", token)
    
                        Vue.http.delete(`usuarios/${username}.json`, {})
                        .then(response => {
                            resolve( dispatch('auth/deleteAccount', {
                                token
                            }, {root:true}))
                        })
                        .catch((error) => {
                            console.log("error2", error)
                            reject(error)
                        });
                    })
                    .catch( (err) => {
                        console.log("error1", err)
                        reject(err)
                    })
                })
                .catch((error) => {
                    console.log("error0", error)
                })
            })
        }
    }
}

export default users;