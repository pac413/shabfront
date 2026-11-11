export type LocationInput = {
  address?: string
  city?: string
  state?: string
  zipcode?: string
  country?: string
  geoLocation?: {
    coordinates: [number, number]
  }
}
