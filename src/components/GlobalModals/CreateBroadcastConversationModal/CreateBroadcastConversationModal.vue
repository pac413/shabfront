<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    centered
    body-class="py-4 px-5"
    size="lg"
    :title="modalTitle"
    modal-class="create-broadcast-conversation-modal"
    no-close-on-backdrop
  >
    <div class="create-broadcast-conversation-modal mx-2">
      <div class="avatar-wrapper">
        <Spinner v-if="!participants" />
        <div
          v-else
          class="avatar-list"
        >
          <invite-avatar
            v-for="participant in participants"
            :key="participant.id"
            class="invite-avatar"
            :profile="participant"
          />
        </div>
      </div>
      <div class="title-wrapper">
        <BFormGroup
          class="form-group"
          label-for="title"
          label-class="input-label"
        >
          <BFormInput
            id="title"
            v-model="title"
            type="text"
            required
            :placeholder="$t('conversations.create-broadcast-conversation-modal.title-input')"
          />
          <div
            v-if="errors.length > 0"
            class="error-details pull-if-rtl-label"
          >
            {{ $t(errors[0]) }}
          </div>
        </BFormGroup>
      </div>
      <div class="message-body">
        <message-input
          v-model="message"
          class="message-body-input"
          :attachment="attachment"
          @clear-attachment="onClearAttachment"
          @edit-attachment="onEditAttachment"
        />
      </div>
    </div>

    <upload-picture-modal
      :upmid="BROADCAST_CONVERSATION_UPM_ID"
      :title="$t('post.upload-photo')"
      :type="MediaSubType.MESSAGE"
      :editing-item="editingPictureItem"
      @submit="addPicture"
    />
    <upload-video-modal
      :id="BROADCAST_CONVERSATION_UVM_ID"
      :title="$t('post.upload-video')"
      @submit="addVideo"
    />

    <template #footer>
      <create-broadcast-conversation-buttons
        :publishable="publishable"
        @add-picture="onAddPicture"
        @add-video="onAddVideo"
        @add-emoji="onEmojiAdded"
        @submit="submit"
      />
    </template>
  </BModal>
</template>

