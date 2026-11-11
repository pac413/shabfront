<template>
  <div class="conversation-rejected-alert px-3 py-2 mt-3">
    <ProfileAvatar
      linkable
      class="mb-2"
      size="30px"
      :profile="otherParticipant.profile"
    />
    <span v-html="pendingAlertText" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import { storeKey } from '@/store'
import type { ConversationParticipant } from '@/types'

/**
 * This component is used to show notification if the current conversation was rejected by opponent.
 */
export default defineComponent({
  name: 'ConversationRejectedAlert',
  components: { ProfileAvatar },
  setup() {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const otherParticipant = computed<ConversationParticipant>(() =>
      store.getters['message/currentConversationOpponent']
    )
    const pendingAlertText = computed(() =>
      t('messages.rejected-by-opponent', { firstName: otherParticipant.value.profile.firstName })
    )

    return {
      otherParticipant,
      pendingAlertText,
    }
  }
})
</script>

<style lang="scss" scoped>
.conversation-rejected-alert {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: fit-content;
  align-items: center;
  border-radius: 6px;
  background: $colorLightGrey3;

  span {
    text-align: center;
  }
}
</style>
