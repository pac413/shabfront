import gql from 'graphql-tag'

import { ReferenceFragment } from '@/graphql/fragments/referenceFragment'

const updateReference = gql`
  mutation updateReference(
    $id: ID!
    $name: String!
    $phone: String
    $email: String
    $relationship: [ReferenceRelationship]
    $siteRole: SiteRole!
  ) {
    updateReference(
      input: { id: $id, name: $name, phone: $phone, email: $email, relationship: $relationship, siteRole: $siteRole }
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

export default updateReference
