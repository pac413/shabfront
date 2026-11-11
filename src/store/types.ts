import type { ActionContext, StoreOptions } from 'vuex'

import type { ParsedError } from '@/utils/errors'

import type { AuthState } from './auth/types'
import type { ConnectionsState } from './connections/types'
import type { FeedState } from './feed/types'
import type { InviteState } from './invites/types'
import type { MediaState } from './media/types'
import type { MessageState } from './message/types'
import type { NotificationState } from './notification/types'
import type { PlannerState } from './planner/types'
import type { ProfileState } from './profile/types'
import type { ProfileSettingsState } from './profileSettings/types'
import type { SearchState } from './search/types'

export enum LoadingStatus {
  Unloaded,
  Loading,
  Loaded,
}

export interface RootState {
  auth: AuthState
  connections: ConnectionsState
  feed: FeedState
  invites: InviteState
  media: MediaState
  message: MessageState
  notification: NotificationState
  profile: ProfileState
  profileSettings: ProfileSettingsState
  planner: PlannerState
  search: SearchState
}

export type Store = StoreOptions<RootState>

export type TypedAction<S, P, T = any> = (
  this: Store,
  injectee: ActionContext<S, RootState>,
  payload: P,
) => T | Promise<T>
export type TypedErrorAction<S, P, R = any> = (
  this: Store,
  injectee: ActionContext<S, RootState>,
  payload: P,
) => Promise<{ data: R } | ParsedError>

export type TypedMutation<S, P = any> = (state: S, payload: P) => void

export type StoreActionPayload<T extends TypedAction<any, any, any>> = Parameters<T>[1]

export type StoreActionResponse<Action extends TypedAction<any, any, any>> = Action extends TypedAction<
  any,
  any,
  infer Response
>
  ? Response
  : never
