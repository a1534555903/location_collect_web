import { createStore } from 'vuex'
import Cookies from 'js-cookie'
const defaultState = {
    url: 'http://localhost:8080',
    username: Cookies.get('user'),
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
