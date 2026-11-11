import type { FeedMutation } from '@/store/feed/types'

export const TOGGLE_FEED_LIST_ITEM_COMMENTS_HIDDEN: FeedMutation<string> = (state, id) => {
  state.feedListCommentsHidden = {
    ...state.feedListCommentsHidden,
    [id]: !state.feedListCommentsHidden[id],
  }
}
