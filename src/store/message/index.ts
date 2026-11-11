import { type Module } from 'vuex'

import { type RootState } from '@/store/types'

import actions from './actions'
import getters from './getters'
import mutations from './mutations'
import state from './state'
import { type MessageState } from './types'

const message: Module<MessageState, RootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
}

export default message
