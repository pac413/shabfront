import gql from 'graphql-tag'

import { MediaFragment } from './mediaFragment'
import { PostCommentFragment } from './postCommentFragment'
import { PostLikeFragment } from './postLikeFragment'
import { SimpleProfileFragment } from './simpleProfileFragment'
import { WebScrapedPostFragment } from './webScrapedPostFragment'

export const FeedItemFragment = gql`
  fragment FeedItemFragment on FeedItem {
    id
    content
    postType
    commentsCount
    viewsCount
    likesCount
    likedByProfile
    latestComments {
      ...PostCommentFragment
    }
    latestLikes {
      ...PostLikeFragment
    }
    medias {
      ...MediaFragment
    }
    postedDate
    lastActivityAt
    postedBy {
      ...SimpleProfileFragment
    }
    shared
    readonly
    webScraped {
      ...WebScrapedPostFragment
    }
    privacySetting
  }
  ${MediaFragment}
  ${PostCommentFragment}
  ${PostLikeFragment}
  ${SimpleProfileFragment}
  ${WebScrapedPostFragment}
`
