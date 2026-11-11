import gql from 'graphql-tag'

const updateAccountEmail = gql`
  mutation updateAccountEmail($email: String!) {
    updateAccountEmail(input: { email: $email }) {
      success
      errors {
        message
      }
    }
  }
`

export default updateAccountEmail
