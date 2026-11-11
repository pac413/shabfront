import { type Profile } from './Profile'

export type SimpleProfile = Pick<Profile,
  'id' |
  'avatar' |
  'firstName' |
  'lastName' |
  'displayName' |
  'email' |
  'phone' |
  'profileUrl' |
  'handle' |
  'isBlocked' |
  'isBlocking' |
  'isFollowing' |
  'occupation' |
  'uncuratedOccupation' |
  'about' |
  'primaryLocation' |
  'siteRoles'
>