<script lang="ts">
import { ApolloError } from '@apollo/client/errors'
import * as Sentry from '@sentry/vue'
import { useField } from 'vee-validate'
import { computed, type ComputedRef, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import UploadPictureModal from '@/components/Common/UploadPictureModal.vue'
import UploadVideoModal from '@/components/Common/UploadVideoModal.vue'
import InviteAvatar from '@/components/Invites/InviteAvatar.vue'
import { useModal, useRegisterModal, useStringRequiredRule, useToast } from '@/composables'
import { useCreateBroadcastConversationMutation } from '@/composables/graphql/generated'
import { useSendMessage } from '@/composables/useSendMessage'
import { storeKey } from '@/store'
import { Modal } from '@/stores/modal'
import { MediaSubType, type Picture, type SimpleProfile } from '@/types'

import CreateBroadcastConversationButtons from './CreateBroadcastConversationButtons.vue'
import MessageInput from './MessageInput.vue'

const modalId = Modal.CREATE_BROADCAST_CONVERSATION

export default defineComponent({
  name: 'CreateBroadcastConversationModal',
  components: {
    CreateBroadcastConversationButtons,
    InviteAvatar,
    MessageInput,
    UploadPictureModal,
    UploadVideoModal,
  },
  props: {
    participants: {
      type: Array as () => SimpleProfile[],
      required: true,
    }
  },
  setup(props) {
    const { t } = useI18n()
    const BROADCAST_CONVERSATION_UPM_ID = 'broadcast-conversation-upload-picture-modal'
    const BROADCAST_CONVERSATION_UVM_ID = 'broadcast-conversation-upload-video-modal'
    const modalTitle: ComputedRef<string> = computed(() =>
      t(
        'conversations.create-broadcast-conversation-modal.title',
        {
          size: props.participants.length,
        }
      ).toString()
    )

    const titleRule = useStringRequiredRule('title')
    const { errors, value: title } = useField<string>('title', titleRule)

    const modal = useModal()
    const { isVisible } = useRegisterModal(modalId)
    const store = useStore(storeKey)
    const { showSuccessToast, showErrorToast } = useToast()
    const {
      onCreateMessageDone,
      onCreateMessageError,
      onUploadMediaError,
      sendMessage
    } = useSendMessage()
    const {
      mutate: createBroadcastConversation,
      onDone: onCreateBroadcastConversationDone,
      onError: onCreateBroadcastConversationError
    } = useCreateBroadcastConversationMutation(() => ({
      variables: {
        input: {
          participantHandles: props.participants.map(({ handle }) => handle),
          title: title.value,
        }
      }
    }))

    const submitting = ref<boolean>(false)
    const message = ref<string>('')
    const attachment = ref<File | null>(null)
    const originalAttachment = ref<File | null>(null)
    const editingPictureItem = ref<Picture | null>(null)
    const formValid: ComputedRef<boolean> = computed(() => !!title.value)
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const placeholder = computed(() => {
      if (!activeProfile.value) { return '' }
      return t(
        'conversations.create-broadcast-conversation-modal.type-your-message',
        { name: activeProfile.value.firstName }
      ).toString()
    })
    const publishable = computed(() => {
      return !submitting.value && formValid.value && !!message.value
    })

    const onEnter = async (evt: KeyboardEvent) => {
      if (evt.shiftKey || evt.altKey) {
        return
      }
      evt.preventDefault()
      await submit()
    }

    const onAddPicture = (): void => {
      modal.show(BROADCAST_CONVERSATION_UPM_ID)
    }

    const onAddVideo = (): void => {
      modal.show(BROADCAST_CONVERSATION_UVM_ID)
    }

    const addPicture = (file: File, originalFile: File) => {
      attachment.value = file
      originalAttachment.value = originalFile
    }

    const addVideo = (input: { url: string; file: File }) => {
      const { file } = input
      attachment.value = file
    }

    const onClearAttachment = () => {
      attachment.value = null
      originalAttachment.value = null
      editingPictureItem.value = null
    }

    const onEditAttachment = (editableItem: Picture | null) => {
      editingPictureItem.value = editableItem
      modal.show(BROADCAST_CONVERSATION_UPM_ID)
    }

    const onEmojiAdded = (emoji: string) => {
      message.value += emoji
    }

    const closeModal = (): void => {
      modal.hide(modalId)
    }

    const resetForm = (): void => {
      message.value = ''
      attachment.value = null
      originalAttachment.value = null
      editingPictureItem.value = null
    }

    const submit = (): void => {
      if (!formValid.value) {
        return
      }
      submitting.value = true
      createBroadcastConversation()
    }
    const onSubmitDone = () => {
      submitting.value = false
      showSuccessToast(
        t('conversations.create-broadcast-conversation-modal.submit-success').toString(),
        t('profile-view.general.success').toString()
      )
      resetForm()
      closeModal()
    }
    const onSubmitError = (error: ApolloError | Error) => {
      submitting.value = false
      const message = (() => {
        if (error instanceof ApolloError) {
          if (error.graphQLErrors.length > 0) {
            return error.graphQLErrors[0].message
          }
        } else {
          return error.message
        }
      })()
      showErrorToast(message)
      Sentry.captureException(error)
    }
    onCreateBroadcastConversationDone((params) => {
      const conversation = params.data?.createBroadcastConversation
      if (!conversation) {
        return
      }
      sendMessage({
        conversation,
        text: message.value,
        attachment: attachment.value,
        originalAttachment: originalAttachment.value,
      })
    })
    onCreateBroadcastConversationError(onSubmitError)
    onCreateMessageDone(onSubmitDone)
    onCreateMessageError(onSubmitError)
    onUploadMediaError(onSubmitError)

    return {
      addPicture,
      addVideo,
      attachment,
      BROADCAST_CONVERSATION_UPM_ID,
      BROADCAST_CONVERSATION_UVM_ID,
      closeModal,
      editingPictureItem,
      errors,
      formValid,
      isVisible,
      MediaSubType,
      message,
      modalId,
      modalTitle,
      onAddPicture,
      onAddVideo,
      onClearAttachment,
      onEditAttachment,
      onEmojiAdded,
      onEnter,
      originalAttachment,
      placeholder,
      publishable,
      submit,
      submitting,
      title,
    }
  }
})
</script>

<style lang="scss" scoped>
.create-broadcast-conversation-modal.show {
  .modal-content {
    overflow: auto;
  }
}

.form-group {
  margin-bottom: 1rem;
}

.create-broadcast-conversation-modal {
  display: flex;
  flex-direction: column;
  color: #77838f;
  font-size: 14px;
  overflow: visible;
}

.avatar-wrapper {
  display: flex;
  align-items: baseline;
  justify-content: center;
}

.avatar-list {
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  max-height: 300px;
}

.invite-avatar {
  width: calc(20% - 1rem);
  margin: 0.5rem;

  :deep(.avatar) {
    width: unset !important;
    height: unset !important;
    aspect-ratio: 1 / 1;
  }
  
  @media (max-width: $tabletMaxWidth) {
    width: calc(50% - 1rem);
  }
}

.title-wrapper {
  margin-top: 10px;
  border-top: solid 1px $colorBorder;
  padding-top: 20px;

  .form-group {
    margin-bottom: 0;
  }
}

.modal-body .error-details {
  text-align: left;
  margin-top: 5px;
}

.message-body {
  flex: 1;
  border-top: solid 1px $colorBorder;
  margin-top: 10px;
  padding-top: 10px;
  min-height: 50vh;
  border-radius: 10px;
  overflow: auto;
  max-height: 200px;
  border-radius: 0;
}

.message-body-input {
  width: 100%;
  background: transparent;
  outline: none;
  border: none;
  font-size: 14px;
  line-height: 16px;
  border-radius: 35px;
  display: inline-block;
  white-space: pre-wrap;
  user-select: text;
  white-space: pre-wrap;
  overflow-wrap: break-word;

  &:empty:before {
    content: attr(placeholder);
    width: inherit;
    height: inherit;
    color: grey;
    display: block;
  }

  @media (max-width: $mobileMaxWidth) {
    font-size: .9rem;
  }
}
</style>
