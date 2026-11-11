import gql from 'graphql-tag'

export default gql`
  mutation deleteMedia($id: ID!, $keepOriginal: Boolean) {
    deleteMedia(input: { id: $id, keepOriginal: $keepOriginal }) {
      deleted
    }
  }
`
