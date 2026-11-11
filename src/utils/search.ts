import { isNil, omitBy } from 'lodash'
import type { RouteLocation } from 'vue-router'

import {
  type IPreferenceFragmentFragment,
  type IProfileFragmentFragment,
  ISearchFor,
} from '@/composables/graphql/generated'
import i18n from '@/plugins/i18n'
import {
  type SearchResultFilters,
  type SearchSelectedParam,
  SearchSortBy,
} from '@/types'

import { PreferenceSearchModeKeys } from './consts'

export const getPeopleFilterType = (
  searchFor?: ISearchFor | string | null
): SearchResultFilters['peopleFilterType'] | undefined => {
  switch (searchFor) {
  case ISearchFor.All:
    return 'All'
  case ISearchFor.Hosts:
    return 'Host'
  case ISearchFor.Guests:
    return 'Guest'
  case ISearchFor.Dating:
    return 'Single'
  default:
    return undefined
  }
}

export const getQueryValueFromPeopleFilterType = (
  peopleFilterType?: SearchResultFilters['peopleFilterType'],
): ISearchFor | undefined => {
  switch (peopleFilterType) {
  case 'All':
    return ISearchFor.All
  case 'Host':
    return ISearchFor.Hosts
  case 'Guest':
    return ISearchFor.Guests
  case 'Single':
    return ISearchFor.Dating
  default:
    return undefined
  }
}

export const getSelectedParamsFromSearchOptions = (searchOptions: SearchResultFilters): SearchSelectedParam[] => {
  const params: SearchSelectedParam[] = []

  for (const option in searchOptions) {
    if (!searchOptions[option as keyof SearchResultFilters]) {
      continue
    }

    switch (option) {
    case 'peopleFilterType': {
      params.push({
        value: option,
        title: i18n.global.t(`filter.people-options.${searchOptions[option]}`).toString(),
      })
      break
    }
    case 'availableForInvites': {
      params.push({
        value: option,
        title: i18n.global.t('filter.available-for-invites').toString(),
      })
      break
    }
    case 'availableToHost': {
      params.push({
        value: option,
        title: i18n.global.t('filter.available-to-host').toString(),
      })
      break
    }
    case 'menOnly': {
      params.push({
        value: option,
        title: i18n.global.t('filter.men-only').toString(),
      })
      break
    }
    case 'womenOnly': {
      params.push({
        value: option,
        title: i18n.global.t('filter.women-only').toString(),
      })
      break
    }
    case 'picturesOnly': {
      params.push({
        value: option,
        title: i18n.global.t('filter.with-pictures-only').toString(),
      })
      break
    }
    case 'recentMembership': {
      params.push({
        value: option,
        title: i18n.global.t('filter.recent-signups').toString(),
      })
      break
    }
    case 'hasEndorsements': {
      params.push({
        value: option,
        title: i18n.global.t('filter.with-endorsements').toString(),
      })
      break
    }
    case 'activeProfilesOnly': {
      params.push({
        value: option,
        title: i18n.global.t('filter.recently-active').toString(),
      })
      break
    }
    case 'religionFilterType': {
      const value: string = searchOptions[option] as string

      params.push({
        value: option,
        title: i18n.global.t(`filter.religious-options.${value.toLowerCase()}`).toString(),
      })
      break
    }
    case 'ageRange': {
      params.push({
        value: option,
        title: `${i18n.global.t('filter.age-range')}: ${searchOptions.filterAgeFrom} - ${searchOptions.filterAgeTo}`,
      })
      break
    }
    }
  }

  return params
}

export const initSearchOptionsFromPreference = (
  preference: IPreferenceFragmentFragment,
  defaultSearchOptions: SearchResultFilters = {},
) => {
  let sortByOption: SearchSortBy | null = null

  if (Object.keys(preference).length === 0) {
    return { searchOptions: defaultSearchOptions, sortByOption }
  }

  /**
   * get sort option from preference
   */
  if (preference.sortBy) {
    const sortBy = preference.sortBy as keyof typeof SearchSortBy
    sortByOption = SearchSortBy[sortBy]
  }

  /**
   * get search option from preference
   */
  const searchOptions: SearchResultFilters = {
    peopleFilterType: getPeopleFilterType(preference.type),
  }

  Object.keys(preference).forEach((key: any) => {
    if (['__typename', 'sortBy'].includes(key) || PreferenceSearchModeKeys.includes(key)) {
      return
    }
    const propKey = key as keyof Omit<IPreferenceFragmentFragment, '__typename' | 'sortBy'>
    if (
      propKey === 'cityCoordinate' &&
      preference.cityCoordinate &&
      preference.cityCoordinate.latitude &&
      preference.cityCoordinate.longitude
    ) {
      searchOptions.cityCoordinate = {
        latitude: preference.cityCoordinate.latitude,
        longitude: preference.cityCoordinate.longitude,
      }
    }
    if (propKey !== 'cityCoordinate' && preference[propKey]) {
      ;(searchOptions as any)[propKey] = preference[propKey]
    }
  })

  return {
    searchOptions,
    sortByOption,
  }
}

export const loadSearchOptionsFromRoute = (query: RouteLocation['query']): SearchResultFilters => {
  const searchOptions: SearchResultFilters = {
    peopleFilterType: typeof query.type === 'string' ? getPeopleFilterType(query.type) : undefined,
  }

  // delete query type, name, occupation and location params
  PreferenceSearchModeKeys.forEach((key) => {
    delete query[key]
  })

  // delete sort by param
  delete query.sortBy

  // convert query into searchOption types
  Object.keys(query).forEach((key) => {
    if (!query[key]) {
      return
    }
    switch (key) {
    case 'religionFilterType':
    case 'cityRetrieved':
      searchOptions[key] = query[key] as any
      break
    case 'filterAgeFrom':
    case 'filterAgeTo':
    case 'proxRadius':
      searchOptions[key] = parseInt(`${query[key]}`, 10)
      break
    case 'coordinates':
    case 'cityCoordinate': {
      const coordinates = `${query[key]}`.split(',')
      searchOptions[key] = {
        latitude: parseFloat(coordinates[0]),
        longitude: parseFloat(coordinates[1]),
      }
      break
    }
    default:
      if (query[key] === 'true') {
        ;(searchOptions as any)[key] = true
      } else if (query[key] === 'false') {
        ;(searchOptions as any)[key] = false
      } else if (query[key]) {
        ;(searchOptions as any)[key] = query[key]
      }
      break
    }
  })

  return omitBy(searchOptions, isNil)
}

export const loadSortByOptionFromRoute = (query: RouteLocation['query']) => {
  if (query.sortBy) {
    const sortBy = query.sortBy as keyof typeof SearchSortBy
    return SearchSortBy[sortBy]
  }
  return null
}

export const getProfileRows = (
  profiles: readonly IProfileFragmentFragment[],
): Array<{ items: readonly IProfileFragmentFragment[]; id: number }> => {
  const chunkSize = window.matchMedia('screen and (max-width: 768px)').matches ? 3 : 5
  const res = []
  for (let i = 0; i < profiles.length; i += chunkSize) {
    const items = profiles.slice(i, i + chunkSize)
    res.push({
      items,
      id: i,
    })
  }
  return res
}
