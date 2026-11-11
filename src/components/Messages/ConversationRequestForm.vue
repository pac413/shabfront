<template>
  <div class="conversation-request-form px-3 py-2 mt-3">
    <ProfileAvatar
      linkable
      class="conversation-request-form__avatar mb-2"
      size="30px"
      :profile="otherParticipant.profile"
    />
    <span
      class="conversation-request-form__text mb-2"
      v-html="requestText"
    />
    <div class="conversation-request-form__actions">
      <BOverlay
        class="d-inline-block"
        :show="loading"
        rounded
        spinner-small
        spinner-variant="primary"
      >
        <BButton
          :disabled="loading"
          variant="secondary"
          @click="rejectRequest"
        >
          {{ $t('messages.reject') }}
        </BButton>
      </BOverlay>
      <BOverlay
        class="d-inline-block"
        :show="loading"
        rounded
        spinner-small
        spinner-variant="primary"
      >
        <BButton
          :disabled="loading"
          variant="primary"
          @click="approveRequest"
        >
          {{ $t('messages.accept') }}
        </BButton>
      </BOverlay>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import { storeKey } from '@/store'
import type { ConversationParticipant } from '@/types'

export default defineComponent({
  name: 'ConversationRequestForm',
  components: { ProfileAvatar },
  setup() {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const router = useRouter()
    const otherParticipant = computed<ConversationParticipant>(() =>
      store.getters['message/currentConversationOpponent']
    )
    const currentConversation = computed(() => store.state.message.currentConversation!)
    const loading = ref<boolean>(false)
    const requestText = computed(() =>
      t('messages.request-text', { firstName: otherParticipant.value.profile.firstName }).toString()
    )

    const approveRequest = async () => {
      loading.value = true
      await store.dispatch('message/approveConversation', currentConversation.value.id)
      await store.dispatch('message/getMessagesForCurrentConversation', { reset: true })
      loading.value = false
    }

    const rejectRequest = async () => {
      loading.value = true
      await store.dispatch('message/rejectConversation', currentConversation.value.id)
      loading.value = false
      router.push('/messages')
    }

    return {
      approveRequest,
      currentConversation,
      loading,
      otherParticipant,
      rejectRequest,
      requestText,
    }
  }
})
</script>

<style lang="scss" scoped>
.conversation-request-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: fit-content;
  align-items: center;
  border-radius: 6px;
  background: $colorLightGrey3;

  button {
    margin-right: 10px;
  }
}

.rtl-at-root {
  .conversation-request-form {
    button {
      margin-left: 10px;
      margin-right: unset;
    }
  }
}
</style>
