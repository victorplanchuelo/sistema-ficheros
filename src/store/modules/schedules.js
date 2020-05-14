/* eslint-disable */
import Vue from 'vue';
import router from '../../routes'

const FbAuth = 'https://identitytoolkit.googleapis.com/v1/accounts'
const FbApiKey = 'AIzaSyDs8lAS8H79byBqwCG6Q4c-c7q2nBQevj0'
const tipos_acciones = {
    'INICIAR JORNADA': {
        proxima_accion: 'FINALIZAR JORNADA'
    },
    'FINALIZAR JORNADA': {
        proxima_accion: 'INICIAR JORNADA'
    }
}

/**
 * Capitalizes first letters of words in string.
 * @param {string} str String to be modified
 * @param {boolean=false} lower Whether all other letters should be lowercased
 * @return {string}
 * @usage
 *   capitalize('fix this string');     // -> 'Fix This String'
 *   capitalize('javaSCrIPT');          // -> 'JavaSCrIPT'
 *   capitalize('javaSCrIPT', true);    // -> 'Javascript'
 */
const capitalize = (str, lower = false) =>
  (lower ? str.toLowerCase() : str).replace(/(?:^|\s|["'([{])+\S/g, match => match.toUpperCase());
;


const schedules = {
    namespaced: true,
    state: {
        fichajes: null,
        textoBoton: capitalize('Iniciar jornada'),
        username: null,
        fecha: null,
        finalizar_jornada: 0
    },
    getters: {
        textoBoton(state) {
            return state.textoBoton;
        },
        existYear(state) {
            return (Object.prototype.hasOwnProperty.call(state.fichajes, state.fecha.anyo)) ? true : false
        },
        existMonth(state) {
            return (state.fichajes[state.fecha.anyo] === undefined) 
            ? 
                false 
            : 
                (Object.prototype.hasOwnProperty.call(state.fichajes[state.fecha.anyo], state.fecha.mes)) 
                ? 
                    true 
                : 
                    false
        },
        existDay (state) {
            return (state.fichajes[state.fecha.anyo] === undefined) 
            ?
                false
            :
                (state.fichajes[state.fecha.anyo][state.fecha.mes] === undefined) 
                ? 
                    false 
                : 
                    (Object.prototype.hasOwnProperty.call(state.fichajes[state.fecha.anyo][state.fecha.mes], state.fecha.dia))
                    ? 
                        true 
                    : 
                        false
        }
    },
    mutations: {
        textoBoton(state, texto) {
            state.textoBoton = capitalize(texto, true);
        },
        fichajes(state, fichajes) {
            state.fichajes = fichajes
        },
        fecha(state, fecha) {
            state.fecha = fecha
        }
    },
    actions: {
        /*async createNodeSchedule({commit, state, dispatch}, payload) {
            // aqui debemos ver qué nodo crear (solo dia, solo mes, todo)
            let path = `usuarios/${payload.username}/fichajes/${payload.fecha.anyo}/${payload.fecha.mes}/${payload.fecha.dia}.json`
            commit('fecha', payload.fecha)
            commit("fichajes", payload.fichajes);

            return await dispatch('isDailyScheduleCreated')
            .then((response) => {
                let key = 0;
                let accion = state.textoBoton
                let proxima_accion = capitalize('Finalizar jornada')
                if(response) {
                    const keys = Object.keys(state.fichajes[payload.fecha.anyo][payload.fecha.mes][payload.fecha.dia]).sort((a,b)=>a-b)
                    accion = state.fichajes[payload.fecha.anyo][payload.fecha.mes][payload.fecha.dia][keys[keys.length - 1]].proxima_accion
                    proxima_accion = capitalize(tipos_acciones[accion.toUpperCase()].proxima_accion, true)
                    key =  Number.parseInt(keys[keys.length - 1]) + 1
                }

                Vue.http.patch(path, {
                    [key]: {
                        hora: payload.hora,
                        tipo_fichaje: accion,
                        proxima_accion
                    }
                })
                .then(response => response.json())
                .then(response => {
                    dispatch('getScheduleByUsername', payload.username)
                    .then((response) => {
                        commit('fichajes', response)
                    }) 
                })

                commit('textoBoton', proxima_accion)
                return true;
            })
        },*/
        async createNodeSchedule({commit, state, dispatch}, payload) {
            // aqui debemos ver qué nodo crear (solo dia, solo mes, todo)
            let path = `usuarios/${payload.username}/fichajes/${payload.fecha.anyo}/${payload.fecha.mes}/${payload.fecha.dia}.json`
            commit('fecha', payload.fecha)
            commit("fichajes", payload.fichajes);


            return await new Promise((resolve, reject) => {
                dispatch('isDailyScheduleCreated', payload.username)
                .then((response) => {
                    let key = 0;
                    let accion = state.textoBoton
                    let proxima_accion = capitalize('Finalizar jornada')
                    if(response) {
                        const keys = Object.keys(state.fichajes[payload.fecha.anyo][payload.fecha.mes][payload.fecha.dia]).sort((a,b)=>a-b)
                        accion = state.fichajes[payload.fecha.anyo][payload.fecha.mes][payload.fecha.dia][keys[keys.length - 1]].proxima_accion
                        proxima_accion = capitalize(tipos_acciones[accion.toUpperCase()].proxima_accion, true)
                        key =  Number.parseInt(keys[keys.length - 1]) + 1
                    }

                    Vue.http.patch(path, {
                        [key]: {
                            hora: payload.hora,
                            tipo_fichaje: accion,
                            proxima_accion
                        }
                    })
                    .then(response => response.json())
                    .then(response => {
                        dispatch('getScheduleByUsername', payload.username)
                        .then((response) => {
                            commit('fichajes', response)
                            commit('textoBoton', proxima_accion)
                            resolve({
                                exito: true,
                                actionText: accion,
                                actionHora: payload.hora
                            })
                        })
                        .catch((error) => {
                            reject(error)
                        }); 
                    })
                    .catch((error) => {
                        reject(error)
                    });
                })
                .catch((error) => {
                    reject(error)
                });
            })
        },
        async getScheduleByUsername({commit}, payload) {
            return await Vue.http.get(`usuarios.json?orderBy="$key"&equalTo="${payload}"`)
            .then(response => response.json())
            .then(response => {
                let user = {}
                for( let key in response) {
                    user = {
                        ...response[key]
                    }
                }
                return user.fichajes;
            })
        },
        async isDailyScheduleCreated({commit, state, getters})
        {
            if (getters.existYear) {
                if(getters.existMonth) {
                    if(getters.existDay) {
                        return true
                    }
                }
            }            
            return false; 
        },
        async scheduleInitialStatus({commit, state, dispatch}, payload) {
            commit('fecha', payload.fecha)
            commit("fichajes", payload.fichajes);

            return await dispatch('isDailyScheduleCreated')
            .then((response) => {
                let accion = state.textoBoton
                if(response) {
                    const keys = Object.keys(payload.fichajes[payload.fecha.anyo][payload.fecha.mes][payload.fecha.dia]).sort((a,b)=>a-b)
                    accion = payload.fichajes[payload.fecha.anyo][payload.fecha.mes][payload.fecha.dia][keys[keys.length - 1]].proxima_accion
                }

                commit('textoBoton', accion)
                return true;
            })
        }
        
    }
}

export default schedules;