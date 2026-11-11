import { type Module, type MutationTree } from 'vuex'

import { type RootState } from '@/store/types'

import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'
import { type ProfileState } from './types'

const profile: Module<ProfileState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations: mutations as MutationTree<ProfileState>,
}

export default profile
