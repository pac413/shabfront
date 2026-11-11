import { NetworkStatus } from '@apollo/client/core'
import { computed, type ComputedRef,ref, watch } from 'vue'

import {
  type ISearchQueryVariables,
  useSearchQuery,
} from '@/composables/graphql/generated'


export const useSearchResult = (
  params: Omit<ISearchQueryVariables, 'offset'> | ComputedRef<Omit<ISearchQueryVariables, 'offset'>>,
  initialPage = 0,
) => {
  const paramsRef = ref<Omit<ISearchQueryVariables, 'offset'>>('value' in params ? params.value : params)
  const pageRef = ref<number>(initialPage || 0)
  const variables = computed(() => ({
    ...paramsRef.value,
    offset: initialPage * paramsRef.value.limit,
  }))
  
  const { error, fetchMore, loading, networkStatus, onResult, refetch, result } = useSearchQuery(
    variables.value,
    {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'cache-first',
      notifyOnNetworkStatusChange: true,
    }
  )
  const profiles = computed(() => result.value?.search?.profiles || [])
  const total = computed(() => result.value?.search?.total || 0)
  const hasError = computed(() => !!error.value || networkStatus.value === NetworkStatus.error)
  const noResults = computed(() =>
    !loading.value && (
      hasError.value ||
      profiles.value.length === 0 ||
      total.value === 0
    )
  )

  onResult(({ networkStatus, loading }) => {
    if (!loading || (networkStatus !== NetworkStatus.ready && networkStatus !== NetworkStatus.fetchMore)) {
      return
    }
    paramsRef.value = 'value' in params ? params.value : params
  })

  const resetPage = () => {
    if (networkStatus.value !== NetworkStatus.ready && networkStatus.value !== NetworkStatus.fetchMore) {
      pageRef.value = initialPage
    }
  }

  const fetchNewProfiles = async () => {
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

  const fetchMoreProfiles = async () => {
    await fetchMore({
      variables: {
        ...variables.value,
        offset: (pageRef.value + 1) * paramsRef.value.limit,
      },
      updateQuery: (
        { search: previousSearchData },
        { fetchMoreResult },
      ) => {
        const { search: newSearchData } = fetchMoreResult || {}
        return {
          search: {
            __typename: 'SearchPayload',
            total: newSearchData?.total || previousSearchData?.total || 0,
            profiles: [
              ...previousSearchData?.profiles || [],
              ...newSearchData?.profiles || [],
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
    fetchNewProfiles,
    fetchMoreProfiles,
    fetchingMore: networkStatus.value === NetworkStatus.fetchMore,
    hasError,
    loading,
    noResults,
    profiles,
    total,
  }
}
