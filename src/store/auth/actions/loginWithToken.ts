import { get } from '@/plugins/axios'
import { triggerReconnectWebsocket } from '@/plugins/vue-apollo'
import { type AuthAction } from '@/store/auth/types'
import { useGlobalStore } from '@/stores/global'
import { type SupportedLocale } from '@/types'
import { getLanguageByLocale, getToken } from '@/utils'
import { ERROR_BY_ACTION, parseError } from '@/utils/errors'
import { type ParsedError } from '@/utils/errors/types'

export type Params = void

export type LoginWithTokenResponse = {
  profileId: string
  siteRoles: string[]
  isAdmin: boolean
  status: string
  emailConfirmed: boolean
  primaryLocale: SupportedLocale
}
export type Response = { data?: LoginWithTokenResponse } | ParsedError

export type LoginWithTokenAction = AuthAction<Params, Response>
export const loginWithToken: LoginWithTokenAction = async ({ commit, dispatch }) => {
  const globalStore = useGlobalStore()
  let response
  try {
    response = await get<LoginWithTokenResponse>(import.meta.env.VITE_APP_REST_API + '/auth/token_info', {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    })
  } catch (error: any) {
    commit('SET_AUTHENTICATED', false)
    return parseError(error, ERROR_BY_ACTION.INVALID_TOKEN)
  }

  const { profileId, siteRoles, isAdmin, status, emailConfirmed, primaryLocale } = response.data

  commit('SET_AUTHENTICATED', true)
  commit('SET_AUTHENTICATED_PROFILE_ID', profileId)
  commit('SET_AUTHENTICATED_SITE_ROLES', siteRoles)
  commit('SET_AUTHENTICATED_IS_ADMIN', isAdmin)
  commit('SET_AUTHENTICATED_STATUS', status)
  commit('SET_AUTHENTICATED_EMAIL_CONFIRMED', emailConfirmed)
  globalStore.language = getLanguageByLocale(primaryLocale)

  triggerReconnectWebsocket()
  await dispatch('profile/getActiveProfile', {}, { root: true })

  return response
}
