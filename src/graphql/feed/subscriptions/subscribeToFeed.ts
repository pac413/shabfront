import gql from 'graphql-tag'

import { FeedItemFragment } from '@/graphql/fragments/feedItemFragment'
import { apolloClient } from '@/plugins/vue-apollo'
import { type FeedItem, type FeedSubscriptionEvents, type SubscribeToFeedType } from '@/types'

export const SUBSCRIBE_TO_FEED = gql`
  subscription subscribeToFeed($profileId: ID!, $feedItemIds: [ID]!, $type: SubscribeToFeedType!) {
    subscribeToFeed(input: { profileId: $profileId, feedItemIds: $feedItemIds, type: $type }) {
      feedItem {
        ...FeedItemFragment
      }
      event
    }
  }
  ${FeedItemFragment}
`

type Variables = {
  profileId: string
  feedItemIds: string[]
  type: SubscribeToFeedType
}

type ResponseData = {
  subscribeToFeed: {
    feedItem: FeedItem
    event: FeedSubscriptionEvents
  }
}

export const subscribeToFeed = (variables: Variables) =>
  apolloClient.subscribe<ResponseData>({
    query: SUBSCRIBE_TO_FEED,
    fetchPolicy: 'network-only',
    variables,
  })
