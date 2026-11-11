import { capitalize } from 'lodash'
import { type ActionTree } from 'vuex'

import shabbatYomTovDates from '@/assets/js/dates'
import { IHostingRole } from '@/composables/graphql/generated'
import { type RootState } from '@/store/types'

import { type PlannerState } from './types'

const actions: ActionTree<PlannerState, RootState> = {
  goToHosting({ commit }, payload: { role: string; date: string; hostingId: string }) {
    const hostingRoleValid: boolean = capitalize(payload.role) in IHostingRole
    const dateValid: boolean = shabbatYomTovDates.findIndex((item) => item.date === payload.date) > -1
    if (!dateValid || !hostingRoleValid) {
      return
    }

    commit('SET_SELECTED_DATE', payload.date)
    commit('SET_SELECTED_ROLE', IHostingRole[capitalize(payload.role) as keyof typeof IHostingRole])
  },

  setDate({ commit }, date) {
    commit('SET_SELECTED_DATE', date)
  },

  setRole({ commit, state }, payload: IHostingRole) {
    if (!(capitalize(payload) in IHostingRole) || payload === state.selectedRole) {
      return
    }
    commit('CLEAR_SUGGESTIONS')
    commit('SET_SELECTED_ROLE', payload)
  },

  clearSuggestions({ commit }) {
    commit('CLEAR_SUGGESTIONS')
  },
}

export default actions
