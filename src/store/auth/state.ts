import { type AuthState } from './types'

export const getInitialState: () => AuthState = () => ({
  authenticated: false,
  profileId: null,
  siteRoles: [],
  isAdmin: false,
  status: null,
  emailConfirmed: false,
})

const state: AuthState = getInitialState()

export default state
