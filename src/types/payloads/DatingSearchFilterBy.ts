export type DatingSearchFilterBy = {
  name?: string
  ageAll?: boolean
  ageRange?: boolean
  filterAgeFrom?: number
  filterAgeTo?: number
  religionFilterType?: string
  locationAll?: boolean
  locationMe?: boolean
  locationPlace?: boolean
  cityRetrieved?: string
  cityCoordinate?: {
    latitude?: number
    longitude?: number
  }
  proxRadius?: number
  activeProfilesOnly?: boolean
  picturesOnly?: boolean
  menOnly?: boolean
  womenOnly?: boolean
}
