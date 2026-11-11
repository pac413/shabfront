import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { type RouteLocationRaw, useRoute } from 'vue-router'
import { useStore } from 'vuex'

import { IHostingType, useAcceptHostingMutation, useDeclineHostingMutation } from '@/composables/graphql/generated'
import moment from '@/plugins/moment'
import { storeKey } from '@/store'
import { type approveFriendRequest as approveFriendRequestAction } from '@/store/connections/actions/friends/approveFriendRequest'
import { type rejectFriendRequest as rejectFriendRequestAction } from '@/store/connections/actions/friends/rejectFriendRequest'
import type { StoreActionPayload, StoreActionResponse } from '@/store/types'
import { type Conversation } from '@/types'
import { getConversationOpponent, getSingleIdFromRouteParam } from '@/utils'

import { useNotificationAction } from './useNotificationAction'
import { useToast } from './useToast'

export const useNotificationActionHandlers = () => {
  const { t } = useI18n()
  const route = useRoute()
  const store = useStore(storeKey)
  const { next } = useNotificationAction()
  const { showInfoToast, hideToast } = useToast()

  const activeProfileId = computed(() => store.state.auth.profileId)

  const confirmEmail = async (token: string) => {
    let message = ''
    let success = false

    const response = await store.dispatch('auth/confirmEmail', { token })
    if (response && response.success) {
      success = true
      message = 'Email has been successfully verified'
    } else {
      success = false
      message = response.message ?? 'Incorrect email confirmation link'
    }

    return {
      message,
      success,
    }
  }

  const approveFriendRequest = async (friendshipId: string) => {
    let message = ''
    let success = false

    const params: StoreActionPayload<typeof approveFriendRequestAction> = {
      requestId: friendshipId,
    }

    const response: StoreActionResponse<typeof approveFriendRequestAction> = await store.dispatch(
      'connections/approveFriendRequest',
      params,
    )

    if (response && 'error' in response) {
      message = response.error.message
    } else {
      const { profile } = response.data
      success = true
      message = t('action.friend.accepted', {
        name: `${profile.firstName} ${profile.lastName}`,
      }).toString()
    }

    return { message, success, back: true }
  }

  const rejectFriendRequest = async (friendshipId: string) => {
    let message = ''
    let success = false

    const params: StoreActionPayload<typeof rejectFriendRequestAction> = {
      requestId: friendshipId,
    }

    const response: StoreActionResponse<typeof rejectFriendRequestAction> = await store.dispatch(
      'connections/rejectFriendRequest',
      params,
    )

    if (response && 'error' in response) {
      message = response.error.message
    } else {
      const { profile } = response.data
      success = true
      message = t('action.friend.deleted', {
        name: `${profile.firstName} ${profile.lastName}`,
      }).toString()
    }

    return { message, success, back: true }
  }

  const acceptDatingProfileRequest = async (requestId: string) => {
    let message = ''
    let success = false

    try {
      await store.dispatch('profile/acceptDatingProfileRequest', {
        requestId,
      })
      message = t('action.dating-profile.accept').toString()
      success = true

      return { message, success }
    } catch (e) {
      const error = e as Error
      if (error.message === 'GraphQL error: NoRequestExists') {
        message = t('action.dating-profile.accept-no-request-exists').toString()
      } else {
        message = t('action.dating-profile.accept-error').toString()
      }
      success = false

      return { message, success }
    }
  }

  const {
    mutate: acceptHosting,
    onDone: onAcceptHostingDone,
    onError: onAcceptHostingError,
  } = useAcceptHostingMutation(() => ({
    variables: {
      id: '',
    },
  }))

  const {
    mutate: declineHosting,
    onDone: onDeclineHostingDone,
    onError: onDeclineHostingError,
  } = useDeclineHostingMutation(() => ({
    variables: {
      id: '',
    },
  }))

  const acceptHostingRequest = (hostingId: string) => {
    showInfoToast(
      t('action.hosting.request-accepted-progress').toString(),
      t('profile-view.general.progress').toString(),
      `accept-hosting-request-${hostingId}`
    )
    acceptHosting({ id: hostingId })
  }

  onAcceptHostingDone((result) => {
    const hosting = result.data?.acceptHosting.hosting!
    const date = moment(hosting.date).format(t('action.hosting.date-template').toString())
    let message = ''
    const redirect: RouteLocationRaw = {
      name: 'ShabbatPlanner',
      params: {
        role: '',
        date: moment(hosting.date).format('YYYY-MM-DD'),
        hostingId: hosting.id,
      },
    }

    if (hosting.type === IHostingType.Invitation) {
      // an invitation comes from the host to the guest and needs to be accepted or declined
      // by the guest - that's why the displayname is the host
      message = t('action.hosting.invitation-accepted', {
        name: hosting.host.displayName,
        date,
      }).toString()
      redirect.params!.role = 'guest'
    } else {
      // a hosting request comes  from the guest to the host and needs to be accepted or declined
      // by the host - that's why the displayname is the guest
      message = t('action.hosting.request-accepted', {
        name: hosting.guest.displayName,
        date,
      }).toString()
      redirect.params!.role = 'host'
    }
    
    // Hide progress toast
    hideToast(`accept-hosting-request-${hosting.id}`)

    next({
      message,
      redirect,
      success: true,
      action: 'accept',
    })
  })

  onAcceptHostingError(() => {
    const { id: hostingId } = route.params

    const message = 'error'
    const redirect: RouteLocationRaw = {
      name: 'ShabbatPlanner',
      params: {
        role: '',
        date: '',
        hostingId,
      },
    }

    // Hide progress toast
    hideToast(`accept-hosting-request-${hostingId}`)

    next({
      message,
      redirect,
      success: false,
      action: 'accept',
    })
  })

  const deleteHostingRequest = (hostingId: string) => {
    showInfoToast(
      t('action.hosting.request-declined-progress').toString(),
      t('profile-view.general.progress').toString(),
      `delete-hosting-request-${hostingId}`
    )
    declineHosting({ id: hostingId })
  }

  onDeclineHostingDone((result) => {
    const hosting = result.data?.declineHosting.hosting!

    const date = moment(hosting.date).format(t('action.hosting.date-template').toString())
    const redirect: RouteLocationRaw = {
      name: 'ShabbatPlanner',
      params: {
        role: '',
        date,
        hostingId: hosting.id,
      },
    }
    let message = ''
    if (hosting.type === IHostingType.Invitation) {
      message = t('action.hosting.invitation-declined', {
        name: hosting.host.displayName,
        date,
      }).toString()
      redirect.params!.role = 'guest'
    } else {
      message = t('action.hosting.request-declined', {
        name: hosting.guest.displayName,
        date,
      }).toString()
      redirect.params!.role = 'host'
    }

    // Hide progress toast
    hideToast(`delete-hosting-request-${hosting.id}`)

    next({
      message,
      redirect,
      success: true,
      action: 'decline',
    })
  })

  onDeclineHostingError(() => {
    const message = 'error'
    const hostingId = getSingleIdFromRouteParam(route.params.id)
    const redirect: RouteLocationRaw = {
      name: 'ShabbatPlanner',
      params: {
        role: '',
        date: '',
        hostingId,
      },
    }

    // Hide progress toast
    hideToast(`delete-hosting-request-${hostingId}`)

    next({
      message,
      redirect,
      success: false,
      action: 'decline',
    })
  })

  const acceptMessageRequest = async (conversationId: string) => {
    let redirect: RouteLocationRaw = {
      name: 'Profile',
    }
    let message = ''
    let success = false

    const conversation: Conversation = await store.dispatch('message/approveConversation', conversationId)
    const participant = getConversationOpponent(conversation, activeProfileId.value!)
    if (participant) {
      const { firstName, lastName } = participant.profile
      success = true
      message = t('action.message.accepted', {
        name: `${firstName} ${lastName}`,
      }).toString()
      redirect = {
        name: 'CustomMessage',
        params: {
          handle: participant.profile.handle,
        },
      }
    } else {
      message = t('action.message.accept-error').toString()
    }

    return { message, success, redirect }
  }

  const deleteMessageRequest = async (conversationId: string) => {
    const redirect: RouteLocationRaw = {
      name: 'Profile',
    }
    let message = ''
    let success = false

    const conversation: Conversation = await store.dispatch('message/rejectConversation', conversationId)
    const participant = getConversationOpponent(conversation, activeProfileId.value!)
    if (participant) {
      const { firstName, lastName } = participant.profile
      success = true
      message = t('action.message.deleted', {
        name: `${firstName} ${lastName}`,
      }).toString()
    } else {
      message = t('action.message.delete-error').toString()
    }

    return { message, success, redirect }
  }

  const acceptReferenceRequest = async (requestId: string) => {
    let message = ''
    let success = false

    const { error, profile } = await store.dispatch('profile/approveReferencesRequest', {
      requestId,
    })
    if (profile) {
      success = true
      message = t('action.references.accepted', {
        name: `${profile.firstName} ${profile.lastName}`,
      }).toString()
    } else {
      message = error
    }
    return { success, message }
  }

  const deleteReferenceRequest = async (requestId: string) => {
    let message = ''
    let success = false

    const { error, profile } = await store.dispatch('profile/rejectReferencesRequest', {
      requestId,
    })
    if (profile) {
      success = true
      message = t('action.references.deleted', {
        name: `${profile.firstName} ${profile.lastName}`,
      }).toString()
    } else {
      message = error
    }
    return { success, message }
  }

  const turnOffmessagesByEmail = async (userId: string) => {
    let message = ''
    let success = false

    const profileSettings = await store.dispatch('profileSettings/updateProfileSettings', {
      profileId: userId,
      setting: 'messagesByEmail',
      value: false,
    })

    if (profileSettings) {
      success = true
      message = t('action.messages-by-email-off.succeeded').toString()
    } else {
      success = false
      message = t('action.messages-by-email-off.failed').toString()
    }

    return {
      message,
      success,
    }
  }

  return {
    acceptDatingProfileRequest,
    acceptHostingRequest,
    acceptMessageRequest,
    acceptReferenceRequest,
    activeProfileId,
    approveFriendRequest,
    confirmEmail,
    deleteHostingRequest,
    deleteMessageRequest,
    deleteReferenceRequest,
    rejectFriendRequest,
    turnOffmessagesByEmail,
  }
}
