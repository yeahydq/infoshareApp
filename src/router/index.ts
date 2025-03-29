import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ... existing routes ...
    {
      path: '/weshares/teacher-registration/register-page1',
      name: 'TeacherRegisterPage1',
      component: () => import('@/pages/weshares/teacher-registration/register-page1.vue'),
    },
    {
      path: '/weshares/teacher-registration/register-page2',
      name: 'TeacherRegisterPage2',
      component: () => import('@/pages/weshares/teacher-registration/register-page2.vue'),
    },
    {
      path: '/weshares/teacher-registration/register-page3',
      name: 'TeacherRegisterPage3',
      component: () => import('@/pages/weshares/teacher-registration/register-page3.vue'),
    },
    {
      path: '/weshares/teacher-registration/success',
      name: 'TeacherRegisterSuccess',
      component: () => import('@/pages/weshares/teacher-registration/success.vue'),
    },
  ],
})

export default router
