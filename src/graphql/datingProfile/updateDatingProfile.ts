import gql from 'graphql-tag'

import { DatingFragment } from '@/graphql/fragments/datingFragment'

const updateDatingProfile = gql`
  mutation updateDatingProfile($updateDatingProfileInput: UpdateDatingProfileInput!) {
    updateDatingProfile(input: $updateDatingProfileInput) {
      errors {
        message
      }
      datingProfile {
        ...DatingFragment
      }
    }
  }
  ${DatingFragment}
`

export default updateDatingProfile
