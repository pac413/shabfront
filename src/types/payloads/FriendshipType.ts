import { type FriendshipStatus } from './enums'

export interface FriendshipType {
  status: FriendshipStatus
  id: string
  requester?: string
}
