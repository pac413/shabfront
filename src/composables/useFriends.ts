import { NetworkStatus } from '@apollo/client/core'
import { uniqBy } from 'lodash'
import { computed,type ComputedRef, ref, watch } from 'vue'

import { PROFILE_LIST_PAGE_SIZE } from '@/utils'

import { type IFriendsV2QueryVariables,useFriendsV2Query } from './graphql/generated'

type Params = Omit<IFriendsV2QueryVariables, 'offset'>

export const useFriends = (params: ComputedRef<Params>, initialPage = 0) => {
  const pageRef = ref<number>(initialPage || 0)
  const limit = computed(() => params.value.limit || PROFILE_LIST_PAGE_SIZE)
  const variables = computed(() => ({
    ...params.value,
    offset: initialPage * limit.value,
  }))
  const {
    error,
    fetchMore,
    loading,
    networkStatus,
    refetch,
    result,
  } = useFriendsV2Query(
    variables.value,
    {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    }
  )
  const friends = computed(() => result.value?.friendsV2?.profiles || [])
  const total = computed(() => result.value?.friendsV2?.totalCount || 0)
  const mutualCount = computed(() => result.value?.friendsV2?.mutualCount || 0)
  const hasError = computed(() => !!error.value || networkStatus.value === NetworkStatus.error)
  const noResults = computed(() =>
    !loading.value && (
      hasError.value ||
      friends.value.length === 0 ||
      total.value === 0
    )
  )

  const fetchNewFriends = async () => {
    try {
      await refetch({
        ...variables.value,
        offset: initialPage * limit.value,
      })
    } catch (e) {
      console.error(e)
    }
  }

  const resetPage = () => {
    if (networkStatus.value !== NetworkStatus.ready && networkStatus.value !== NetworkStatus.fetchMore) {
      pageRef.value = initialPage
      fetchNewFriends()
    }
  }

  const fetchMoreFriends = async () => {
    await fetchMore({
      variables: {
        ...variables.value,
        offset: (pageRef.value + 1) * limit.value,
      },
      updateQuery: (
        { friendsV2: previousData },
        { fetchMoreResult },
      ) => {
        const { friendsV2: newData } = fetchMoreResult || {}
        return {
          friendsV2: {
            __typename: 'FriendsV2Payload',
            totalCount: newData?.totalCount || previousData?.totalCount,
            mutualCount: newData?.mutualCount || previousData?.mutualCount,
            profiles: uniqBy(
              [
                ...previousData?.profiles || [],
                ...newData?.profiles || [],
              ],
              'id'
            )
          }
        }
      },
    })
    pageRef.value = pageRef.value + 1
  }

  watch(networkStatus, resetPage)
  watch(() => initialPage, resetPage)
  watch(() => params, resetPage)

  return {
    fetchNewFriends,
    fetchMoreFriends,
    fetchingMore: networkStatus.value === NetworkStatus.fetchMore,
    friends,
    hasError,
    loading,
    mutualCount,
    noResults,
    total,
  }
}
