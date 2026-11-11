import { type SimpleProfile } from './SimpleProfile'

export interface PostView {
  id: string
  viewedBy: string | SimpleProfile
  date: string
}
