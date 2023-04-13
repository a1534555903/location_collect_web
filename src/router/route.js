import * as VueRouter from 'vue-router'

const route = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: () => import('@/components/login/loginPage.vue')
    },
    {
        path: '/index',
        component: () => import('@/components/common/index.vue')
    }

]
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: route
})
export default router