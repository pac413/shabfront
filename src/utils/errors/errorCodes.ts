export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'errors.network-error',
}

export const ERROR_BY_ACTION = {
  // Auth related error codes
  AUTH_LOGIN: 'login-view.login-error-msg',
  AUTH_SIGNUP: 'signup',
  INVALID_TOKEN: 'errors.auth.token-invalid',
  LOGOUT: 'errors.auth.logout-failed',

  // Feature flags related error codes
  LOAD_GLOBAL_FEATURE_FLAGS: 'errors.feature-flags.load-global-failed',
  LOAD_FEATURE_FLAGS: 'errors.feature-flags.load-failed',

  // Profile related error codes
  BLOCK_PROFILE: 'errors.profile.block-profile',
  UNBLOCK_PROFILE: 'errors.profile.unblock-profile',
  REPORT_MEMBER: 'errors.profile.report-member',
  UPDATE_GUEST_PROFILE: 'errors.profile.update-guest-profile',
  UPDATE_HOST_PROFILE: 'errors.profile.update-host-profile',
  UPDATE_PROFILE: 'errors.profile.update-profile',

  // Friend related error codes
  GET_MY_FRIEND_REQUESTS: 'errors.friend.get-my-friend-requests',
  GET_FRIENDS: 'errors.friend.get-friends',
  ADD_FRIEND: 'errors.friend.add-friend',
  APPROVE_FRIEND_REQUEST: 'errors.friend.approve-friend-request',
  CANCEL_FRIEND_REQUEST: 'errors.friend.cancel-friend-request',
  REJECT_FRIEND_REQUEST: 'errors.friend.reject-friend-request',
  REMOVE_MY_FRIEND: 'errors.friend.remove-friend',

  // Follower related error codes
  FOLLOW_PROFILE: 'errors.follower.follow-profile',
  UNFOLLOW_PROFILE: 'errors.follower.unfollow-profile',

  // Feed related error codes
  CREATE_FEED_ITEM: 'errors.feed.create-post',
  CREATE_COMMENT_ON_FEED_ITEM: 'errors.feed.create-comment-on-feed-item',
  CREATE_REPLY_ON_COMMENT: 'errors.feed.create-reply-on-comment',
  CREATE_LIKE_ON_COMMENT: 'errors.feed.create-like-on-comment',
  CREATE_LIKE_ON_COMMENT_REPLY: 'errors.feed.create-like-on-comment-reply',
  CREATE_LIKE_ON_FEED_ITEM: 'errors.feed.create-like-on-feed-item',
  DELETE_COMMENT_ON_FEED_ITEM: 'errors.feed.delete-comment-on-feed-item',
  DELETE_FEED_ITEM: 'errors.feed.delete-feed-item',
  HIDE_POST_FROM_FEED: 'errors.feed.hide-post-from-feed',
  HIDE_ALL_POSTS_FROM: 'errors.feed.hide-all-posts-from',
  DELETE_LIKE_ON_COMMENT: 'errors.feed.delete-like-on-comment',
  DELETE_LIKE_ON_COMMENT_REPLY: 'errors.feed.delete-like-on-comment-reply',
  DELETE_LIKE_ON_FEED_ITEM: 'errors.feed.delete-like-on-feed-item',
  DELETE_REPLY_ON_COMMENT: 'errors.feed.delete-reply-on-comment',
  LOAD_WEBSCRAPED_PREVIEW: 'errors.feed.load-webscraped-preview',
  LOAD_FEED_ITEM_BY_ID: 'errors.feed.load-feed-item-by-id',
  LOAD_FEED_ITEM_COMMENTS: 'errors.feed.load-feed-item-comments',
  LOAD_FEED_ITEM_LIKES: 'errors.feed.load-feed-item-likes',
  LOAD_FEED_ITEMS_BY_PROFILE_ID: 'errors.feed.load-feed-items-by-profile-id',
  LOAD_PROFILE_FEED_ITEMS: 'errors.feed.load-profile-feed-items',
  SUBSCRIBE_TO_FEED: 'errors.feed.subscribe-to-feed',
  SUBSCRIBE_TO_FEED_ITEM: 'errors.feed.subscribe-to-feed-item',
  SUBSCRIBE_TO_NEW_FEED_COUNT: 'errors.feed.subscribe-to-new-feed-count',
  UPDATE_FEED_ITEM: 'errors.feed.update-feed-item',
  GET_AVATAR_UPDATED_FEED_ITEM: 'errors.feed.get-avatar-updated-feed-item',
  GET_COMMENT_BY_ID: 'errors.feed.get-comment-by-id',
  GET_COMMENT_REPLY_BY_ID: 'errors.feed.get-comment-reply-by-id',
  CREATE_SHARED_FEED_ITEM: 'errors.feed.create-shared-feed-item',

  // Endorsement related error codes
  GET_ENDORSEMENTS: 'errors.endorsements.load-endorsements',
}
