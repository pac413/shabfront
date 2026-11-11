<template>
  <div class="response-footer flex-fill">
    <BCollapse
      id="custom-response"
      v-model="formVisible"
      class="px-2"
    >
      <h5 class="py-2">
        {{ $t('invites.modal.partially-accept') }}:
      </h5>
      <div class="parts-wrapper ps-3">
        <BFormCheckboxGroup
          v-model="responseParts"
          stacked
        >
          <BFormCheckbox
            v-for="option in parts"
            :key="option"
            :value="option"
          >
            {{ $t('invites.hosting-part.' + option) }}
          </BFormCheckbox>
        </BFormCheckboxGroup>
      </div>
      <div class="message-wrapper pt-2 pb-4">
        <h5 class="py-2">
          {{ $t('invites.modal.include-note') }}:
        </h5>
        <div
          ref="messageRef"
          class="contenteditable"
          contenteditable
          :placeholder="$t('invites.modal.message-placeholder')"
        />
      </div>
    </BCollapse>
    <div class="footer-buttons">
      <BButton
        variant="link"
        @click="formVisible = !formVisible"
      >
        {{ formVisible? $t('invites.modal.hide-customize') : $t('invites.modal.customize') }}
      </BButton>
      <BButton
        variant="secondary"
        :disabled="declineHostingLoading || (formVisible && !!responseParts.length)"
        @click="decline"
      >
        {{ $t('invites.modal.decline') }}
      </BButton>
      <BButton
        variant="primary"
        :disabled="acceptHostingLoading || (formVisible && !responseParts.length)"
        @click="accept"
      >
        {{ $t('invites.modal.accept') }}
      </BButton>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import { useToast } from '@/composables'
import { type IHostingPart, useAcceptHostingMutation, useDeclineHostingMutation } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { type InviteDetail, InviteType } from '@/types'

export default defineComponent({
  name: 'ResponseFooter',
  props: {
    parts: {
      type: Array as () => IHostingPart[],
      required: true,
    }
  },
  emits: ['close'],
  setup(props, context) {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const { showSuccessToast } = useToast()
    const invitation = computed<InviteDetail>(() => store.getters['invites/currentInvite'])
    const formVisible = ref<boolean>(false)
    const responseParts = ref<IHostingPart[]>([])
    const messageRef = ref<HTMLDivElement | null>(null)

    const {
      mutate: acceptHosting,
      onDone: onAcceptHostingDone,
      onError: onAcceptHostingError,
      loading: acceptHostingLoading
    } = useAcceptHostingMutation(() => ({
      variables: {
        id: invitation.value.id,
        note: messageRef.value?.innerText || '',
        parts: formVisible.value ? responseParts.value : props.parts
      }
    }))

    const {
      mutate: declineHosting,
      onDone: onDeclineHostingDone,
      onError: onDeclineHostingError,
      loading: declineHostingLoading
    } = useDeclineHostingMutation(() => ({
      variables: {
        id: invitation.value.id,
        note: messageRef.value?.innerText || ''
      }
    }))

    const accept = () => {
      acceptHosting()
    }

    onAcceptHostingDone(() => {
      showAcceptDeclineToast(true)
      close()
    })

    onAcceptHostingError(() => {
      close()
    })

    const decline = () => {
      declineHosting()
    }

    onDeclineHostingDone(() => {
      showAcceptDeclineToast(false)
      close()
    })

    onDeclineHostingError(() => {
      close()
    })

    const close = () => {
      context.emit('close')
    }

    const showAcceptDeclineToast = (accept: boolean) => {
      const type = invitation.value.type === InviteType.INVITATION
        ? t('invites.modal.invitation-request').toString()
        : t('invites.modal.hosting-request').toString()

      const action = accept ? 'accepted' : 'declined'
      showSuccessToast(
        t(`invites.modal.request-${action}`, { type }).toString(),
        t('profile-view.general.success').toString()
      )
    }

    return {
      accept,
      close,
      decline,
      formVisible,
      invitation,
      messageRef,
      showAcceptDeclineToast,
      responseParts,
      acceptHostingLoading,
      declineHostingLoading
    }
  }
})
</script>

<style lang="scss" scoped>
.response-footer {
  font-size: .9rem;

  h5 {
    font-size: 1.1rem;
    font-weight: bold;
  }
}

.contenteditable {
  min-height: 80px;
  color: $colorText;
}

:deep(.custom-control-label) {
  color: $colorText;
  &::before, &::after {
    top: .12rem;
  }
}

.footer-buttons {
  display: flex;
  justify-content: flex-end;
  button {
    margin: 0.25rem;

    svg {
      margin-right: 5px;
    }
  }
}

.rtl-at-root {
  .footer-buttons {
    button {
      svg {
        margin-right: auto;
        margin-left: 5px;
      }
    }
  }
}
</style>
