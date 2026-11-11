import gql from 'graphql-tag'

import { MediaFragment } from './mediaFragment'
import { PostCommentReplyFragment } from './postCommentReplyFragment'
import { PostLikeFragment } from './postLikeFragment'
import { SimpleProfileFragment } from './simpleProfileFragment'
import { WebScrapedBasicFragment } from './webScrapedBasicFragment'

export const PostCommentFragment = gql`
  fragment PostCommentFragment on PostComment {
    id
    content
    webScraped {
      ...WebScrapedBasicFragment
    }
    commentedBy {
      ...SimpleProfileFragment
    }
    commentLikes {
      ...PostLikeFragment
    }
    commentLikesCount
    medias {
      ...MediaFragment
    }
    replies {
      ...PostCommentReplyFragment
    }
    repliesCount
    date
  }
  ${MediaFragment}
  ${PostCommentReplyFragment}
  ${PostLikeFragment}
  ${SimpleProfileFragment}
  ${WebScrapedBasicFragment}
`
