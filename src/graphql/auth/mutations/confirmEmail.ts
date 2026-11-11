import gql from 'graphql-tag'

const confirmEmail = gql`
  mutation confirmEmail($token: String!) {
    confirmEmail(input: { token: $token }) {
      success
    }
  }
`

export default confirmEmail
