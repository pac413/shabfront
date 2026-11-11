import type { MediaData, MediaState } from './types'

const mutations = {
  SET_MEDIA_DATA(state: MediaState, params: { id: string; data: Partial<MediaData> }) {
    const { id, data } = params
    const newData: MediaData = {
      ...(state.mediaDataById[id] || {}),
      ...data,
    }
    state.mediaDataById = {
      ...state.mediaDataById,
      [id]: newData,
    }
  },
}

export default mutations
