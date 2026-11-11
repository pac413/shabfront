import { type ReligiousAffiliation, type SearchSortBy } from './payloads'

export type SearchResultFilters = {
  // people
  peopleFilterType?: 'All' | 'Host' | 'Guest' | 'Single'
  // invite
  availableToHost?: boolean
  availableForInvites?: boolean
  // ages
  ageAll?: boolean
  ageRange?: boolean
  filterAgeFrom?: number
  filterAgeTo?: number
  // options
  activeProfilesOnly?: boolean
  picturesOnly?: boolean
  menOnly?: boolean
  womenOnly?: boolean
  popular?: boolean
  recentMembership?: boolean
  hasEndorsements?: boolean
  // religious affiliation
  religionFilterType?: 'ALL' | 'NON-ORTHODOX' | ReligiousAffiliation
  // location
  locationAll?: boolean
  locationMe?: boolean
  locationPlace?: boolean
  currentCoordinate?: boolean
  cityRetrieved?: string
  cityCoordinate?: {
    latitude: number
    longitude: number
  }
  proxRadius?: number
  coordinates?: {
    latitude: number
    longitude: number
  }
  // basic info
  name?: string
  firstName?: string
  lastName?: string
  location?: string
  occupationId?: string
  organization?: string
}

export interface SearchResults {
  fetchProfiles: () => Promise<void>

  getSearchOptions: () => SearchResultFilters

  getSortByOption: () => SearchSortBy | null

  getSearchOptionsFromPreference: () => Promise<void>

  updateRouteQuery: () => Promise<void>
}

export type SearchSelectedParam = {
  value?: SearchResultFilters[keyof SearchResultFilters]
  title: string
}
