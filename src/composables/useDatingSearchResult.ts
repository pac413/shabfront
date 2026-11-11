import { NetworkStatus } from '@apollo/client/core'
import { uniqBy } from 'lodash'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { storeKey } from '@/store'
import {
  Gender,
  SearchFor,
  type SearchResultFilters,
  type SearchSelectedParam,
  type SearchSortBy,
} from '@/types'
import {
  DEFAULT_LOCATION_PROXIMITY,
  DEFAULT_ME_PROXIMITY,
  INITIAL_MAX_DATING_AGE,
  INITIAL_MIN_DATING_AGE,
  PreferenceSearchModeKeys,
  PROFILE_LIST_PAGE_SIZE,
} from '@/utils'
import {
  getProfileRows,
  getQueryValueFromPeopleFilterType,
  getSelectedParamsFromSearchOptions,
  initSearchOptionsFromPreference,
  loadSearchOptionsFromRoute,
  loadSortByOptionFromRoute,
} from '@/utils/search'

import {
  type IDatingSearchQueryVariables,
  type IPreferenceFragmentFragment,
  useDatingPreferenceLazyQuery,
  useDatingSearchLazyQuery,
} from './graphql/generated'

const buildBackendSearchQuery = (
  searchOptions: SearchResultFilters,
  offset: number,
  limit: number = PROFILE_LIST_PAGE_SIZE,
): IDatingSearchQueryVariables => {
  /**
   * Remove peopleFilterType because this already exists as type
   */
  const backendQuery: IDatingSearchQueryVariables = {
    // search filters
    filterBy: {
      activeProfilesOnly: Boolean(searchOptions.activeProfilesOnly),
      ageAll: Boolean(searchOptions.ageAll),
      ageRange: Boolean(searchOptions.ageRange),
      cityCoordinate: searchOptions.cityCoordinate as any,
      cityRetrieved: typeof searchOptions.cityRetrieved === 'string' ? searchOptions.cityRetrieved : null,
      filterAgeFrom: Number(searchOptions.filterAgeFrom),
      filterAgeTo: Number(searchOptions.filterAgeTo),
      hasEndorsements: Boolean(searchOptions.hasEndorsements),
      locationAll: Boolean(searchOptions.locationAll),
      locationMe: Boolean(searchOptions.locationMe),
      locationPlace: Boolean(searchOptions.locationPlace),
      menOnly: Boolean(searchOptions.menOnly),
      name: typeof searchOptions.name === 'string' ? searchOptions.name : null,
      picturesOnly: Boolean(searchOptions.picturesOnly),
      proxRadius: typeof searchOptions.proxRadius === 'number' ? searchOptions.proxRadius : null,
      recentMembership: Boolean(searchOptions.recentMembership),
      religionFilterType:
        typeof searchOptions.religionFilterType === 'string' ? searchOptions.religionFilterType : null,
      womenOnly: Boolean(searchOptions.womenOnly),
    },
    // pagination
    offset,
    limit,
  }

  return backendQuery
}

