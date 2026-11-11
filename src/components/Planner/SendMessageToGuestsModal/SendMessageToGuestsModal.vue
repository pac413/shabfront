<template>
  <BModal
    :id="modalId"
    v-model="isVisible"
    body-class="py-4 px-5"
    scrollable
    size="lg"
    :title="modalTitle"
    @shown="onModalShown"
    @hidden="onModalHidden"
  >
    <div class="guest-message-modal-wrapper mx-2">
      <div class="guest-message-modal__guests-list">
        <div class="label">
          <label for="message"><b>{{ $t('invites.modal.guests-list-title') }}:</b></label>
        </div>
        <GuestsAvatarList :invitations="invitations" />
      </div>
      <div class="message-wrapper py-4">
        <div class="label">
          <label for="message"><b>{{ $t('invites.modal.message-title') }}:</b></label>
        </div>
        <BFormTextarea
          id="flag-content-textarea"
          v-model="message"
          autofocus
          type="text"
          rows="8"
          :placeholder="$t('invites.modal.send-message-to-guests-placeholder')"
        />
      </div>
    </div>

    <template #footer>
      <BButton
        variant="secondary"
        @click="closeModal"
      >
        {{ $t('general.cancel') }}
      </BButton>
      <BButton
        variant="primary"
        :disabled="!formValid || submitting"
        @click="submit"
      >
        Send
      </BButton>
    </template>
  </BModal>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

import { useRegisterModal, useToast } from '@/composables'
import { useSendMessageToGuestsMutation } from '@/composables/graphql/generated'
import type { InviteDetail } from '@/types'

import GuestsAvatarList from './GuestsAvatarList.vue'

const modalId = 'SendMessageToGuestsModal'

export default defineComponent({
  name: 'SendMessageToGuestsModal',
  components: {
    GuestsAvatarList
  },
  props: {
    invitations: {
      type: Array as () => InviteDetail[],
      required: true,
    },
    visible: {
      type: Boolean,
      required: false,
      default: false,
    }
  },
  emits: ['update:visible'],
  setup(props, context) {
    const { t } = useI18n()
    const { isVisible } = useRegisterModal(modalId)
    const { showSuccessToast, showErrorToast } = useToast()
    const modalTitle = computed(() =>
      props.invitations.length === 1
        ? t('invites.modal.send-message-to-one-guest', { count: props.invitations.length }).toString()
        : t('invites.modal.send-message-to-n-guests', { count: props.invitations.length }).toString()
    )
    const message = ref<string>('')
    const isModalVisible = ref<boolean>(props.visible)
    const formValid = computed(() => !!message.value)
    const {
      mutate: sendMessageToGuests,
      loading: submitting,
      onDone: onSendMessageToGuestsDone,
      onError: onSendMessageToGuestsError
    } = useSendMessageToGuestsMutation(() => ({
      variables: {
        input: {
          hostingIds: props.invitations.map((hosting) => hosting.id),
          message: message.value,
        },
      }
    }))
    const closeModal = (): void => {
      isVisible.value = false
    }
    const submit = (): void => {
      sendMessageToGuests()
    }
    const reset = (): void => {
      message.value = ''
    }
    const onModalHidden = (): void => {
      isModalVisible.value = false
      context.emit('update:visible', false)
      reset()
    }
    const onModalShown = (): void => {
      isModalVisible.value = true
      context.emit('update:visible', true)
    }

    onSendMessageToGuestsDone((param) => {
      if (param.data?.sendMessageToGuests.__typename === 'SendMessageToGuestsSuccess') {
        const { success } = param.data?.sendMessageToGuests
        const message = success === 1
          ? t('invites.modal.send-message-to-one-guest-success').toString()
          : t('invites.modal.send-message-to-n-guests-success', { count: success }).toString()
        showSuccessToast(message, t('invites.modal.send-message-to-guests-toast-title').toString())
      } else if (param.data?.sendMessageToGuests.__typename === 'SendMessageToGuestsFailure') {
        const { message } = param.data?.sendMessageToGuests
        showErrorToast(message, t('invites.modal.send-message-to-guests-toast-title').toString())
      }
      closeModal()
    })

    onSendMessageToGuestsError((error) => {
      showErrorToast(error)
      closeModal()
    })

    watch(() => props.visible, value => {
      if (isModalVisible.value === value) {
        return
      }

      isVisible.value = value
    })

    return {
      closeModal,
      formValid,
      isVisible,
      message,
      modalId,
      modalTitle,
      onModalHidden,
      onModalShown,
      submit,
      submitting,
    }
  }
})
</script>
