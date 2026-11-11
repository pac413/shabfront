import { type Module } from 'vuex'

import { type RootState } from '@/store/types'

import actions from './actions'
import mutations from './mutations'
import state from './state'
import { type SearchState } from './types'

const search: Module<SearchState, RootState> = {
  namespaced: true,
  state,
  actions,
  mutations,
}

export default search
