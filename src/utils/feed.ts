import { type FeedItem, type PostComment, type PostLike, type PostView, type SimpleProfile } from '@/types'

/**
 * Get all profiles from post like input and update like to have profile id instead of profile
 * @param input post like
 * @returns { postLike, profiles }
 */
export const getProfilesFromPostLike = (input: PostLike) => {
  const postLike = { ...input }
  const profiles = []

  if (typeof postLike.likedBy !== 'string') {
    profiles.push(postLike.likedBy)
    postLike.likedBy = postLike.likedBy.id
  }

  return { postLike, profiles }
}

/** Shortcut for getProfilesFromPostLike above - for passing in array of comments */
export const getProfilesFromPostLikes = (likes: PostLike[]) => {
  const profiles: SimpleProfile[] = []

  // Getting profiles from latestComments
  likes = likes.map((postLike) => {
    const { postLike: updatedPostLike, profiles: postCommentProfiles } = getProfilesFromPostLike(postLike)
    profiles.push(...postCommentProfiles)
    return updatedPostLike
  })

  return { likes, profiles }
}

/**
 * Get all profiles from comment reply input and update reply to have profile id instead of profile
 * @param input post comment reply
 * @returns { postCommentReply, profiles }
 */
export const getProfilesFromPostCommentReply = (input: PostComment) => {
  const postCommentReply = { ...input }
  const profiles: SimpleProfile[] = []

  if (typeof postCommentReply.commentedBy !== 'string') {
    profiles.push(postCommentReply.commentedBy)
    postCommentReply.commentedBy = postCommentReply.commentedBy.id
  }

  // Getting profiles from commentLikes
  if (postCommentReply.commentLikes) {
    postCommentReply.commentLikes = postCommentReply.commentLikes.map((postLike: any) => {
      const { postLike: updatedPostLike, profiles: postLikeProfiles } = getProfilesFromPostLike(postLike)
      profiles.push(...postLikeProfiles)
      return updatedPostLike
    })
  }

  return { postCommentReply, profiles }
}

/**
 * Get all profiles from comment input and update comment to have profile id instead of profile
 * @param input post comment
 * @returns { postComment, profiles }
 */
export const getProfilesFromPostComment = (input: PostComment) => {
  const postComment = { ...input }
  const profiles: SimpleProfile[] = []

  const { commentedBy, commentLikes, replies } = postComment
  if (typeof commentedBy !== 'string') {
    profiles.push(commentedBy)
    postComment.commentedBy = commentedBy.id
  }

  // Getting profiles from commentLikes
  if (commentLikes) {
    postComment.commentLikes = commentLikes.map((postLike) => {
      const { postLike: updatedPostLike, profiles: postLikeProfiles } = getProfilesFromPostLike(postLike)
      profiles.push(...postLikeProfiles)
      return updatedPostLike
    })
  }

  // Getting profiles from replies
  if (replies) {
    postComment.replies = replies.map((postCommentReply) => {
      const { postCommentReply: updatedPostCommentReply, profiles: postCommentReplyProfiles } =
        getProfilesFromPostCommentReply(postCommentReply)
      profiles.push(...postCommentReplyProfiles)
      return updatedPostCommentReply
    })
  }

  return { postComment, profiles }
}

/** Shortcut for getProfilesFromPostComment above - for passing in array of comments */
export const getProfilesFromPostComments = (comments: PostComment[]) => {
  const profiles: SimpleProfile[] = []

  // Getting profiles from latestComments
  comments = comments.map((postComment) => {
    const { postComment: updatedPostComment, profiles: postCommentProfiles } = getProfilesFromPostComment(postComment)
    profiles.push(...postCommentProfiles)
    return updatedPostComment
  })

  return { comments, profiles }
}

/**
 * Get all profiles from feed input and update feed to have profile id instead of profile
 * @param input feed
 * @returns { feed, profiles }
 */
export const getProfilesFromFeed = (input: FeedItem): { feed: FeedItem; profiles: SimpleProfile[] } => {
  const feed = { ...input }
  const profiles: SimpleProfile[] = []

  if (typeof feed.postedBy !== 'string') {
    profiles.push(feed.postedBy)
    feed.postedBy = feed.postedBy.id
  }

  // Getting profiles from latestComments
  const { comments: updatedComments, profiles: updatedProfiles } = getProfilesFromPostComments(feed.latestComments)
  feed.latestComments = updatedComments
  profiles.push(...updatedProfiles)

  // Getting profiles from latestLikes
  feed.latestLikes = feed.latestLikes.map((postLike) => {
    const { postLike: updatedPostLike, profiles: postLikeProfiles } = getProfilesFromPostLike(postLike)
    profiles.push(...postLikeProfiles)
    return updatedPostLike
  })

  return { feed, profiles }
}

/**
 * Get all profiles from post view input and update view to have profile id instead of profile
 * @param input post view
 * @returns { postView, profiles }
 */
export const getProfilesFromPostView = (input: PostView) => {
  const postView = { ...input }
  const profiles = []

  if (typeof postView.viewedBy !== 'string') {
    profiles.push(postView.viewedBy)
    postView.viewedBy = postView.viewedBy.id
  }

  return { postView, profiles }
}
