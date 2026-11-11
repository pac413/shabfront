import { type AuthAction } from '@/store/auth/types'
import { session } from '@/utils'

import { type Response } from './loginWithToken'

export type Params = {
  accessToken: string
  accessTokenExpiresAt: string
  refreshToken: string
}

export type LoginRedirectAction = AuthAction<Params, Response>
export const loginRedirect: LoginRedirectAction = ({ dispatch }, params) => {
  const { accessToken, accessTokenExpiresAt, refreshToken } = params
  session.authenticate({
    accessToken,
    accessTokenExpiresAt,
    refreshToken,
  })

  return dispatch('loginWithToken')
}
