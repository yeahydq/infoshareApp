import { createRouter, createWebHistory } from 'vue-router'

// 声明ImportMeta环境变量类型
declare global {
  interface ImportMeta {
    env: Record<string, string>
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('../views/Login.vue'),
      meta: { title: '登录', requiresAuth: false },
    },
    {
      path: '/',
      name: 'Layout',
      component: () => import('../views/Layout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'Dashboard',
          component: () => import('../views/Dashboard.vue'),
          meta: { title: '仪表盘', requiresAuth: true },
        },
        {
          path: 'professionals',
          name: 'ProfessionalList',
          component: () => import('../views/professionals/ProfessionalList.vue'),
          meta: { title: '专业人士管理', requiresAuth: true },
        },
        // 暂时注释掉未创建的组件路由
        {
          path: 'professionals/detail/:id',
          name: 'ProfessionalDetail',
          component: () => import('../views/professionals/ProfessionalDetail.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'professionals/review/:id',
          name: 'ProfessionalReview',
          component: () => import('../views/professionals/ProfessionalReview.vue'),
          meta: { requiresAuth: true },
        },
        {
          path: 'users',
          name: 'UserList',
          component: () => import('../views/users/UserList.vue'),
          meta: { title: '用户管理', requiresAuth: true },
        },
        // {
        //   path: 'users/detail/:id',
        //   name: 'UserDetail',
        //   component: () => import('../views/users/UserDetail.vue'),
        //   meta: { requiresAuth: true },
        // },
        {
          path: 'bookings',
          name: 'BookingList',
          component: () => import('../views/bookings/BookingList.vue'),
          meta: { title: '预约管理', requiresAuth: true },
        },
        // {
        //   path: 'bookings/detail/:id',
        //   name: 'BookingDetail',
        //   component: () => import('../views/bookings/BookingDetail.vue'),
        //   meta: { requiresAuth: true },
        // },
        {
          path: 'settings',
          name: 'Settings',
          component: () => import('../views/Settings.vue'),
          meta: { title: '系统设置', requiresAuth: true },
        },
      ],
    },
  ],
})

// 设置页面标题
router.beforeEach((to, from, next) => {
  const appTitle = '信息分享管理后台'
  document.title = to.meta.title ? `${to.meta.title as string} - ${appTitle}` : appTitle

  // Token校验逻辑 - 使用正确的token key
  const token = localStorage.getItem('admin_token')

  if (to.path !== '/login' && !token) {
    // 未登录，重定向到登录页
    next({ path: '/login' })
  } else {
    next()
  }
})

export default router
