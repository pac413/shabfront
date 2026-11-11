import { createRouter, createWebHistory, type NavigationGuardNext } from 'vue-router'

import { store } from '@/store'
import { useGlobalStore } from '@/stores/global'
import { clearRefreshToken, clearToken, getToken } from '@/utils'

import actionRoutes from './actionRoutes'
import adminRoutes from './adminRoutes'
import authRoutes from './authRoutes'
import feedRoutes from './feedRoutes'
import landingRoutes from './landingRoutes'
import messageRoutes from './messageRoutes'
import mobileRoutes from './mobileRoutes'
import profileRoutes from './profileRoutes'
import suggestionRoutes from './suggestionRoutes'

const routes = [
  ...landingRoutes,
  ...authRoutes,
  ...suggestionRoutes,
  ...feedRoutes,
  ...profileRoutes,
  ...adminRoutes,
  {
    path: '/dating',
    name: 'Dating',
    component: () => import('@/views/Dating/Dating.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/SearchResults/SearchResults.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/advanced-search',
    name: 'AdvancedSearch',
    component: () => import('@/views/AdvancedSearch/AdvancedSearch.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/mobile-search',
    name: 'AutoTypeSearch',
    component: () => import('@/views/AutoTypeSearch/AutoTypeSearch.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/matchmaking',
    name: 'Matchmaking',
    component: () => import('@/views/Matchmaking/Matchmaking.vue'),
    meta: { layoutProps: { fitHeight: true }, requiresAuth: true },
  },
  {
    path: '/friends',
    name: 'Friends',
    component: () => import('@/views/Friends/Friends.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/parsha',
    name: 'Parsha',
    component: () => import('@/views/Parsha/Parsha.vue'),
    meta: { requiresAuth: true },
  },
  ...actionRoutes,
  {
    path: '/planner/:role(.*)?/:date(.*)?/:hostingId(.*)?',
    name: 'ShabbatPlanner',
    component: () => import('@/views/Planner/Planner.vue'),
    meta: { requiresAuth: true },
  },
  ...messageRoutes,
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('@/views/Notifications/Notifications.vue'),
    meta: { requiresAuth: true },
  },
  ...mobileRoutes,
  {
    path: '/(.*)', // redirect to feed page as a fallback to all incoming routes
    redirect: '/feed',
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    }
    if (
      (
        to.params.handle === from.params.handle ||
        (
          !to.params.handle &&
          !from.params.handle
        )
      ) &&
      to.fullPath.startsWith('/profile') &&
      from.fullPath.startsWith('/profile')
    ) {
      return
    }
    if (to.fullPath !== from.fullPath) {
      return { left: 0, top: 0, behavior: 'smooth' }
    }
  },
})

const pushToLogin = (fullPath: string, next: NavigationGuardNext) => {
  const params = { query: { redirect: fullPath } }
  clearToken()
  clearRefreshToken()
  return next({ name: 'Login', ...params })
}

router.beforeEach(async (to, from, next) => {
  const { auth, profile: profileStore } = store.state
  const { meta, fullPath, name = '' } = to
  const globalStore = useGlobalStore()
  globalStore.navigatingRoute = to

  if (!getToken()) {
    store.commit('auth/SET_AUTHENTICATED', false)
  }

  // Mobile specific routes should go directly
  if (name?.toString().includes('mobile.') && getToken()) {
    const { error } = await store.dispatch('auth/loginWithToken')
    if (error) {
      return pushToLogin(fullPath, next)
    }
    if (!profileStore.activeProfile) {
      await store.dispatch('profile/getActiveProfile')
    }
    return next()
  }

  if (!auth.authenticated && getToken()) {
    const { error } = await store.dispatch('auth/loginWithToken')

    if (error) {
      // If authentication is failed,
      // let user go on if s/he wanted to visit auth or landing routes
      // or let user navigate to login page with redirect query param
      // if (authRoutes.find(route => route.name === name) || landingRoutes.find(route => route.name === name)) {
      //   return next()
      // } else {
      //   return pushToLogin(fullPath, next)
      // }
      return next()
    }
  }
  if (auth.authenticated && !profileStore.activeProfile) {
    await store.dispatch('profile/getActiveProfile')
  }

  if (auth.status === 'incomplete' && to.path !== '/register-complete' && !meta?.skipRedirect) {
    return next({ name: 'Register Complete' })
  }

  if (meta?.requiresAuth && !auth.authenticated && to.path !== '/login') {
    // pass path and query as `redirect` param to login route before redirecting
    // login route can then redirect back to attempted route
    return pushToLogin(fullPath, next)
  }

  /**
   * Prevent authenticated users from navigating to the following:
   * - landing page
   * - auth routes (eg. /login, /reset-password, etc)
   * - admin routes (if user is not an admin)
   */
  if (
    auth.authenticated &&
    auth.status === 'active' &&
    (name === 'Landing' ||
      // authRoutes.find((route) =>
      //   route.name === name
      //   && !route.meta?.allowAuthenticated
      // ) ||
      (!auth.isAdmin && meta?.onlyForAdmin))
  ) {
    return next({ name: 'FeedPage' })
  }

  // if non-admin user is trying to open the profile edit route, it should be blocked
  const isProfileEditRoute = to.path.includes('/edit/')
  if (isProfileEditRoute && to.params.handle) {
    const { activeProfile } = profileStore
    if (activeProfile && to.params.handle !== activeProfile.handle && !auth.isAdmin) {
      return next({ path: `/profile/${to.params.handle}` })
    }
  }

  next()
})

export default router
