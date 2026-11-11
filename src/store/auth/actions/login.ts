import { updateProfilePrimaryLocale } from '@/graphql/mutations'
import { post } from '@/plugins/axios'
import { triggerReconnectWebsocket } from '@/plugins/vue-apollo'
import { type AuthAction } from '@/store/auth/types'
import { useGlobalStore } from '@/stores/global'
import { type SupportedLocale } from '@/types'
import { session } from '@/utils'
import { ERROR_BY_ACTION, parseError } from '@/utils/errors'
import { type ParsedError } from '@/utils/errors/types'

export type Params = {
  email: string
  password: string
}

export type LoginResponse = {
  accessToken: string
  accessTokenExpiresAt: string
  primaryLocale: SupportedLocale
  login: 'success'
  refreshToken: string
  profileId: string
  siteRoles: string[]
  isAdmin: boolean
  status: string
  emailConfirmed: string
}
export type Response = { data?: LoginResponse } | ParsedError

export type LoginAction = AuthAction<Params, Response>
export const login: LoginAction = async (
  { commit, dispatch },
  { email, password }
) => {
  const globalStore = useGlobalStore()
  let response
  try {
    response = await post<LoginResponse>(import.meta.env.VITE_APP_REST_API + '/auth/local/start', {
      username: email,
      password,
    })
  } catch (error: any) {
    commit('SET_AUTHENTICATED', false)
    return parseError(error, ERROR_BY_ACTION.AUTH_LOGIN)
  }

  const {
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
    profileId,
    siteRoles,
    isAdmin,
    status,
    emailConfirmed
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
  await updateProfilePrimaryLocale({
    primaryLocale: globalStore.language.locale
  })

  triggerReconnectWebsocket()
  await dispatch('profile/getActiveProfile', {}, { root: true })

  return response
}
