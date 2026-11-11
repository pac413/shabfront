import gql from 'graphql-tag'

export const OccupationFragment = gql`
  fragment OccupationFragment on Occupation {
    id
    name
  }
`
