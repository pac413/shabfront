<template>
  <div
    v-if="otherParticipant"
    class="message-header"
  >
    <RouterLink
      class="d-sm-visible d-md-none me-2 me-md-0"
      to="/messages"
    >
      <FaIcon
        class="message-header__back"
        :icon="['fa', 'chevron-left']"
      />
    </RouterLink>

    <ProfileAvatar
      linkable
      class="message-header__avatar"
      size="35px"
      :profile="otherParticipant.profile"
    />

    <div class="message-header__about">
      <div
        class="message-header__with pull-if-rtl-label"
        v-html="$t('messages.header-title', { name })"
      />
      <div
        v-if="unreadCount > 0"
        class="message-header__num-messages pull-if-rtl-label"
      >
        {{ unreadText }}
      </div>
    </div>

    <button
      v-if="!currentConversation.isBroadcast"
      id="btn-archive-conversation"
      role="button"
      class="btn btn-iconed btn-sm message-header__archive"
      @click="maybeArchiveConversation"
    >
      <FaIcon :icon="['fas', 'archive']" />
    </button>

    <BTooltip
      target="btn-archive-conversation"
      triggers="hover"
    >
      {{ $t('messages.archive-conversation-title') }}
    </BTooltip>

    <ConfirmationDialog
      id="archive-conversation-confirmation-dialog"
      v-model="archiveDlgVisible"
      :body="$t('messages.archive-conversation-description', { name })"
      :title="$t('messages.archive-conversation-title')"
      @success="archiveConversation"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import ConfirmationDialog from '@/components/Common/Dialogs/ConfirmationDialog.vue'
import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import { storeKey } from '@/store'
import type { ConversationParticipant } from '@/types'

export default defineComponent({
  name: 'DirectMessageHeader',
  components: { ConfirmationDialog, ProfileAvatar },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const store = useStore(storeKey)
    const currentConversation = computed(() => store.state.message.currentConversation!)
    const profileId = computed(() => store.state.auth.profileId!)
    const otherParticipant = computed<ConversationParticipant>(() =>
      store.getters['message/currentConversationOpponent']
    )
    const archiveDlgVisible = ref<boolean>(false)
    const name = computed(() => {
      if (!otherParticipant.value) { return '' }
      return otherParticipant.value.profile.firstName
    })
    const unreadCount = computed(() => {
      return currentConversation.value.unreadMessagesCount
    })
    const unreadText = computed(() => {
      return t('messages.unread-messages', { count: currentConversation.value.unreadMessagesCount })
        .toString()
    })

    const maybeArchiveConversation = () => {
      archiveDlgVisible.value = true
    }

    const archiveConversation = async () => {
      await store.dispatch('message/archiveConversation', currentConversation.value.id)
      // Navigate back to the message inbox page
      await router.push({ name: 'Message' })
    }

    return {
      archiveConversation,
      archiveDlgVisible,
      currentConversation,
      maybeArchiveConversation,
      name,
      otherParticipant,
      profileId,
      unreadCount,
      unreadText,
    }
  }
})
</script>

<style lang="scss" scoped>
.message-header {
  display: flex;
  align-items: center;
  height: 74px;
  justify-content: space-between;
  padding: 15px 15px 15px 25px;
  background: $colorMessaging;
  border-bottom: 0.5px solid #C2C2C2;
  z-index: 1;
}

.message-header__back {
  color: $colorRed;
}

.message-header__about {
  flex: 1 1 auto;
  margin: 0 10px;
  font-size: 1rem;
}

.message-header__archive {
  color: $colorRed;
}
</style>
