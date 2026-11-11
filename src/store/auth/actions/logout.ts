import type { Router } from 'vue-router'

import { post } from '@/plugins/axios'
import { apolloClient } from '@/plugins/vue-apollo'
import type { AuthAction } from '@/store/auth/types'
import { useGlobalStore } from '@/stores/global'
import { getRefreshToken, session } from '@/utils'
import { ERROR_BY_ACTION, parseError } from '@/utils/errors'
import type { ParsedError } from '@/utils/errors/types'

export type Params = {
  redirect?: string
  router: Router
}
export type Response = {} | ParsedError

export type LogoutAction = AuthAction<Params, Response>
export const logout: LogoutAction = async ({ commit, state }, { redirect, router }) => {
  if (!state.authenticated) {
    return {}
  }
  const refreshToken = getRefreshToken()
  let response = {}
  try {
    await post(import.meta.env.VITE_APP_REST_API + '/auth/logout', { refreshToken })
  } catch (error: any) {
    response = parseError(error as Error, ERROR_BY_ACTION.LOGOUT)
  }

  // Clear tokens in session
  session.logout()

  commit('SET_AUTHENTICATED', false)
  commit('SET_AUTHENTICATED_PROFILE_ID', null)
  commit('SET_AUTHENTICATED_SITE_ROLES', [])
  commit('SET_AUTHENTICATED_IS_ADMIN', false)
  commit('SET_AUTHENTICATED_STATUS', null)
  commit('SET_AUTHENTICATED_EMAIL_CONFIRMED', false)

  // Navigate back to login page
  await router.push(redirect || '/login')

  // Clear Apollo Client Cache
  await apolloClient.cache.reset({ discardWatches: true })

  // Reset All Vuex modules
  commit('reset', null, { root: true })
  const globalStore = useGlobalStore()
  globalStore.reset()

  return response
}
