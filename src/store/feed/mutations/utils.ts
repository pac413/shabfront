import orderBy from 'lodash/orderBy'

import { type FeedItem, type PostComment } from '@/types'

/**
 * Pushes new comments into the FeedItem's latestComments
 */
export const pushFeedItemComment = (feedItem: FeedItem, comment: PostComment) => {
  const idx = feedItem.latestComments.findIndex((c) => c.id === comment.id)
  if (idx < 0) {
    const newComments = feedItem.latestComments.concat(comment)
    feedItem.latestComments = orderBy(newComments, ['date'], ['desc'])
    feedItem.commentsCount++
  } else {
    const existingCommentItem = feedItem.latestComments[idx]
    const { processingMediaId } = existingCommentItem
    const newCommentItem = { ...comment }
    if (processingMediaId) {
      newCommentItem.processingMediaId = undefined
    }
    feedItem.latestComments = feedItem.latestComments.map((c, i) => {
      if (i === idx) {
        return { ...newCommentItem }
      } else {
        return c
      }
    })
  }
}

export const pushFeedItemComments = (feedItem: FeedItem, comments: PostComment[], count: number) => {
  const newCommentIds = comments.map((c) => c.id)
  const newComments = feedItem.latestComments.filter((c) => !newCommentIds.includes(c.id)).concat(comments)
  feedItem.latestComments = orderBy(newComments, ['date'], ['desc'])
  feedItem.commentsCount = count
}
