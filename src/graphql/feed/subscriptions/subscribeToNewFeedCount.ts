import gql from 'graphql-tag'

import { apolloClient } from '@/plugins/vue-apollo'

const SUBSCRIBE_TO_NEW_FEED_COUNT = gql`
  subscription subscribeToNewFeedCount($lastFeedItemDate: DateTime!) {
    subscribeToNewFeedCount(input: { lastFeedItemDate: $lastFeedItemDate }) {
      count
      total
    }
  }
`

type Variables = {
  lastFeedItemDate: string
}

type ResponseData = {
  subscribeToNewFeedCount: {
    count: number
    total: number
  }
}

export const subscribeToNewFeedCount = (variables: Variables) =>
  apolloClient.subscribe<ResponseData>({
    query: SUBSCRIBE_TO_NEW_FEED_COUNT,
    fetchPolicy: 'network-only',
    variables,
  })
