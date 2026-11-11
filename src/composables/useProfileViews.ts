import { NetworkStatus } from '@apollo/client/core'
import { computed, type ComputedRef,ref, watch } from 'vue'

import {
  type IProfileViewsQueryVariables,
  useProfileViewsQuery,
} from '@/composables/graphql/generated'

export const useProfileViews = (
  params: Omit<IProfileViewsQueryVariables, 'offset'> | ComputedRef<Omit<IProfileViewsQueryVariables, 'offset'>>,
  initialPage = 0,
) => {
  const paramsRef = ref<Omit<IProfileViewsQueryVariables, 'offset'>>('value' in params ? params.value : params)
  const pageRef = ref<number>(initialPage || 0)
  const variables = computed(() => ({
    ...paramsRef.value,
    offset: initialPage * paramsRef.value.limit,
  }))
  
  const { error, fetchMore, loading, networkStatus, onResult, refetch, result } = useProfileViewsQuery(
    variables.value,
    {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    }
  )
  const profileViews = computed(() => result.value?.profileViews?.profileViews || [])
  const total = computed(() => result.value?.profileViews?.total || 0)
  const hasError = computed(() => !!error.value || networkStatus.value === NetworkStatus.error)
  const noResults = computed(() =>
    !loading.value && (
      hasError.value ||
      profileViews.value.length === 0 ||
      total.value === 0
    )
  )

  onResult(({ networkStatus, loading }) => {
    if (!loading || (networkStatus !== NetworkStatus.ready && networkStatus !== NetworkStatus.fetchMore)) {
      return
    }
    paramsRef.value = 'value' in params ? params.value : params
  })

  const fetchNewProfileViews = async () => {
    try {
      await refetch({
        ...variables.value,
        offset: initialPage * paramsRef.value.limit,
      })
      paramsRef.value = 'value' in params ? params.value : params
    } catch (e) {
      console.error(e)
    }
  }

  const resetPage = () => {
    if (networkStatus.value !== NetworkStatus.ready && networkStatus.value !== NetworkStatus.fetchMore) {
      pageRef.value = initialPage
      fetchNewProfileViews()
    }
  }

  const fetchMoreProfileViews = async () => {
    await fetchMore({
      variables: {
        ...variables.value,
        offset: (pageRef.value + 1) * paramsRef.value.limit,
      },
      updateQuery: (
        { profileViews: previousData },
        { fetchMoreResult },
      ) => {
        const { profileViews: newData } = fetchMoreResult || {}
        return {
          profileViews: {
            __typename: 'ProfileViewsPayload',
            total: newData?.total || previousData?.total || 0,
            profileViews: [
              ...previousData?.profileViews || [],
              ...newData?.profileViews || [],
            ]
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
    fetchNewProfileViews,
    fetchMoreProfileViews,
    fetchingMore: networkStatus.value === NetworkStatus.fetchMore,
    hasError,
    loading,
    noResults,
    profileViews,
    total,
  }
}
