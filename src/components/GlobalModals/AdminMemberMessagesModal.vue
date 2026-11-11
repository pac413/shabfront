<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    body-class="py-4 px-5"
    scrollable
    size="lg"
    :title="modalTitle"
    ok-only
    @shown="onShown"
  >
    <Spinner v-if="loading" />
    <admin-member-messages
      v-else
      :messages="messages"
      @delete="maybeDeleteMessage"
      @info="onInfo"
      @open-image="showImage"
    />
  </BModal>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import AdminMemberMessages from '@/components/Admin/RecentMembers/RecentMemberItem/AdminMemberMessages.vue'
import { useRegisterModal } from '@/composables'
import { useAdminMemberRecentMessagesLazyQuery } from '@/composables/graphql/generated'
import {
  type ConfirmMessageDeleteModalProps,
  type MessageImagePreviewModalProps,
  type MessageInfoModalProps,
  Modal,
  useModalStore
} from '@/stores/modal'
import type { Message, Profile } from '@/types'

const DEFAULT_MESSAGES_LIMIT = 50
const modalId = Modal.ADMIN_MEMBER_MESSAGES

export default defineComponent({
  name: 'AdminMemberMessagesModal',
  components: {
    AdminMemberMessages
  },
  props: {
    member: {
      type: Object as () => Profile,
      required: true,
    },
  },
  setup(props) {
    const { showModal } = useModalStore()
    const { isVisible } = useRegisterModal(modalId)
    const { load: loadMessages, loading, result } = useAdminMemberRecentMessagesLazyQuery({
      profileId: props.member.id,
      limit: DEFAULT_MESSAGES_LIMIT,
    })
    const messages = computed(() => result.value?.adminMemberRecentMessages.messages || [])
    const total = computed(() => result.value?.adminMemberRecentMessages.total || [])

    const modalTitle = computed(() => {
      if (loading.value) {
        return `Messages sent by ${props.member.displayName}`
      }
      return `${total.value} Messages sent by ${props.member.displayName}`
    })

    const maybeDeleteMessage = (message: Message) => {
      const props: ConfirmMessageDeleteModalProps = {
        message,
        onSuccess: () => loadMessages()
      }
      showModal({
        modal: Modal.CONFIRM_MESSAGE_DELETE,
        props
      })
    }

    const onInfo = (message: Message) => {
      const props: MessageInfoModalProps = {
        data: message
      }
      showModal({
        modal: Modal.MESSAGE_INFO,
        props
      })
    }

    const showImage = (image: string | ArrayBuffer | null) => {
      const props: MessageImagePreviewModalProps = { image }
      showModal({
        modal: Modal.MESSAGE_IMAGE_PREVIEW_MODAL,
        props
      })
    }

    const onShown = () => loadMessages()

    return {
      isVisible,
      loading,
      maybeDeleteMessage,
      messages,
      modalId,
      modalTitle,
      onInfo,
      onShown,
      showImage,
      total,
    }
  }
})
</script>
