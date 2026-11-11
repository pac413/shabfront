import { type TypedAction, type TypedMutation } from '@/store/types'
import { type SiteRole } from '@/types'

export interface AuthState {
  authenticated: boolean
  profileId: string | null
  siteRoles: SiteRole[]
  isAdmin: boolean
  status: string | null
  emailConfirmed: boolean
}

export type AuthAction<T, R = any> = TypedAction<AuthState, T, R>
export type AuthMutation<P = any> = TypedMutation<AuthState, P>
