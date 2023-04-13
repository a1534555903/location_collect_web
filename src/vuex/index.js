import { createStore } from 'vuex'

const defaultState = {
    url: 'http://localhost:8080',
}

// Create a new store instance.
export default createStore({
    state() {
        return defaultState
    },
    mutations: {

    },

})
