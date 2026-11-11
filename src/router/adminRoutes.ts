import type { RouteRecordRaw } from 'vue-router'

const adminRoutes: RouteRecordRaw[] = [
  {
    path: '/admin',
    component: () => import('@/views/Admin/Admin.vue'),
    redirect: { name: 'RecentMembers' },
    children: [
      {
        path: 'recent-members',
        name: 'RecentMembers',
        component: () => import('@/views/Admin/RecentMembers.vue'),
        meta: { requiresAuth: true, onlyForAdmin: true },
      },
      {
        path: 'flagged-contents',
        name: 'FlaggedContents',
        component: () => import('@/views/Admin/FlaggedContents.vue'),
        meta: { requiresAuth: true, onlyForAdmin: true },
      },
      {
        path: 'reported-members',
        name: 'ReportedMembers',
        component: () => import('@/views/Admin/ReportedMembers.vue'),
        meta: { requiresAuth: true, onlyForAdmin: true },
      },
      {
        path: 'totals',
        name: 'AdminTotals',
        component: () => import('@/views/Admin/AdminTotals.vue'),
        meta: { requiresAuth: true, onlyForAdmin: true },
      },
      {
        path: 'profile/:handle',
        name: 'AdminProfile',
        component: () => import('@/views/Admin/AdminProfile.vue'),
        meta: { requiresAuth: true, onlyForAdmin: true },
      },
    ],
  },
]

export default adminRoutes
