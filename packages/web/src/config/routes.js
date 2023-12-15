import { createRouter, createWebHashHistory } from 'vue-router';
import PageLayout from '@/layout/index.vue';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: PageLayout,
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/pages/home/index.vue'),
        },
        {
          path: '/user/:id',
          name: 'user',
          component: () => import('@/pages/user/index.vue'),
        },
        {
          path: '/user/settings',
          meta: { requireAuth: true },
          component: () => import('@/layout/settings.vue'),
          children: [
            {
              path: 'profile',
              name: 'profile',
              component: () => import('@/pages/settings/profile.vue'),
            },
            {
              path: 'account',
              name: 'account',
              component: () => import('@/pages/settings/account.vue'),
            },
          ],
        },
        {
          path: 'article/:id',
          name: 'article',
          component: () => import('@/pages/article/index.vue'),
        },
        {
          path: 'drafts',
          name: 'drafts',
          meta: { requireAuth: true },
          component: () => import('@/pages/drafts/index.vue'),
        },
        {
          path: 'notification',
          name: 'notification',
          meta: { requireAuth: true },
          component: () => import('@/pages/notification/index.vue'),
        },
      ],
    },
    {
      path: '/editor/new',
      name: 'editor-new',
      meta: { requireAuth: true },
      component: () => import('@/pages/markdown-editor/index.vue'),
    },
    {
      path: '/editor/:id',
      name: 'editor-edit',
      meta: { requireAuth: true },
      component: () => import('@/pages/markdown-editor/index.vue'),
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', redirect: 'home' },
  ],
});

export default router;
