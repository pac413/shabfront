import type { FriendProfile, SimpleProfile } from './payloads'

export interface GenericRequest {
  requestId: string
  profile: SimpleProfile | FriendProfile
}
