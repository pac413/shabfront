import gql from 'graphql-tag'

const deleteReference = gql`
  mutation deleteReference($id: ID!) {
    deleteReference(input: { id: $id }) {
      errors {
        message
      }
      deleted
    }
  }
`

export default deleteReference
