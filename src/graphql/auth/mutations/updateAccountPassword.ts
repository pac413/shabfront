import gql from 'graphql-tag'

const updateAccountPassword = gql`
  mutation updateAccountPassword($password: String!) {
    updateAccountPassword(input: { password: $password }) {
      success
      errors {
        message
      }
    }
  }
`

export default updateAccountPassword
