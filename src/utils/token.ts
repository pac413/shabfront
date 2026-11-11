import moment from '@/plugins/moment'

export enum TokenKeys {
  AccessToken = 'token',
  AccessTokenExpireAt = 'token_expire_at',
  RefreshToken = 'refresh_token',
}

/** Stores refresh token into local storage */
export const setRefreshToken = (refreshToken: string) => {
  localStorage.setItem(TokenKeys.RefreshToken, refreshToken)
}

/** Clears refresh token from local storage */
export const clearRefreshToken = () => {
  localStorage.removeItem(TokenKeys.RefreshToken)
}

/** Stores access token into local storage */
export const setAccessToken = (token: string) => localStorage.setItem(TokenKeys.AccessToken, token)

/** Clears access token info from local storage */
export const clearToken = () => {
  localStorage.removeItem(TokenKeys.AccessToken)
  localStorage.removeItem(TokenKeys.AccessTokenExpireAt)
}

/** Resolves access token expiration from local storage */
export const setAccessTokenExpiration = (expiration: string) =>
  localStorage.setItem(TokenKeys.AccessTokenExpireAt, expiration)

/** Resolves access token from local storage */
export const getToken = () => localStorage.getItem(TokenKeys.AccessToken)

/** Resolves refresh token, from local storage */
export const getRefreshToken = () => localStorage.getItem(TokenKeys.RefreshToken)

/** Retreives token expiration as an integer */
export const getAccessTokenExpiration = (): number => {
  const expiration = localStorage.getItem(TokenKeys.AccessTokenExpireAt)
  if (!expiration) {
    return 0
  }
  return parseInt(expiration)
}

/** Returns token lifetime left, in seconds */
export const getAccessTokenLifetimeLeft = () => {
  const expiration = getAccessTokenExpiration()
  if (!expiration) {
    return 0
  }

  const now = moment().unix()
  return Math.floor(expiration - now)
}
