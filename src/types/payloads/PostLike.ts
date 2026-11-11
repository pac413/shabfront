import { type SimpleProfile } from './SimpleProfile'

export interface PostLike {
  id: string
  likedBy: string | SimpleProfile
  date: string
}
