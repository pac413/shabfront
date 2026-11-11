import { type GetterTree } from 'vuex'

import { type RootState } from '@/store/types'

import { type MediaState } from './types'

const getters: GetterTree<MediaState, RootState> = {
  mediaDataById: (state) => (id: string) => state.mediaDataById[id],
}

export default getters
