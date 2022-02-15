import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  // 路由配置(meta:路由元信息)
  // 登录
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  // 登录报错
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },
  // 首页
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/index'),
        meta: { title: '尚品汇后台管理', icon: 'dashboard' }
      }
    ]
  },
  // 商品管理
  {
    path: '/product',
    component: Layout,
    redirect: '/product/trademark/list',
    name: 'Product',
    meta: { title: '商品管理', icon: 'el-icon-s-help' },
    children: [
      // 子组件-品牌管理
      {
        path: 'trademark/list',
        name: 'TradeMark',
        component: () => import('@/views/product/tradeMark'),
        meta: { title: '品牌管理' }
      },
      //  子组件-属性管理
      {
        path: 'attr/list',
        name: 'Attr',
        component: () => import('@/views/product/Attr'),
        meta: { title: '属性管理' }
      },
      {
        // 子组件-SPU管理
        path: 'spu/list',
        name: 'Spu',
        component: () => import('@/views/product/Spu'),
        meta: { title: 'SPU管理' }
      },
      {
        // 子组件-SKU管理
        path: 'sku/list',
        name: 'Sku',
        component: () => import('@/views/product/Sku'),
        meta: { title: 'SKU管理' }
      }
    ]
  },
  // 权限管理
  {
    path: '/acl',
    component: Layout,
    redirect: '/acl/user/list',
    name: 'Acl',
    meta: { title: '权限管理', icon: 'password' },
    children: [
      // 子组件-用户管理
      {
        path: 'user/list',
        name: 'User',
        // 使用路由懒加载(es6的import,上面引入，下面使用)
        component: () => import('@/views/acl/user/user'),
        meta: { title: '用户管理' }
      },
      //  子组件-角色管理
      {
        path: 'role/list',
        name: 'Role',
        component: () => import('@/views/acl/role/role'),
        meta: { title: '角色管理' }
      },
      // 子组件-菜单管理
      {
        path: 'permission/list',
        name: 'Permission',
        component: () => import('@/views/acl/permission/permission'),
        meta: { title: '菜单管理' }
      }
    ]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () =>
  new Router({
    mode: 'hash', // require service support
    scrollBehavior: () => ({ y: 0 }),
    // 注册的路由
    routes: constantRoutes
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
