import type { IProfileSettings } from '@/composables/graphql/generated'

export type ProfileSettingsState = {
  currentSettings: IProfileSettings | null
}

export const ProfileSettingsMap: { [key: string]: string } = {
  anonymousBrowsing: 'ANONYMOUS_BROWSING',
  friendRequestNeeded: 'FRIEND_REQUEST_NEEDED',
  hideAllMedia: 'HIDE_ALL_MEDIA',
  messagesByEmail: 'MESSAGES_BY_EMAIL',
  messagesByPush: 'MESSAGES_BY_PUSH',
  invitesByEmail: 'INVITES_BY_EMAIL',
  invitesByPush: 'INVITES_BY_PUSH',
  profileViewsByEmail: 'PROFILE_VIEWS_BY_EMAIL',
  profileViewsByPush: 'PROFILE_VIEWS_BY_PUSH',
  newFriendsByEmail: 'NEW_FRIENDS_BY_EMAIL',
  newFriendsByPush: 'NEW_FRIENDS_BY_PUSH',
  likesByEmail: 'LIKES_BY_EMAIL',
  likesByPush: 'LIKES_BY_PUSH',
  commentsByEmail: 'COMMENTS_BY_EMAIL',
  commentsByPush: 'COMMENTS_BY_PUSH',
  friendRequestByEmail: 'FRIEND_REQUEST_BY_EMAIL',
  friendRequestByPush: 'FRIEND_REQUEST_BY_PUSH',
  weeklyActivitySummaryEmail: 'WEEKLY_ACTIVITY_SUMMARY_EMAIL',
  paginatedSearchResult: 'PAGINATED_SEARCH_RESULT',
}
