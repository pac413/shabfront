import { type ActionTree } from 'vuex'

import { type SearchState } from '@/store/search/types'
import { type RootState } from '@/store/types'

import { setDatingPreference } from './setDatingPreference'
import { setSearchPreference } from './setSearchPreference'

const actions: ActionTree<SearchState, RootState> = {
  setDatingPreference,
  setSearchPreference,
}

export default actions
