import { type MutationTree } from 'vuex'

import { type ParshaAudio } from '@/types'

import { type ParshaState } from './types'

const mutations: MutationTree<ParshaState> = {
  SET_SELECTED_PARSHA_ID: (state: ParshaState, id: string) => {
    state.selectedParshaId = id
  },
  SET_PARSHA_LIST: (state: ParshaState, payload: ParshaAudio[]) => {
    state.parshaList = payload
  },
  SET_LOADING: (state: ParshaState, payload: boolean) => {
    state.loading = payload
  },
}

export default mutations
