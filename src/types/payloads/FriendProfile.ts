import { type Profile } from './Profile'

export type FriendProfile = Pick<Profile,
    'id' |
    'avatar' |
    'firstName' |
    'lastName' |
    'displayName' |
    'profileUrl' |
    'handle' |
    'isBlocked' |
    'isBlocking' |
    'isFollowing' |
    'uncuratedOccupation' |
    'about' |
    'friendship'
  >
