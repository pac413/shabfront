import type { RouteRecordRaw } from 'vue-router'

const landingRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('@/views/LandingPage/Landing.vue'),
    meta: { layout: 'landing' },
  },
  {
    path: '/about',
    name: 'About',
    component: () => import('@/views/OuterPage/About.vue'),
    meta: { layout: 'outer' },
  },
  {
    path: '/team',
    name: 'Team',
    component: () => import('@/views/OuterPage/About.vue'),
    meta: { layout: 'outer' },
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/views/OuterPage/Privacy.vue'),
    meta: { layout: 'outer' },
  },
  {
    path: '/terms',
    name: 'Terms',
    component: () => import('@/views/OuterPage/Privacy.vue'),
    meta: { layout: 'outer' },
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/OuterPage/Contact.vue'),
    meta: { layout: 'outer' },
  },
  {
    path: '/faq',
    name: 'FAQ',
    component: () => import('@/views/OuterPage/FAQ.vue'),
    meta: { layout: 'outer' },
  },
]

export default landingRoutes
