import { NetworkStatus } from '@apollo/client/core'
import { uniqBy } from 'lodash'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { type RouteLocation, useRoute, useRouter } from 'vue-router'

import { useGlobalStore } from '@/stores/global'
import {
  SearchFor,
  type SearchResultFilters,
  type SearchSelectedParam,
  type SearchSortBy,
  type SelectedLanguage,
} from '@/types'
import {
  DEFAULT_LOCATION_PROXIMITY,
  DEFAULT_ME_PROXIMITY,
  INITIAL_MAX_SEARCH_AGE,
  INITIAL_MIN_SEARCH_AGE,
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
  type ILanguage,
  type IPreferenceFragmentFragment,
  IQueryFilterBy,
  ISearchFor,
  type ISearchQueryVariables,
  type ISearchSortBy,
  useSearchLazyQuery,
  useSearchPreferenceLazyQuery,
} from './graphql/generated'

const buildBackendSearchQuery = (
  searchOptions: SearchResultFilters,
  route: RouteLocation,
  selectedLanguage: SelectedLanguage,
  offset: number,
  limit: number = PROFILE_LIST_PAGE_SIZE,
): ISearchQueryVariables => {
  const { type, ...routeQuery } = route.query
  /**
   * Remove peopleFilterType because this already exists as type
   */
  const backendQuery: ISearchQueryVariables = {
    // search filters
    filterBy: {
      activeProfilesOnly: Boolean(searchOptions.activeProfilesOnly),
      ageAll: Boolean(searchOptions.ageAll),
      ageRange: Boolean(searchOptions.ageRange),
      availableForInvites: Boolean(searchOptions.availableForInvites),
      availableToHost: Boolean(searchOptions.availableToHost),
      coordinates: searchOptions.coordinates as any,
      filterAgeFrom: Number(searchOptions.filterAgeFrom),
      filterAgeTo: Number(searchOptions.filterAgeTo),
      firstName: typeof searchOptions.firstName === 'string' ? searchOptions.firstName : null,
      hasEndorsements: Boolean(searchOptions.hasEndorsements),
      lastName: typeof searchOptions.lastName === 'string' ? searchOptions.lastName : null,
      location: typeof searchOptions.location === 'string' ? searchOptions.location : null,
      menOnly: Boolean(searchOptions.menOnly),
      womenOnly: Boolean(searchOptions.womenOnly),
      locationMe: Boolean(searchOptions.locationMe),
      locationPlace: Boolean(searchOptions.locationPlace),
      proxRadius: typeof searchOptions.proxRadius === 'number' ? searchOptions.proxRadius : null,
      occupationId: typeof searchOptions.occupationId === 'string' ? searchOptions.occupationId : null,
      organization: typeof searchOptions.organization === 'string' ? searchOptions.organization : null,
      picturesOnly: Boolean(searchOptions.picturesOnly),
      popular: Boolean(searchOptions.popular),
      recentMembership: Boolean(searchOptions.recentMembership),
      religionFilterType:
        typeof searchOptions.religionFilterType === 'string' ? searchOptions.religionFilterType : null,
    },
    // guided search
    queryBy: IQueryFilterBy.Name,
    searchFor: (type as string as ISearchFor) || ISearchFor.All,
    // pagination
    offset,
    limit,
    // language
    language: selectedLanguage.locale as string as ILanguage,
  }

  if (searchOptions.coordinates) {
    backendQuery.queryBy = IQueryFilterBy.Location
  }

  // occupation
  if (routeQuery.occupation) {
    backendQuery.queryBy = IQueryFilterBy.Occupation
    backendQuery.occupation = routeQuery.occupation as string
  }

  // name
  if (routeQuery.name) {
    backendQuery.queryBy = IQueryFilterBy.Name
    backendQuery.name = routeQuery.name as string
  }

  // sort by
  if (routeQuery.sortBy) {
    backendQuery.sortBy = routeQuery.sortBy as string as ISearchSortBy
  }

  return backendQuery
}

