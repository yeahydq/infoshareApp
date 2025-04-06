import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue'),
    meta: {
      title: '登录',
      requiresAuth: false,
    },
  },
  {
    path: '/',
    component: () => import('../views/Layout.vue'),
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: () => import('../views/Dashboard.vue'),
        meta: {
          title: '仪表盘',
          icon: 'Dashboard',
          requiresAuth: true,
        },
      },
      {
        path: 'professionals',
        name: 'ProfessionalList',
        component: () => import('../views/professionals/ProfessionalList.vue'),
        meta: {
          title: '专业人士管理',
          icon: 'User',
          requiresAuth: true,
        },
      },
      {
        path: 'users',
        name: 'UserList',
        component: () => import('../views/users/UserList.vue'),
        meta: {
          title: '用户管理',
          icon: 'UserFilled',
          requiresAuth: true,
        },
      },
      {
        path: 'bookings',
        name: 'BookingList',
        component: () => import('../views/bookings/BookingList.vue'),
        meta: {
          title: '预约管理',
          icon: 'Calendar',
          requiresAuth: true,
        },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('../views/Settings.vue'),
        meta: {
          title: '系统设置',
          icon: 'Setting',
          requiresAuth: true,
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue'),
    meta: {
      title: '404',
      requiresAuth: false,
    },
  },
]

const router = createRouter({
  history: createWebHistory('/'),
  routes,
})

// 设置页面标题
router.beforeEach((to, from, next) => {
  const appTitle = '信息分享管理后台'
  document.title = to.meta.title ? `${to.meta.title as string} - ${appTitle}` : appTitle

  // Token校验逻辑
  const token = localStorage.getItem('admin_token')

  if (to.path !== '/login' && !token) {
    // 未登录，重定向到登录页
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router
