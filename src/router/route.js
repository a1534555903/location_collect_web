const route = [
    {
        path: '/HelloWorld',
        component: () => import('@/components/HelloWorld.vue')
    },
    {
        path: '/',
        component: () => import('@/components/HelloWorld.vue')
    }
]
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: route
})
export default router