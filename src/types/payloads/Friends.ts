import { type FriendProfile } from './FriendProfile'

export interface Friends {
  profiles: FriendProfile[]
  mutualCount: number
  totalCount: number
}
