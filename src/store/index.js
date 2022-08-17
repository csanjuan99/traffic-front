import {createStore} from 'vuex'
import axios from "axios";

export default createStore({
    state: {
        valid_infractions: [],
        invalid_infractions: [],
    },
    getters: {
        valid_infractions: state => state.valid_infractions,
        invalid_infractions: state => state.invalid_infractions,
    },
    mutations: {
        set_valid_infractions(state, infractions) {
            state.valid_infractions = infractions;
        },
        set_invalid_infractions(state, infractions) {
            state.invalid_infractions = infractions;
        }
    },
    actions: {
        async set_valid_infractions(context) {
            await axios.get(process.env.VUE_APP_BACKEND_URL + '/api/multas/valid')
                .then(response => {
                    context.commit('set_valid_infractions', response.data.multas_validas);
                });
        },
        async set_invalid_infractions(context) {
            await axios.get(process.env.VUE_APP_BACKEND_URL + '/api/multas/invalid')
                .then(response => {
                    context.commit('set_invalid_infractions', response.data.multas_invalidas);
                });
        }
    },
    modules: {}
})
