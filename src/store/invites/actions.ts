import { type ActionTree } from 'vuex'

import { type RootState } from '@/store/types'
import { type Reference } from '@/types'

import { getInitialState } from './state'
import { type InviteState } from './types'

const actions: ActionTree<InviteState, RootState> = {
  clearInvite({ commit }) {
    commit('RESET_INVITE')
  },

  setCurrentInvite({ commit }, params) {
    const { invite } = params
    commit('SET_CURRENT_INVITE', invite)
  },

  resetDate({ commit }) {
    const date = getInitialState().selectedDate
    commit('SET_SELECTED_DATE', date)
  },

  setInviteDate({ commit }, payload) {
    const { date } = payload
    commit('SET_SELECTED_DATE', date)
  },

  setExtData({ commit }, payload) {
    const { profile, role } = payload
    if (profile[role.toLowerCase() + 'Profile']) {
      commit('SET_SUBJECT_ENDORSEMENTS', profile[role.toLowerCase() + 'Profile'].endorsements)
    }
    if (profile.references) {
      commit(
        'SET_SUBJECT_REFERENCES',
        profile.references.filter((item: Reference) => item.siteRole === role),
      )
    }
  },
}

export default actions
