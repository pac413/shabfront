import { type FeedMutation } from '@/store/feed/types'
import { type PostComment } from '@/types'

import { pushFeedItemComments } from './utils'

type Payload = {
  comments: PostComment[]
  postId: string
  total: number
}

export const PUSH_FEED_ITEM_COMMENTS: FeedMutation<Payload> = (state, payload) => {
  const { comments, postId, total } = payload
  const { currentFeedItem } = state

  if (currentFeedItem && currentFeedItem.id === postId) {
    pushFeedItemComments(currentFeedItem, comments, total)
  }

  const feedItem = state.feed.find((f) => f.id === postId)
  if (!feedItem) {
    return
  }

  pushFeedItemComments(feedItem, comments, total)
}
