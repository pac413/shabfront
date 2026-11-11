import gql from 'graphql-tag'

export default gql`
  mutation updateMedia($input: UpdateMediaInput!) {
    updateMedia(input: $input) {
      errors {
        message
      }
      media {
        id
      }
    }
  }
`
