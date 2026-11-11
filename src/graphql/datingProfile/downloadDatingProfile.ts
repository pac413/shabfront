import gql from 'graphql-tag'

const downloadDatingProfile = gql`
  mutation downloadDatingProfile($downloadDatingProfileInput: DatingProfileActionInput!) {
    downloadDatingProfile(input: $downloadDatingProfileInput) {
      success
      data
      errors {
        message
      }
    }
  }
`

export default downloadDatingProfile
