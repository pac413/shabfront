import { type MutationTree } from 'vuex'

import { type IHostingRole } from '@/composables/graphql/generated'
import { type HostProfile, type Suggestion } from '@/types'

import { type PlannerState } from './types'

const mutations: MutationTree<PlannerState> = {
  SET_SELECTED_DATE: (state: PlannerState, payload: string) => {
    state.selectedDate = payload
  },
  SET_SELECTED_ROLE: (state: PlannerState, payload: IHostingRole) => {
    state.selectedRole = payload
  },
  SET_LOADING: (state: PlannerState, loading: boolean) => {
    state.loading = loading
  },
  SET_SUGGESTIONS: (state: PlannerState, payload: Suggestion[]) => {
    state.suggestions = payload
  },
  APPEND_SUGGESTIONS: (state: PlannerState, payload: Suggestion[]) => {
    state.suggestions = state.suggestions.concat(payload)
  },
  SET_HOST_PROFILE_FOR_DATE: (state: PlannerState, payload: HostProfile) => {
    state.hostProfileForDate = payload
  },
  CLEAR_SUGGESTIONS: (state: PlannerState) => {
    state.suggestions = []
  },
}

export default mutations
