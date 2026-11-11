import { completeRegister as mutate, type CompleteRegisterInput } from '@/graphql/mutations'
import { type ProfileAction } from '@/store/profile/types'

export type Params = CompleteRegisterInput

export const completeRegister: ProfileAction<Params, void> = async ({ commit }, params) => {
  await mutate({ input: params })

  commit('auth/SET_AUTHENTICATED_STATUS', 'active', { root: true })
  commit('auth/SET_AUTHENTICATED_SITE_ROLES', params.siteRoles, { root: true })
}
