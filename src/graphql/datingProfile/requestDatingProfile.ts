import gql from 'graphql-tag'

const requestDatingProfile = gql`
  mutation requestDatingProfile($requestDatingProfileInput: DatingProfileActionInput!) {
    requestDatingProfile(input: $requestDatingProfileInput) {
      success
      errors {
        message
      }
    }
  }
`

export default requestDatingProfile