export const useProfileSearchResult = (pagination = false) => {
  const route = useRoute()
  const router = useRouter()
  const { t } = useI18n()
  const globalStore = useGlobalStore()
  const { load: loadSearchPreference, onResult: onSearchPreferenceLoaded } = useSearchPreferenceLazyQuery()
  const defaultSearchOptions = {}
  const {
    error,
    fetchMore,
    loading,
    load,
    networkStatus,
    result,
    onResult: onSearchResult,
  } = useSearchLazyQuery(buildBackendSearchQuery(defaultSearchOptions, route, globalStore.language, 0))

  const profiles = computed(() => result.value?.search?.profiles || [])
  const total = computed(() => result.value?.search?.total || 0)
  const profileRows = computed(() => getProfileRows(profiles.value))
  const hasError = computed(() => !!error.value || networkStatus.value === NetworkStatus.error)
  const noResults = computed(() =>
    !loading.value && (
      hasError.value ||
      profiles.value.length === 0 ||
      total.value === 0
    )
  )
  const isAllLoaded = computed(() => profiles.value.length === total.value)

  const offset = ref<number>(0)
  const isInitialized = ref<boolean>(false)
  const sortByOption = ref<SearchSortBy | null>(null)
  const searchOptions = ref<SearchResultFilters>({})
  const preference = ref<IPreferenceFragmentFragment>({})
  const sizePerPage = ref<number>(10)
  const currentPage = ref<number>(1)

  onSearchPreferenceLoaded((result) => {
    if (result.loading) {
      return
    }
    preference.value = result.data?.profile?.profile?.searchPreference || {}
    const initialOptions = initSearchOptionsFromPreference(preference.value, defaultSearchOptions)
    searchOptions.value = initialOptions.searchOptions
    sortByOption.value = initialOptions.sortByOption
  })

  onSearchResult((result) => {
    if (result.loading || !result.data?.search) {
      return
    }
    offset.value = profiles.value.length
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

  const onChangeFilterOptions = (newValue: Partial<SearchResultFilters>) => {
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
            ['filterAgeFrom']: INITIAL_MIN_SEARCH_AGE,
            ['filterAgeTo']: INITIAL_MAX_SEARCH_AGE,
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

        case 'locationMe':
          searchOptions.value = {
            ...searchOptions.value,
            ['proxRadius']: DEFAULT_ME_PROXIMITY,
            ['locationPlace']: !val,
          }
          break

        case 'locationPlace':
          searchOptions.value = {
            ...searchOptions.value,
            ['proxRadius']: DEFAULT_LOCATION_PROXIMITY,
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
        }
      }
    })

    /**
     * Check if peopleFilterType is changed
     * if yes: url should be updated
     */
    if (newValue.peopleFilterType) {
      const query = { ...route.query }
      switch (newValue.peopleFilterType) {
      case 'All':
        query.type = ISearchFor.All
        break
      case 'Host':
        query.type = ISearchFor.Hosts
        break
      case 'Guest':
        query.type = ISearchFor.Guests
        break
      case 'Single':
        query.type = ISearchFor.Dating
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

  const onSizePerPageChanged = (size: number) => {
    sizePerPage.value = size
    currentPage.value = 1
    clearSearchResult()
    fetchNewProfiles()
  }

  const onPageChanged = (page: number) => {
    currentPage.value = page
    clearSearchResult()
    fetchNewProfiles()
  }

  const updateRouteQuery = async () => {
    const newQuery = preparePreferenceToSave()

    if (newQuery.coordinates) {
      newQuery.coordinates = `${newQuery.coordinates.latitude},${newQuery.coordinates.longitude}`
    }
    if (!newQuery.locationPlace) {
      delete newQuery.coordinates
      delete newQuery.location
    }
    try {
      await router.push({ path: route.path, query: newQuery, replace: true })
    } catch (e: unknown) {
      console.error(e)
    }
  }

  const initOptions = async () => {
    searchOptions.value = loadSearchOptionsFromRoute({ ...route.query })
    sortByOption.value = loadSortByOptionFromRoute({ ...route.query })

    if (!isInitialized.value && Object.keys(searchOptions.value).length === 0 && !sortByOption.value) {
      await loadSearchPreference()
      // update route query with the default options
      await updateRouteQuery()
    }
    isInitialized.value = true
  }

  const fetchNewProfiles = async () => {
    if (!isInitialized.value) {
      return
    }
    await load(undefined, buildBackendSearchQuery(
      searchOptions.value,
      route,
      globalStore.language,
      pagination ? (currentPage.value - 1) * sizePerPage.value : 0,
      pagination ? sizePerPage.value : PROFILE_LIST_PAGE_SIZE
    ), { fetchPolicy: 'network-only' })
  }

  const fetchMoreProfiles = async () => {
    if (!isInitialized.value || isAllLoaded.value) {
      return
    }
    await fetchMore({
      variables: buildBackendSearchQuery(
        searchOptions.value,
        route,
        globalStore.language,
        pagination ? sizePerPage.value * (currentPage.value - 1) : offset.value,
        pagination ? sizePerPage.value : PROFILE_LIST_PAGE_SIZE,
      ),
      updateQuery: (
        { search: previousSearchData },
        { fetchMoreResult },
      ) => {
        const { search: newSearchData } = fetchMoreResult || {}
        return {
          search: {
            __typename: 'SearchPayload',
            total: newSearchData?.total || previousSearchData?.total || 0,
            profiles: uniqBy(
              [
                ...previousSearchData?.profiles || [],
                ...newSearchData?.profiles || [],
              ],
              'id',
            )
          }
        }
      },
    })
  }

  const clearSearchResult = () => {
    if (networkStatus.value !== NetworkStatus.ready && networkStatus.value !== NetworkStatus.fetchMore) {
      offset.value = 0
    }
  }

  const clearPreference = async () => {
    const newSearchOptions: SearchResultFilters = {}

    newSearchOptions.peopleFilterType = 'All'

    if (searchOptions.value.coordinates) {
      newSearchOptions.coordinates = searchOptions.value.coordinates
    }

    searchOptions.value = newSearchOptions
    await updateRouteQuery()
  }
  const applyDefault = async () => {
    searchOptions.value = defaultSearchOptions
    await updateRouteQuery()
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

  // computed value to get search title based on search query params
  const searchTitle = computed(() => {
    let title = `${t('sticky-subheader.search-title').toString()}`
    const { type, recentMembership, name, occupation, location, locationMe, locationPlace } = route.query
    if (name) {
      title = t('advances-search-view.members-with-name-containing', { value: name }).toString()
    } else if (occupation) {
      title = t('advances-search-view.members-with-occupation', { value: occupation }).toString()
    } else if (locationPlace === 'true' && location) {
      title = t('advances-search-view.members-in', { value: location }).toString()
    } else if (locationMe === 'true') {
      const mapping: any = {
        [SearchFor.all]: t('advances-search-view.members-nearby').toString(),
        [SearchFor.guests]: t('advances-search-view.guests-nearby').toString(),
        [SearchFor.hosts]: t('advances-search-view.hosts-nearby').toString(),
        [SearchFor.single]: t('advances-search-view.singles-nearby').toString(),
      }
      title = mapping[type as string]
    } else if (type === SearchFor.guests && recentMembership === 'true') {
      title = t('advances-search-view.recent-guests').toString()
    } else if (type === SearchFor.hosts && recentMembership === 'true') {
      title = t('advances-search-view.recent-hosts').toString()
    }
    return title
  })

  watch(networkStatus, clearSearchResult)
  watch(isInitialized, fetchNewProfiles)
  watch(searchOptions, fetchNewProfiles)
  watch(() => route.query, fetchNewProfiles)
  watch(() => globalStore.language, fetchNewProfiles)

  return {
    applyDefault,
    clearPreference,
    clearSearchResult,
    initOptions,
    isInitialized,
    fetchNewProfiles,
    fetchMoreProfiles,
    loading,
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
    total,
    updateRouteQuery,
    searchTitle,
    sizePerPage,
    currentPage,
    onSizePerPageChanged,
    onPageChanged
  }
}
