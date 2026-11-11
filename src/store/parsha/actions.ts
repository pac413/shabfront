import { type ActionTree } from 'vuex'

import { type RootState } from '@/store/types'
import { type ParshaAudio } from '@/types'

import { type ParshaState } from './types'

const actions: ActionTree<ParshaState, RootState> = {
  navigateParsha({ state, dispatch }, step?: number) {
    step = step || 1
    let newIndex = state.parshaList.findIndex((item) => item.id === state.selectedParshaId) + step
    if (newIndex >= state.parshaList.length) {
      newIndex = 0
    } else if (newIndex < 0) {
      newIndex = state.parshaList.length - 1
    }
    dispatch('setSelectedParsha', state.parshaList[newIndex].id)
  },

  setSelectedParsha({ commit }, parshaId) {
    commit('SET_SELECTED_PARSHA_ID', parshaId)
  },

  setDefaultParsha({ state, dispatch }) {
    const defaultParsha: ParshaAudio = state.parshaList.find((item) => item.isThisWeek === true) || state.parshaList[0]
    dispatch('setSelectedParsha', defaultParsha.id)
  },
}

export default actions
