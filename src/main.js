import {createApp} from 'vue'
import App from "@/App.vue";
import vuex from "@/vuex";
import router from "@/router/route";
import ElementPlus from 'element-plus';
import http from "@/utils/http";
const app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.use(vuex)

app.use({
    install(app) {
        app.config.globalProperties.$axios = http
    }
})
app.mount('#app')
