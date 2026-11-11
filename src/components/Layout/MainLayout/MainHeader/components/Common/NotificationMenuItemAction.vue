<template>
  <BButton
    class="notification-menu-item-action"
    size="sm"
    :variant="'alert-' + variant"
    @click="handleAction"
  >
    {{ action.label }}
  </BButton>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { useNotificationActionHandlers, useToast } from '@/composables'
import { IEndorsementSiteRole, INotificationActionType, type ISimpleProfile } from '@/composables/graphql/generated'
import { queryProfileByHandle } from '@/graphql/queries'
import { storeKey } from '@/store'
import { type EndorsementModalProps, Modal, useModalStore } from '@/stores/modal'
import type { Notification, NotificationAction } from '@/types'

export default defineComponent({
  name: 'NotificationMenuItemAction',
  props: {
    action: {
      type: Object as () => NotificationAction,
      required: true,
    },
    notification: {
      type: Object as () => Notification,
      required: true,
    },
  },
  emits: ['hide-menu'],
  setup(props, context) {
    const { t } = useI18n()
    const { showSuccessToast, showErrorToast } = useToast()
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const router = useRouter()
    const activeProfile = computed(() => store.state.profile.activeProfile)

    const {
      approveFriendRequest,
      deleteMessageRequest,
      rejectFriendRequest,
    } = useNotificationActionHandlers()
    const variant = computed(() => props.action.style.toLowerCase())

    const handleAction = async () => {
      const { type, payload, actionUrl } = props.action
      const { message, success } = await (async () => {
        switch (type) {
        case INotificationActionType.AcceptFriendRequest: {
          const friendshipId: string = payload!.requestId
          const result = await approveFriendRequest(friendshipId)
          if (result.success) {
            store.commit('notification/DELETE_NON_MESSAGE_NOTIFICATION', props.notification)
          }
          return result
        }
        case INotificationActionType.DeleteFriendRequest: {
          const friendshipId: string = payload!.requestId
          const result = await rejectFriendRequest(friendshipId)
          if (result.success) {
            store.commit('notification/DELETE_NON_MESSAGE_NOTIFICATION', props.notification)
          }
          return result
        }
        case INotificationActionType.DeleteMessageRequest: {
          const conversationId: string = payload.requestId
          const result = await deleteMessageRequest(conversationId)
          if (result.success) {
            store.commit('notification/DELETE_MESSAGE_NOTIFICATION', props.notification)
          }
          return result
        }
        case INotificationActionType.AcceptHostEndorsementRequest:
        case INotificationActionType.AcceptGuestEndorsementRequest: {
          const { hostingId, profileHandle } = payload!
          const endorsementType = type === INotificationActionType.AcceptHostEndorsementRequest
            ? IEndorsementSiteRole.Host
            : IEndorsementSiteRole.Guest

          // Get profile for the given handle
          const { data } = await queryProfileByHandle({ handle: profileHandle })
          const { profile } = data!.profile

          const modalProps: EndorsementModalProps = {
            endorser: activeProfile.value! as any as ISimpleProfile,
            endorsee: profile as any as ISimpleProfile,
            type: endorsementType,
            endorsingBack: false,
            reference: { hostingId },
          }
          showModal({
            modal: Modal.ENDORSEMENT,
            props: modalProps,
          })

          return { message: '', success: true }
        }
        case INotificationActionType.EndorseBack: {
          const actionUrlElements = actionUrl?.split('/') || []
          const profileHandle = actionUrlElements[actionUrlElements.length - 2]
          const endorsementType = actionUrlElements[actionUrlElements.length - 1] as IEndorsementSiteRole

          // Get profile for the given handle
          const { data } = await queryProfileByHandle({ handle: profileHandle })
          const { profile } = data!.profile

          const modalProps: EndorsementModalProps = {
            endorser: activeProfile.value! as any as ISimpleProfile,
            endorsee: profile as any as ISimpleProfile,
            type: endorsementType,
            endorsingBack: false,
          }
          showModal({
            modal: Modal.ENDORSEMENT,
            props: modalProps,
          })

          return { message: '', success: true }
        }
        default: {
          if (actionUrl) {
            if (actionUrl.startsWith('/')) {
              router.push(actionUrl)
            } else {
              location.href = actionUrl
            }
          }
          return { message: '', success: true }
        }
        }
      })()
      if (message) {
        if (success) {
          showSuccessToast(message, t('profile-view.general.success').toString())
        } else {
          showErrorToast(message, t('profile-view.general.error').toString())
        }
      }
      if (success) {
        // Hide the notification menu
        context.emit('hide-menu')
      }
    }

    return {
      handleAction,
      variant,
    }
  }
})
</script>
