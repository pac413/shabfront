import gql from 'graphql-tag'

const approveReferencesRequest = gql`
  mutation approveReferencesRequest($requestId: ID!) {
    approveReferencesRequest(input: { requestId: $requestId }) {
      errors {
        message
      }
      success
      profile {
        firstName
        lastName
      }
    }
  }
`

export default approveReferencesRequest
