import { createApp } from 'vue'
import App from "@/App.vue";
import vuex from "@/vuex";
import router from "@/router/route";
import ElementPlus from 'element-plus';
const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(vuex)
app.mount('#app')
