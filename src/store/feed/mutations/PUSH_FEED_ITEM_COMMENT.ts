import { type FeedMutation } from '@/store/feed/types'
import { type PostComment } from '@/types'

import { pushFeedItemComment } from './utils'

type Payload = {
  comment: PostComment
  postId: string
}

export const PUSH_FEED_ITEM_COMMENT: FeedMutation<Payload> = (state, payload) => {
  const { comment, postId } = payload
  const { currentFeedItem } = state

  if (currentFeedItem && currentFeedItem.id === postId) {
    pushFeedItemComment(currentFeedItem, comment)
  }

  const feedItem = state.feed.find((f) => f.id === postId)
  if (!feedItem) {
    return
  }

  pushFeedItemComment(feedItem, comment)
}
