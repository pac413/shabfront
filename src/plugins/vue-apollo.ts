import {
  type ApolloCache,
  ApolloClient,
  ApolloLink,
  type ApolloQueryResult,
  type DefaultContext,
  type FetchResult,
  HttpLink,
  InMemoryCache,
  type MutationOptions,
  type OperationVariables,
  type QueryOptions,
  split,
} from '@apollo/client/core'
import { GraphQLWsLink } from '@apollo/client/link/subscriptions'
import { getMainDefinition } from '@apollo/client/utilities'
import { TokenRefreshLink } from 'apollo-link-token-refresh'
import type { AxiosResponse } from 'axios'
import { createClient } from 'graphql-ws'
import { cloneDeep } from 'lodash'

import { getAccessTokenLifetimeLeft, getLocale, getToken } from '@/utils'
import session from '@/utils/session'

import { updateAccessToken } from './axios'

export const apolloWsClient = createClient({
  url: import.meta.env.VITE_APP_GRAPHQL_WS_API!,
  connectionParams: () => {
    return {
      authToken: getToken(),
      locale: getLocale(),
    }
  },
})

export const triggerReconnectWebsocket = () => {
  try {
    apolloWsClient.terminate()
  } catch {
    return
  }
}

const wsLink = new GraphQLWsLink(apolloWsClient)
const httpLink = new HttpLink({
  // You should use an absolute URL here
  uri: import.meta.env.VITE_APP_GRAPHQL_API,
})

// using the ability to split links, you can send data to each link
// depending on what kind of operation is being sent
const link = split(
  // split based on operation type
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  httpLink,
)

/**
 * If the access token life time left is less than the following value,
 * it will refresh the access token.
 */
const ACCESS_TOKEN_LIFETIME_SPAN = 20

const refreshLink = new TokenRefreshLink({
  accessTokenField: 'accessToken',
  isTokenValidOrUndefined: () => {
    const accessToken = getToken()
    if (!accessToken) {
      return Promise.resolve(true)
    }
    const lifetimeLeft = getAccessTokenLifetimeLeft()
    if (lifetimeLeft < ACCESS_TOKEN_LIFETIME_SPAN) {
      return Promise.resolve(false)
    }
    return Promise.resolve(true)
  },
  fetchAccessToken: () => {
    return updateAccessToken()
  },
  handleResponse: (operation) => (response: AxiosResponse<Record<string, any>>) => {
    if (response.status < 200 || response.status > 299) {
      throw new Error(
        'Response not successful: Received status code ' + response.status
      )
    }
    const { data } = response
    if (!data.accessToken && !data.errors) {
      throw new Error(
        `Server response was missing for query '${operation.operationName}'.`
      )
    }
    return data
  },
  handleFetch: () => {},
  handleError: () => {
    session.logout()
    window.location.href = '/login'
  },
})

const authLink = new ApolloLink((operation, forward) => {
  // Retrieve the authorization token from local storage.
  const token = getToken()
  const language = getLocale()

  // Use the setContext method to set the HTTP headers.
  operation.setContext({
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
      'Accept-Language': language,
    },
    http: {
      includeQuery: true,
    },
  })

  // Call the next link in the middleware chain.
  return forward(operation)
})

const links = ApolloLink.from([refreshLink, authLink, link])

// Create the apollo client
export const apolloClient = new ApolloClient({
  link: links,
  cache: new InMemoryCache(),
  connectToDevTools: !import.meta.env.PROD,
})

export const queryApollo = async <
  T = any,
  TVariables extends OperationVariables = OperationVariables
>(
  options: QueryOptions<TVariables, T>
): Promise<ApolloQueryResult<T>> => {
  const response = await apolloClient.query<T, TVariables>(options)
  return {
    ...response,
    data: response.data ? cloneDeep(response.data) : response.data,
  }
}

export const mutateApollo = async <
  TData = any,
  TVariables extends OperationVariables = OperationVariables,
  TContext extends Record<string, any> = DefaultContext,
  TCache extends ApolloCache<any> = ApolloCache<any>
>(
  options: MutationOptions<TData, TVariables, TContext>
): Promise<FetchResult<TData>> => {
  const response = await apolloClient.mutate<
    TData,
    TVariables,
    TContext,
    TCache
  >(options)
  return {
    ...response,
    data: response.data ? cloneDeep(response.data) : response.data
  } as FetchResult<TData>
}
