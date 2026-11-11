import { post } from '@/plugins/axios'
import { triggerReconnectWebsocket } from '@/plugins/vue-apollo'
import { type AuthAction } from '@/store/auth/types'
import { useGlobalStore } from '@/stores/global'
import { type SupportedLocale } from '@/types'
import { getLanguageByLocale, session } from '@/utils'
import { ERROR_BY_ACTION, parseError } from '@/utils/errors'
import { type ParsedError } from '@/utils/errors/types'

export type Params = {
  firstName: string
  lastName: string
  email: string
  password: string
}
export type SignupResponse = {
  accessToken: string
  accessTokenExpiresAt: string
  login: 'success'
  refreshToken: string
  profileId: string
  siteRoles: string[]
  isAdmin: boolean
  status: string
  emailConfirmed: string
  primaryLocale: SupportedLocale
}
export type Response = { data?: SignupResponse } | ParsedError
export type SignupAction = AuthAction<Params, Response>

export const signup: SignupAction = async ({ commit, dispatch }, params) => {
  const globalStore = useGlobalStore()
  const { firstName, lastName, email, password } = params

  let response
  try {
    response = await post<SignupResponse>(import.meta.env.VITE_APP_REST_API + '/auth/signup', {
      firstName,
      lastName,
      email,
      password,
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.AUTH_SIGNUP)
  }

  const {
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    profileId,
    siteRoles,
    isAdmin,
    status,
    emailConfirmed,
    primaryLocale,
  } = response.data

  session.authenticate({
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
  })

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
