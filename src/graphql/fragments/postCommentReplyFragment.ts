import gql from 'graphql-tag'

import { MediaFragment } from './mediaFragment'
import { PostLikeFragment } from './postLikeFragment'
import { SimpleProfileFragment } from './simpleProfileFragment'

export const PostCommentReplyFragment = gql`
  fragment PostCommentReplyFragment on PostCommentReply {
    id
    content
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
    date
  }
  ${MediaFragment}
  ${PostLikeFragment}
  ${SimpleProfileFragment}
`
