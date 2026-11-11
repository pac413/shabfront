import type { RouteRecordRaw } from 'vue-router'

const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/Auth/Login.vue'),
    meta: { layout: 'outer' },
  },
  {
    path: '/login-callback',
    name: 'Login Callback',
    component: () => import('@/views/Auth/LoginCallback.vue'),
    meta: { layout: 'outer' },
  },
  {
    path: '/auth/facebook/start',
    redirect: () => {
      window.location.href = import.meta.env.VITE_APP_REST_API + '/auth/facebook/start'
      return '/'
    },
    meta: { layout: 'outer' },
  },
  {
    path: '/auth/google/start',
    redirect: () => {
      window.location.href = import.meta.env.VITE_APP_REST_API + '/auth/google/start'
      return '/'
    },
    meta: { layout: 'outer' },
  },
  {
    path: '/auth/apple/start',
    redirect: () => {
      window.location.href = import.meta.env.VITE_APP_REST_API + '/auth/apple/start'
      return '/'
    },
    meta: { layout: 'outer' },
  },
  {
    path: '/auth/facebook/login',
    redirect: () => {
      window.location.href = import.meta.env.VITE_APP_REST_API + '/auth/facebook/start'
      return '/login'
    },
    meta: { layout: 'outer' },
  },
  {
    path: '/auth/google/login',
    redirect: () => {
      window.location.href = import.meta.env.VITE_APP_REST_API + '/auth/google/start'
      return '/login'
    },
    meta: { layout: 'outer' },
  },
  {
    path: '/auth/apple/login',
    redirect: () => {
      window.location.href = import.meta.env.VITE_APP_REST_API + '/auth/apple/start'
      return '/login'
    },
    meta: { layout: 'outer' },
  },
  {
    path: '/reset-password',
    name: 'Reset Password',
    component: () => import('@/views/Auth/ResetPassword.vue'),
    meta: { layout: 'outer' },
  },
  {
    path: '/set-new-password/:token',
    name: 'Set New Password',
    component: () => import('@/views/Auth/SetNewPassword.vue'),
    meta: { layout: 'outer', allowAuthenticated: true },
  },
  {
    path: '/register-complete',
    name: 'Register Complete',
    component: () => import('@/views/Auth/RegisterComplete.vue'),
    meta: { requiresAuth: true, layoutProps: { limitedHeader: true } },
  },
]

export default authRoutes
