import orderBy from 'lodash/orderBy'

import type { FeedMutation } from '@/store/feed/types'
import type { FeedItem, PostComment } from '@/types'

export const PUSH_FEED_ITEM: FeedMutation<FeedItem> = (state, feedItem) => {
  if (feedItem.editableFeedId) {
    const index = state.feed.findIndex((f) => f.id === feedItem.editableFeedId)
    if (index > -1) {
      state.feed.splice(index, 1)
    }
  }

  const idx = state.feed.findIndex((f) => f.id === feedItem.id)
  if (idx < 0) {
    state.feed.unshift(feedItem)
    state.feed = orderBy(state.feed, ['postedDate'], ['desc'])
  } else {
    // TODO: We support one attachment file for now.
    const existingFeedItem = state.feed[idx]
    const { attachmentMediaId, processingMediaId } = existingFeedItem
    const newFeedItem = { ...feedItem }
    if (processingMediaId) {
      newFeedItem.processingMediaId = undefined
    }
    if (attachmentMediaId) {
      const index = feedItem.medias.findIndex((media) => media.id === attachmentMediaId)
      if (index > -1) {
        newFeedItem.attachmentMediaId = undefined
      } else {
        newFeedItem.attachmentMediaId = attachmentMediaId
      }
    }

    const countReplies = (comments: PostComment[]) => {
      return comments.reduce((total, comment) => {
        return total + (comment.replies?.length || 0)
      }, 0)
    }

    if (
      existingFeedItem.latestComments.length > newFeedItem.latestComments.length ||
      countReplies(existingFeedItem.latestComments) > countReplies(newFeedItem.latestComments)
    ) {
      newFeedItem.latestComments = existingFeedItem.latestComments
    }

    state.feed[idx] = newFeedItem
  }
}
