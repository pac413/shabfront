import gql from 'graphql-tag'

export const LocationFragment = gql`
  fragment LocationFragment on Location {
    address
    city
    state
    zipcode
    country
    geoLocation {
      coordinates
    }
    timeZone
  }
`
