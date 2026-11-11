import type { RouteRecordRaw } from 'vue-router'

const feedRoutes: RouteRecordRaw[] = [
  {
    path: '/feed',
    name: 'FeedPage',
    component: () => import('@/views/Feeds/FeedPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/posts/status_update/:feedId',
    name: 'SingleFeedPage',
    component: () => import('@/views/Feeds/SingleFeed.vue'),
    meta: { layoutProps: { fitHeight: true }, requiresAuth: true },
  },
  {
    path: '/posts/public/:feedId',
    name: 'PublicFeedPage',
    component: () => import('@/views/Feeds/SingleFeed.vue'),
    meta: { layoutProps: { fitHeight: true }, requiresAuth: false, layout: 'outer' },
  },
]

export default feedRoutes
