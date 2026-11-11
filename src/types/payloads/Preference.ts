import { type Coordinate } from './Coordinate'

export interface Preference {
  mode?: string
  type?: 'hosts' | 'guests' | 'singles' | 'dating' | 'all'
  name?: string
  firstName?: string
  lastName?: string
  city?: string
  state?: string
  country?: string
  availableToHost?: boolean
  availableForInvites?: boolean
  ageAll?: boolean
  ageRange?: boolean
  filterAgeFrom?: number
  filterAgeTo?: number
  activeProfilesOnly?: boolean
  picturesOnly?: boolean
  menOnly?: boolean
  womenOnly?: boolean
  popular?: boolean
  recentMembership?: boolean
  religionFilterType?: string
  locationAll?: boolean
  locationMe?: boolean
  proxRadius?: number
  locationPlace?: boolean
  cityRetrieved?: string
  cityCoordinate?: Coordinate
  occupation?: string
  occupationId?: string
  organization?: string
  role?: string
  coordinates?: Coordinate
  location?: string
  sortBy?:
    | 'dateActive'
    | 'firstNameAsc'
    | 'firstNameDesc'
    | 'lastNameAsc'
    | 'lastNameDesc'
    | 'proximity'
    | 'mostInvites'
}
