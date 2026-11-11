import { IFeedContentSetting, IMessagingPrivacyTier, IPostPrivacySetting } from '@/composables/graphql/generated'
import { type ProfileSettingsGroup } from '@/types'

export const privacyGroup: ProfileSettingsGroup = {
  id: 'privacy',
  icon: ['far', 'shield-check'],
  items: [
    {
      id: 'anonymousBrowsing',
      type: 'switch',
      desc: 'anonymous-browsing',
    },
    {
      id: 'friendRequestNeeded',
      type: 'switch',
      desc: 'friending',
    },
    {
      id: 'hideAllMedia',
      type: 'switch',
      desc: 'hide-all-media',
    },
    {
      id: 'messagingPrivacy',
      type: 'radio-group',
      options: [IMessagingPrivacyTier.ConnectionsOthersRequest, IMessagingPrivacyTier.SiteMembers],
    },
    {
      id: 'postPrivacy',
      type: 'radio-group',
      options: [IPostPrivacySetting.All, IPostPrivacySetting.Connections, IPostPrivacySetting.Friends],
      desc: 'connections',
    },
  ],
}

export const notificationsGroup: ProfileSettingsGroup & { groups: ProfileSettingsGroup[] } = {
  id: 'notifications',
  icon: ['far', 'bell'],
  groups: [
    {
      id: 'notification-messages',
      icon: ['far', 'paper-plane'],
      items: [
        {
          id: 'messagesByEmail',
          type: 'switch',
        },
        {
          id: 'messagesByPush',
          type: 'switch',
        },
      ],
    },
    {
      id: 'notification-invites',
      icon: 'wine-glass',
      items: [
        {
          id: 'invitesByEmail',
          type: 'switch',
        },
        {
          id: 'invitesByPush',
          type: 'switch',
        },
      ],
    },
    {
      id: 'notification-profile-views',
      icon: 'eye',
      items: [
        {
          id: 'profileViewsByEmail',
          type: 'switch',
        },
        {
          id: 'profileViewsByPush',
          type: 'switch',
        },
      ],
    },
    {
      id: 'notification-friend-requests',
      icon: 'users',
      items: [
        {
          id: 'newFriendsByEmail',
          type: 'switch',
        },
        {
          id: 'newFriendsByPush',
          type: 'switch',
        },
      ],
    },
    {
      id: 'notification-likes',
      icon: 'fas-thumbs-up',
      items: [
        {
          id: 'likesByEmail',
          type: 'switch',
        },
        {
          id: 'likesByPush',
          type: 'switch',
        },
      ],
    },
    {
      id: 'notification-comments',
      icon: 'comments',
      items: [
        {
          id: 'commentsByEmail',
          type: 'switch',
        },
        {
          id: 'commentsByPush',
          type: 'switch',
        },
      ],
    },
    {
      id: 'notification-weekly',
      icon: 'calendar-week',
      items: [
        // {
        //   id: 'weeklyActivitySummaryEmail',
        //   type: 'switch'
        // }
      ],
    },
  ],
}

export const datingGroup: ProfileSettingsGroup = {
  id: 'dating',
  icon: ['fal', 'heart'],
  link: {
    route: { name: 'Edit Dating Profile' },
    text: 'edit-dating-profile',
  },
  items: [
    {
      id: 'availableForDating',
      type: 'switch',
    },
    {
      id: 'privateDatingProfile',
      type: 'switch',
    },
  ],
}

export const blockingGroup: ProfileSettingsGroup = {
  id: 'blocking',
  icon: ['fal', 'ban'],
  items: [
    {
      id: 'view-blocking',
      type: 'button',
    },
  ],
}

export const shabbatGroup: ProfileSettingsGroup = {
  id: 'shabbat-settings',
  icon: ['far', 'door-open'],
  items: [
    {
      id: 'availableAsGuest',
      type: 'switch',
      link: {
        route: { name: 'edit.guest-preferences' },
        text: 'more',
      },
    },
    {
      id: 'availableAsHost',
      type: 'switch',
      link: {
        route: { name: 'edit.host-preferences' },
        text: 'more',
      },
    },
  ],
}

export const feedContentGroup: ProfileSettingsGroup = {
  id: 'feed',
  icon: ['far', 'rss'],
  items: [
    {
      id: 'feedContent',
      type: 'radio-group',
      options: [
        IFeedContentSetting.Public,
        // 'Recommended',
        IFeedContentSetting.Connections,
        IFeedContentSetting.Trending,
      ],
    },
  ],
}

export const adminFeedContentGroup: ProfileSettingsGroup = {
  id: 'feed',
  icon: ['far', 'rss'],
  items: [
    {
      id: 'feedContent',
      type: 'radio-group',
      options: [
        IFeedContentSetting.Public,
        IFeedContentSetting.Connections,
        IFeedContentSetting.Trending,
        IFeedContentSetting.All
      ],
    },
  ],
}

export const searchingGroup: ProfileSettingsGroup = {
  id: 'searching',
  icon: ['fal', 'search'],
  items: [
    {
      id: 'paginatedSearchResult',
      type: 'switch',
      desc: 'paginated-search-result',
    },
  ],
}
