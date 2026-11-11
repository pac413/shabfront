import { type Module } from 'vuex'

import { type RootState } from '@/store/types'

import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'
import { type FeedState } from './types'

const modals: Module<FeedState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

export default modals
