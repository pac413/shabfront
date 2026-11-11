import { type FeedMutation } from '@/store/feed/types'

export const RESET_FEED_LIST_ITEM_COMMENTS_HIDDEN: FeedMutation<void> = (state) => {
  state.feedListCommentsHidden = {}
}
