import gql from 'graphql-tag'

const acceptDatingProfileRequest = gql`
  mutation acceptDatingProfileRequest($acceptDatingProfileRequestInput: DatingProfileActionInput!) {
    acceptDatingProfileRequest(input: $acceptDatingProfileRequestInput) {
      success
      data
      errors {
        message
      }
    }
  }
`

export default acceptDatingProfileRequest
