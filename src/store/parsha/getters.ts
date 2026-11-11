import { groupBy } from 'lodash'
import type { GetterTree } from 'vuex'

import type { RootState } from '@/store/types'
import type { ParshaAudio } from '@/types'

import type { ParshaState } from './types'

const getters: GetterTree<ParshaState, RootState> = {
  selectedParsha: (state, getters): ParshaAudio => {
    let selectedParsha
    if (state.selectedParshaId) {
      selectedParsha = state.parshaList.find((item) => item.id === state.selectedParshaId)
    }
    return selectedParsha || getters.currentParsha || state.parshaList[0]
  },
  currentParsha: (state) => {
    return state.parshaList.find((item) => item.isThisWeek === true)
  },
  isLoading: (state) => state.loading,
  parshaListByChumash: (state) => {
    return groupBy(state.parshaList, 'album')
  },
}

export default getters
