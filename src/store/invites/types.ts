import { type IEndorsementFragmentFragment } from '@/composables/graphql/generated'
import { type TypedAction, type TypedMutation } from '@/store/types'
import { type InviteDetail, type Reference } from '@/types'

export interface InviteState {
  selectedDate: string
  currentInvite?: InviteDetail
  subjectEndorsements: IEndorsementFragmentFragment[]
  subjectReferences: Reference[]
}

export type InvitesAction<T, R = any> = TypedAction<InviteState, T, R>
export type InvitesMutation<P = any> = TypedMutation<InviteState, P>
