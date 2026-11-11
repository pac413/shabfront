import gql from 'graphql-tag'

import { mutateApollo } from '@/plugins/vue-apollo'

const DELETE_PROFILE_PICTURE = gql`
  mutation deleteProfilePicture($id: ID!, $removePost: Boolean!) {
    deleteProfilePicture(input: { id: $id, removePost: $removePost }) {
      id
    }
  }
`

type Variables = {
  id: string
  removePost: boolean
}

type ResponseData = {
  deleteProfilePicture: {
    id: string
  }
}

export const deleteProfilePicture = (variables: Variables) =>
  mutateApollo<ResponseData>({
    mutation: DELETE_PROFILE_PICTURE,
    variables,
  })