export const useDatingSearchResult = () => {
  const store = useStore(storeKey)
  const route = useRoute()
  const router = useRouter()
  const activeProfile = computed(() => store.state.profile.activeProfile)
  const {
    load: loadDatingPreference,
    onResult: onDatingPreferenceLoaded,
  } = useDatingPreferenceLazyQuery({ fetchPolicy: 'network-only' })
  const defaultSearchOptions = computed(() => {
    // Apply default refinements to the Dating
    return {
      picturesOnly: true,
      recentMembership: true,
      ...(activeProfile.value?.gender === Gender.MALE && { womenOnly: true }),
      ...(activeProfile.value?.gender === Gender.FEMALE && { menOnly: true }),
    }
  })
  const {
    error,
    fetchMore,
    loading,
    load,
    networkStatus,
    result,
    onResult: onSearchResult,
  } = useDatingSearchLazyQuery(buildBackendSearchQuery(defaultSearchOptions.value, 0))
  const profiles = computed(() => result.value?.datingSearch?.profiles || [])
  const profileRows = computed(() => getProfileRows(profiles.value))
  const hasError = computed(() => !!error.value || networkStatus.value === NetworkStatus.error)
  const noResults = computed(() =>
    !loading.value && (
      hasError.value ||
      profiles.value.length === 0
    )
  )

  const offset = ref<number>(0)
  const isAllLoaded = ref<boolean>(false)
  const isInitialized = ref<boolean>(false)
  const sortByOption = ref<SearchSortBy | null>(null)
  const searchOptions = ref<SearchResultFilters>({})
  const preference = ref<IPreferenceFragmentFragment>({})

  onSearchResult((result) => {
    if (result.loading || !result.data?.datingSearch) {
      return
    }
    const loadedProfiles = result.data?.datingSearch.profiles
    if (loadedProfiles.length === 0) {
      isAllLoaded.value = true
    }
    offset.value = profiles.value.length
  })

  onDatingPreferenceLoaded((result) => {
    if (result.loading) {
      return
    }
    preference.value = result.data?.profile?.profile?.datingPreference || {}
    const initialOptions = initSearchOptionsFromPreference(preference.value, defaultSearchOptions.value)
    searchOptions.value = initialOptions.searchOptions
    sortByOption.value = initialOptions.sortByOption
    updateRouteQuery()
  })

  const preparePreferenceToSave = () => {
    let newQuery: { [key: string]: any } = {}
    const oldQuery = { ...route.query }

    PreferenceSearchModeKeys.forEach((key) => {
      if (preference.value[key]) {
        newQuery[key] = preference.value[key]
      }
      if (oldQuery[key]) {
        newQuery[key] = oldQuery[key]
      }
    })
    newQuery = {
      ...newQuery,
      ...searchOptions.value,
    }
    if (sortByOption.value) {
      newQuery.sortBy = sortByOption.value
    }

    if (searchOptions.value.peopleFilterType) {
      newQuery.type = getQueryValueFromPeopleFilterType(searchOptions.value.peopleFilterType)
    }

    for (const key in newQuery) {
      if (!newQuery[key] || key === 'peopleFilterType') {
        delete newQuery[key]
      }
    }

    return newQuery
  }

  const onChangeFilterOptions = async (newValue: Partial<SearchResultFilters>) => {
    Object.entries(newValue).forEach(([key, val]) => {
      /**
       * Convert ageFrom, ageTo into numbers
       */
      switch (key) {
      case 'filterAgeFrom':
      case 'filterAgeTo':
      case 'proxRadius':
        searchOptions.value = {
          ...searchOptions.value,
          [key]: parseInt(val.toString(), 10),
        }
        break
      default:
        searchOptions.value = {
          ...searchOptions.value,
          [key]: val,
        }
        break
      }

      if (val) {
        switch (key) {
        case 'ageAll': {
          const newSearchOptions = {
            ...searchOptions.value,
            ['ageRange']: !val,
          }
          delete newSearchOptions.filterAgeFrom
          delete newSearchOptions.filterAgeTo
          searchOptions.value = newSearchOptions
          break
        }
        case 'ageRange':
          searchOptions.value = {
            ...searchOptions.value,
            ['ageAll']: !val,
            ['filterAgeFrom']: INITIAL_MIN_DATING_AGE,
            ['filterAgeTo']: INITIAL_MAX_DATING_AGE,
          }
          break
        case 'menOnly':
          searchOptions.value = {
            ...searchOptions.value,
            ['womenOnly']: !val,
          }
          break
        case 'womenOnly':
          searchOptions.value = {
            ...searchOptions.value,
            ['menOnly']: !val,
          }
          break

        case 'locationAll':
          searchOptions.value = {
            ...searchOptions.value,
            ['locationMe']: !val,
            ['locationPlace']: !val,
          }
          break

        case 'locationMe':
          searchOptions.value = {
            ...searchOptions.value,
            ['proxRadius']: DEFAULT_ME_PROXIMITY,
            ['locationAll']: !val,
            ['locationPlace']: !val,
          }
          break

        case 'locationPlace':
          searchOptions.value = {
            ...searchOptions.value,
            ['proxRadius']: DEFAULT_LOCATION_PROXIMITY,
            ['locationAll']: !val,
            ['locationMe']: !val,
          }
          break

        default:
          break
        }
      } else {
        // Remove filterAgeFrom, filterAgeTo when ageRange option is unselected
        switch (key) {
        case 'ageRange': {
          const newSearchOptions = { ...searchOptions.value }
          delete newSearchOptions.filterAgeFrom
          delete newSearchOptions.filterAgeTo
          searchOptions.value = newSearchOptions
          break
        }
        case 'locationPlace': {
          const newSearchOptions = { ...searchOptions.value }
          delete newSearchOptions.cityRetrieved
          delete newSearchOptions.cityCoordinate
          delete newSearchOptions.proxRadius
          searchOptions.value = newSearchOptions
          break
        }
        case 'locationMe': {
          const newSearchOptions = { ...searchOptions.value }
          delete newSearchOptions.proxRadius
          searchOptions.value = newSearchOptions
          break
        }

        default:
          break
        }
      }
    })

    await setDatingPreference()

    /**
     * Check if peopleFilterType is changed
     * if yes: url should be updated
     */
    if (newValue.peopleFilterType) {
      const query = { ...route.query }
      switch (newValue.peopleFilterType) {
      case 'All':
        query.type = SearchFor.all
        break
      case 'Host':
        query.type = SearchFor.hosts
        break
      case 'Guest':
        query.type = SearchFor.guests
        break
      case 'Single':
        query.type = SearchFor.single
        break
      default:
        break
      }
      router.push({
        path: route.path,
        query,
      })
    } else {
      updateRouteQuery()
    }
  }

  const updateRouteQuery = async () => {
    const newQuery = preparePreferenceToSave()

    if (newQuery.cityCoordinate) {
      newQuery.cityCoordinate = `${newQuery.cityCoordinate.latitude},${newQuery.cityCoordinate.longitude}`
    }
    if (newQuery.locationAll) {
      delete newQuery.proxRadius
    }
    if (!newQuery.locationPlace) {
      delete newQuery.cityRetrieved
      delete newQuery.cityCoordinate
    }
    try {
      await router.push({ query: newQuery, replace: true })
    } catch(error: unknown) {
      console.error(error)
    }
  }

  const initOptions = () => {
    searchOptions.value = loadSearchOptionsFromRoute({ ...route.query })
    sortByOption.value = loadSortByOptionFromRoute({ ...route.query })

    if (!isInitialized.value && !Object.keys(searchOptions.value).length && !sortByOption.value) {
      loadDatingPreference()
    }
    isInitialized.value = true
  }

  const fetchNewProfiles = async () => {
    if (!isInitialized.value) {
      return
    }
    clearSearchResult()
    await load(undefined, buildBackendSearchQuery(searchOptions.value, offset.value), { fetchPolicy: 'network-only' })
  }

  const fetchMoreProfiles = async () => {
    if (!isInitialized.value || isAllLoaded.value) {
      return
    }
    await fetchMore({
      variables: buildBackendSearchQuery(searchOptions.value, offset.value),
      updateQuery: (
        { datingSearch: previousSearchData },
        { fetchMoreResult },
      ) => {
        const { datingSearch: newSearchData } = fetchMoreResult || {}
        return {
          datingSearch: {
            __typename: 'ProfilesPayload',
            profiles: uniqBy(
              [
                ...previousSearchData?.profiles || [],
                ...newSearchData?.profiles || [],
              ],
              'id'
            )
          }
        }
      },
    })
  }

  const clearSearchResult = () => {
    offset.value = 0
    isAllLoaded.value = false
  }
  const clearPreference = async () => {
    const newSearchOptions: SearchResultFilters = {}
    searchOptions.value = newSearchOptions
    await updateRouteQuery()
    await setDatingPreference()
  }
  const applyDefault = async () => {
    searchOptions.value = defaultSearchOptions.value
    await updateRouteQuery()
    await setDatingPreference()
  }
  const setDatingPreference = async () => {
    const preference = preparePreferenceToSave()
    await store.dispatch('search/setDatingPreference', preference)
  }

  const removeSearchOption = (param: SearchSelectedParam) => {
    if (param.value === 'ageRange') {
      searchOptions.value.ageRange = undefined
      searchOptions.value.filterAgeFrom = undefined
      searchOptions.value.filterAgeTo = undefined
    } else {
      searchOptions.value[param.value as keyof SearchResultFilters] = undefined
    }
    updateRouteQuery()
  }

  const saveSortByOption = async (value: SearchSortBy | null) => {
    // if criteria is not changed
    // do not update search results
    if (JSON.stringify(value) === JSON.stringify(sortByOption.value)) {
      return
    }
    sortByOption.value = value

    clearSearchResult()
    await updateRouteQuery()
  }

  const selectedParams = computed(() => getSelectedParamsFromSearchOptions(searchOptions.value))

  watch(networkStatus, clearSearchResult)
  watch(isInitialized, fetchNewProfiles)
  watch(searchOptions, fetchNewProfiles)

  return {
    applyDefault,
    clearPreference,
    clearSearchResult,
    defaultSearchOptions,
    fetchNewProfiles,
    fetchMoreProfiles,
    initOptions,
    isAllLoaded,
    isInitialized,
    loading,
    loadSearchOptionsFromRoute,
    noResults,
    onChangeFilterOptions,
    preparePreferenceToSave,
    profiles,
    profileRows,
    removeSearchOption,
    saveSortByOption,
    searchOptions,
    selectedParams,
    sortByOption,
    updateRouteQuery,
  }
}
