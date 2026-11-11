import { type IOccupationsQuery, type IOccupationsQueryVariables, OccupationsDocument } from '@/composables/graphql/generated'
import { queryApollo } from '@/plugins/vue-apollo'
import { type ProfileAction } from '@/store/profile/types'
import { useGlobalStore } from '@/stores/global'
import { type Occupation } from '@/types'

export const getOccupations: ProfileAction<IOccupationsQueryVariables, Occupation[]> = async ({
  commit,
}) => {
  const globalStore = useGlobalStore()
  const variables: IOccupationsQueryVariables = {
    language: globalStore.language.locale as any,
  }

  const { data } = await queryApollo<IOccupationsQuery>({
    query: OccupationsDocument,
    variables,
  })
  if (!data.occupations) {
    return []
  }

  commit('SET_OCCUPATIONS', data.occupations)

  return data.occupations as Occupation[]
}
