import { type AuthState } from './types'

const mutations = {
  SET_AUTHENTICATED(state: AuthState, authenticated: boolean) {
    state.authenticated = authenticated
  },
  SET_AUTHENTICATED_PROFILE_ID(state: AuthState, profileId: string) {
    state.profileId = profileId
  },
  SET_AUTHENTICATED_SITE_ROLES(state: AuthState, siteRoles: any[]) {
    state.siteRoles = siteRoles.map((item) => item.toUpperCase())
  },
  SET_AUTHENTICATED_IS_ADMIN(state: AuthState, isAdmin: boolean) {
    state.isAdmin = isAdmin
  },
  SET_AUTHENTICATED_STATUS(state: AuthState, status: string) {
    state.status = status
  },
  SET_AUTHENTICATED_EMAIL_CONFIRMED(state: AuthState, emailConfirmed: boolean) {
    state.emailConfirmed = emailConfirmed
  },
}

export default mutations
