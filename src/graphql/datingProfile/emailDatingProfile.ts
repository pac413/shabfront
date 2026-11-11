import gql from 'graphql-tag'

const emailDatingProfile = gql`
  mutation emailDatingProfile($emailDatingProfileInput: DatingProfileActionInput!) {
    emailDatingProfile(input: $emailDatingProfileInput) {
      success
      errors {
        message
      }
    }
  }
`

export default emailDatingProfile
