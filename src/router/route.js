import * as VueRouter from 'vue-router'
const route = [
    {
        path: '/',
        component: () => import('@/components/login/loginPage.vue')
    }
]
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: route
})
export default router