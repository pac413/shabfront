import gql from 'graphql-tag'

export const ReferenceFragment = gql`
  fragment ReferenceFragment on Reference {
    id
    name
    siteRole

    # Admin / Self information
    phone
    email
    relationship
  }
`
