import { type FeedMutation } from '@/store/feed/types'

export const HIDE_ALL_POSTS_FROM: FeedMutation<string> = (state, profileId) => {
  state.feed = state.feed.filter((post) => post.postedBy !== profileId)
}
