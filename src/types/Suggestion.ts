export interface Suggestion {
  id: string
  displayName: string
  avatar: {
    medium: string
    large: string
  }
  handle: string
  totals: {
    views: number
    invites: number
  }
}
