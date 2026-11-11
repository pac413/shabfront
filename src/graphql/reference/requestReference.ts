import gql from 'graphql-tag'

const requestReference = gql`
  mutation requestReference($input: RequestReferenceInput!) {
    requestReference(input: $input) {
      errors {
        message
      }
      requested
    }
  }
`

export default requestReference
