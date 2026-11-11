import gql from 'graphql-tag'

import { ReferenceFragment } from '@/graphql/fragments/referenceFragment'

const addReference = gql`
  mutation addReference(
    $name: String!
    $phone: String
    $email: String
    $relationship: [ReferenceRelationship]
    $siteRole: SiteRole!
    $profileId: ID
  ) {
    addReference(
      input: {
        name: $name
        phone: $phone
        email: $email
        relationship: $relationship
        siteRole: $siteRole
        profileId: $profileId
      }
    ) {
      errors {
        message
      }
      reference {
        ...ReferenceFragment
      }
    }
  }
  ${ReferenceFragment}
`

export default addReference
