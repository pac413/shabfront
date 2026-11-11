import { getInitialState as getInitialAuthState } from './auth/state'
import { getInitialState as getInitialConnectionsState } from './connections/state'
import { getInitialState as getInitialFeedState } from './feed/state'
import { getInitialState as getInitialInviteState } from './invites/state'
import { getInitialState as getInitialMediaState } from './media/state'
import { getInitialState as getInitialMessageState } from './message/state'
import { getInitialState as getInitialNotificationState } from './notification/state'
import { getInitialState as getInitialPlannerState } from './planner/state'
import { getInitialState as getInitialProfileState } from './profile/state'
import { getInitialState as getInitialProfileSettingsState } from './profileSettings/state'
import { getInitialState as getInitialSearchState } from './search/state'
import { type RootState } from './types'

const initialState: RootState = {
  auth: getInitialAuthState(),
  connections: getInitialConnectionsState(),
  feed: getInitialFeedState(),
  invites: getInitialInviteState(),
  media: getInitialMediaState(),
  message: getInitialMessageState(),
  notification: getInitialNotificationState(),
  planner: getInitialPlannerState(),
  profile: getInitialProfileState(),
  profileSettings: getInitialProfileSettingsState(),
  search: getInitialSearchState(),
}

export default initialState
