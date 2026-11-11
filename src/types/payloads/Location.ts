export interface Location {
  city: string
  state: string
  country: string

  address: string | null
  zipcode: string | null
  geoLocation: {
    coordinates: number[]
  } | null
  timeZone?: number | null
}
