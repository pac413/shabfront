import { NetworkStatus } from '@apollo/client/core'
import { uniqBy } from 'lodash'
import { computed,type ComputedRef, ref, watch } from 'vue'

import { PROFILE_LIST_PAGE_SIZE } from '@/utils'

import { type IFollowingsV2QueryVariables,useFollowingsV2Query } from './graphql/generated'

type Params = Omit<IFollowingsV2QueryVariables, 'offset'>

export const useFollowings = (params: ComputedRef<Params>, initialPage = 0) => {
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
  } = useFollowingsV2Query(
    variables.value,
    {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    }
  )
  const followings = computed(() => result.value?.followingsV2?.profiles || [])
  const total = computed(() => result.value?.followingsV2?.total || 0)
  const hasError = computed(() => !!error.value || networkStatus.value === NetworkStatus.error)
  const noResults = computed(() =>
    !loading.value && (
      hasError.value ||
      followings.value.length === 0 ||
      total.value === 0
    )
  )

  const fetchNewFollowings = async () => {
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
      fetchNewFollowings()
    }
  }

  const fetchMoreFollowings = async () => {
    await fetchMore({
      variables: {
        ...variables.value,
        offset: (pageRef.value + 1) * limit.value,
      },
      updateQuery: (
        { followingsV2: previousData },
        { fetchMoreResult },
      ) => {
        const { followingsV2: newData } = fetchMoreResult || {}
        return {
          followingsV2: {
            __typename: 'FollowingsV2Payload',
            total: newData?.total || previousData?.total || 0,
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
    fetchNewFollowings,
    fetchMoreFollowings,
    fetchingMore: networkStatus.value === NetworkStatus.fetchMore,
    followings,
    hasError,
    loading,
    noResults,
    total,
  }
}
