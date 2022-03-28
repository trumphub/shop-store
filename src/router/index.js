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
    meta: { permission: ['/index'] },
    children: [{
      path: '/dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'home', permission: ['/index'] }
    }]
  },
  // 管理员
  {
    path: '/manage',
    component: Layout,
    redirect: '/manage/list',
    meta: { title: '管理员', icon: 'manage', permission: ['/manage'] },
    alwaysShow: true,
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
  // 店铺管理
  {
    path: '/store',
    component: Layout,
    redirect: '/store/setting',
    meta: { title: '店铺管理', icon: 'shop', permission: ['/store'] },
    alwaysShow: true,
    children: [
      {
        path: '/store/setting',
        component: () => import('@/views/store/setting'),
        meta: { title: '店铺设置', permission: ['/store/setting'] }
      },
      {
        path: '/store/address',
        component: () => import('@/views/store/address'),
        meta: { title: '地址管理', permission: ['/store/address/index'] }
      }
    ]
  },
  // 商品管理
  {
    path: '/goods',
    component: Layout,
    redirect: '/goods/list',
    meta: { title: '商品管理', icon: 'goods', permission: ['/goods'] },
    alwaysShow: true,
    children: [
      {
        path: '/goods/list',
        component: () => import('@/views/goods/list'),
        meta: { title: '商品列表', permission: ['/goods/index'] }
      },
      {
        path: '/goods/create',
        component: () => import('@/views/goods/create'),
        meta: { title: '创建商品', permission: ['/goods/create'] },
        hidden: true
      },
      {
        path: '/goods/update',
        component: () => import('@/views/goods/update'),
        meta: { title: '编辑商品', permission: ['/goods/update'] },
        hidden: true,
        props: (route) => route.query
      },
      {
        path: '/goods/category',
        component: () => import('@/views/goods/category'),
        meta: { title: '商品分类', permission: ['/goods/category/index'] },
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
