import { createApp } from 'vue'
import App from "@/App.vue";
import './assets/main.css'
import vuex from "@/vuex";
import router from "@/router/route";
const app = createApp({})
app.use(router)
app.use(vuex)
app.mount('#app')
