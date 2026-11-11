import { type TypedAction, type TypedMutation } from '@/store/types'

export interface SearchState {
  profilesSelection: { [key: string]: boolean }
}

export type SearchAction<T, R = any> = TypedAction<SearchState, T, R>
export type SearchMutation<P = any> = TypedMutation<SearchState, P>
