import gql from 'graphql-tag'

export default gql`
  mutation getMediaUploadUrl(
    $filename: String!
    $mediaType: MediaType!
    $mediaSubType: MediaSubType!
    $mimetype: String!
    $profileId: ID
  ) {
    getMediaUploadUrl(
      input: {
        filename: $filename
        mediaType: $mediaType
        mediaSubType: $mediaSubType
        mimetype: $mimetype
        profileId: $profileId
      }
    ) {
      id
      url
    }
  }
`
