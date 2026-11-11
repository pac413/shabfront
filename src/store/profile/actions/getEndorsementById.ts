import { EndorsementByIdDocument, type IEndorsement, type IEndorsementByIdQuery } from '@/composables/graphql/generated'
import {} from '@/graphql/queries'
import { queryApollo } from '@/plugins/vue-apollo'
import { type ProfileErrorAction } from '@/store/profile/types'

export type GetEndorsementAction = ProfileErrorAction<void, IEndorsement | null>

export const getEndorsementById: GetEndorsementAction = async (_, endorsementId) => {
  const { data } = await queryApollo<IEndorsementByIdQuery>({
    query: EndorsementByIdDocument,
    variables: {
      id: endorsementId,
    },
  })

  return { data: data.endorsement.endorsement || null }
}
