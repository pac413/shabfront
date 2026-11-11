import { type FeedMutation } from '@/store/feed/types'

export const STOP_VIDEO: FeedMutation<string> = (state, id) => {
  if (state.activeVideoId === id) {
    state.activeVideoId = null
  }
}
