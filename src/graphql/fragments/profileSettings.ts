import gql from 'graphql-tag'

export const SettingsFragment = gql`
  fragment SettingsFragment on ProfileSettings {
    anonymousBrowsing
    commentsByEmail
    commentsByPush
    feedContent
    friendRequestByEmail
    friendRequestByPush
    friendRequestNeeded
    hideAllMedia
    invitesByEmail
    invitesByPush
    likesByEmail
    likesByPush
    messagesByEmail
    messagesByPush
    messagingPrivacy
    newFriendsByEmail
    newFriendsByPush
    paginatedSearchResult
    postPrivacy
    profileViewsByEmail
    profileViewsByPush
    weeklyActivitySummaryEmail
  }
`
