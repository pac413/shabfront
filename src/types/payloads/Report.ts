import { type Profile } from './Profile'

export interface Report {
  id: string
  reason: string
  additionalDetails?: string
  reporter: Profile
  reportedUser: Profile
  createdAt: Date
}
