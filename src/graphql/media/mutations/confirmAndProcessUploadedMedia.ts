import gql from 'graphql-tag'

import { MediaFragment } from '@/graphql/fragments/mediaFragment'

export default gql`
  mutation confirmAndProcessUploadedMedia(
    $id: String!
    $filename: String!
    $mediaType: MediaType!
    $mediaSubType: MediaSubType!
    $reference: MediaReferenceInput
    $profileId: ID
    $mimetype: String!
  ) {
    confirmAndProcessUploadedMedia(
      input: {
        id: $id
        filename: $filename
        mediaType: $mediaType
        mediaSubType: $mediaSubType
        reference: $reference
        profileId: $profileId
        mimetype: $mimetype
      }
    ) {
      ...MediaFragment
    }
  }
  ${MediaFragment}
`
