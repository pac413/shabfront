import { deleteProfilePicture as mutate } from '@/graphql/mutations'
import { type ProfileAction } from '@/store/profile/types'

export type Params = {
  id: string
  removePost: boolean
}

export const deleteProfilePicture: ProfileAction<Params, { id: string } | null> = async (
  { commit },
  { id, removePost },
) => {
  const { data } = await mutate({ id, removePost })
  if (!data) {
    return null
  }

  commit('REMOVE_ACTIVE_PROFILE_PICTURE', data.deleteProfilePicture.id)
  return { id }
}
