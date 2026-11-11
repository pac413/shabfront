import type { SearchState } from './types'

const mutations = {
  SET_PROFILE_SELECTION(
    state: SearchState,
    payload: { [key: string]: boolean }
  ) {
    Object.entries(payload).forEach(([key, value]) => {
      state.profilesSelection = {
        ...state.profilesSelection,
        [key]: value,
      }
    })
  },
  CLEAR_PROFILE_SELECTION(state: SearchState) {
    state.profilesSelection = {}
  }
}

export default mutations
