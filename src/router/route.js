import * as VueRouter from 'vue-router'
import Cookies from 'js-cookie'
const route = [
    {
        path: '/login/loginPage',
        component: () => import('@/components/login/loginPage.vue')
    },
    {
        path: '/index',
        component: () => import('@/components/common/index.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/review/address',
        component: () => import('@/components/review/myAddress.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/review/poi',
        component: () => import('@/components/review/poi.vue'),
        meta: { requiresAuth: true },
    },
    {
        path: '/admin/reset',
        component: () => import('@/components/login/resetPassword.vue'),
        meta: { requiresAuth: true },
    },
    {
      path: '/management/type',
        component: () => import('@/components/management/type.vue'),
        meta: { requiresAuth: true },
    }

]
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes: route
})
router.beforeEach((to, from, next) => {
    const loggedIn = Cookies.get('user')
    if (to.path === '/' && !loggedIn) {
        next('/login/loginPage')
    } else if (to.path === '/' && loggedIn) {
        next('/index')
    }
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    if (requiresAuth && !loggedIn) {
        next('/login/loginPage')
    } else {
        next()
    }
})
export default router