import { setPreference } from '@/graphql/mutations'
import { type SearchAction } from '@/store/search/types'
import { type Preference } from '@/types'

export const setSearchPreference: SearchAction<Preference, void> = async (_, preference) => {
  const variables: Parameters<typeof setPreference>[0] = {
    type: 'search',
    preference,
  }

  const { data } = await setPreference(variables)
  if (!data) {
    throw new Error('Cannot set search preference')
  }
}
