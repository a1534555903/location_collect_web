import { createStore } from 'vuex'

const defaultState = {
    url: 'http://localhost:8080',
    username: null,
}

// Create a new store instance.
export default createStore({
    state() {
        return defaultState
    },
    mutations: {
        setUsername(state, username) {
            state.username = username
        }
    },

})
