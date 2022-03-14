import Vue from 'vue'
import Router from 'vue-router'

import Layout from '@/layout'

Vue.use(Router)

export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
]

export const asyncRoutes = [
  // 后台首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: '/dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard', permission: ['/index'] }
    }]
  },
  // 管理员
  {
    path: '/manage',
    component: Layout,
    redirect: '/manage/list',
    meta: { title: '管理员', icon: 'dashboard', permission: ['/manage'] },
    children: [
      {
        path: '/manage/list',
        component: () => import('@/views/manage/list'),
        meta: { title: '管理员列表', permission: ['/manage/user/index'] }
      },
      {
        path: '/manage/role',
        component: () => import('@/views/manage/role'),
        meta: { title: '角色管理', permission: ['/manage/role/index'] }
      }
    ]
  },
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher
}

export default router
