import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // ... existing routes ...
    {
      path: '/weshares/professional-registration/register-page1',
      name: 'ProfessionalRegisterPage1',
      component: () => import('@/pages/weshares/professional-registration/register-page1.vue'),
    },
    {
      path: '/weshares/professional-registration/register-page2',
      name: 'ProfessionalRegisterPage2',
      component: () => import('@/pages/weshares/professional-registration/register-page2.vue'),
    },
    {
      path: '/weshares/professional-registration/register-page3',
      name: 'ProfessionalRegisterPage3',
      component: () => import('@/pages/weshares/professional-registration/register-page3.vue'),
    },
    {
      path: '/weshares/professional-registration/success',
      name: 'ProfessionalRegisterSuccess',
      component: () => import('@/pages/weshares/professional-registration/success.vue'),
    },
  ],
})

export default router
