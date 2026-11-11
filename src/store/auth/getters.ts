import { type GetterTree } from 'vuex'

import { type RootState } from '@/store/types'

import { type AuthState } from './types'

const getters: GetterTree<AuthState, RootState> = {
  siteRoles: (state) => state.siteRoles,
}

export default getters
