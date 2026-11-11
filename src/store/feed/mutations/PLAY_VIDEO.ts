import { type FeedMutation } from '@/store/feed/types'

export const PLAY_VIDEO: FeedMutation<string> = (state, id) => {
  state.activeVideoId = id
}
