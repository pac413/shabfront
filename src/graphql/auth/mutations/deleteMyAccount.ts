import gql from 'graphql-tag'

const deleteMyAccount = gql`
  mutation deleteMyAccount($note: String, $reason: UserAccountDeleteReason) {
    deleteMyAccount(input: { note: $note, reason: $reason }) {
      success
      errors {
        message
      }
    }
  }
`

export default deleteMyAccount
