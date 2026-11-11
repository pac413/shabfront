<template>
  <div
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

    <div class="message-header__icon">
      <FaIcon :icon="['fal', 'megaphone']" />
    </div>

    <div class="message-header__about">
      <div
        class="message-header__with pull-if-rtl-label"
      >
        {{ title }}
      </div>
      <div
        v-if="unreadCount > 0"
        class="message-header__num-messages pull-if-rtl-label"
      >
        {{ unreadText }}
      </div>
    </div>

    <button
      id="btn-view-participants"
      role="button"
      class="btn btn-iconed btn-sm message-header__participants"
      @click="showParticipantsDialog"
    >
      <FaIcon :icon="['fas', 'user-group']" />
    </button>

    <BTooltip
      target="btn-view-participants"
      triggers="hover"
    >
      {{ $t('messages.view-participants-button-tooltip') }}
    </BTooltip>

    <button
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
      :body="$t('messages.archive-broadcast-conversation-description')"
      :title="$t('messages.archive-broadcast-conversation-title')"
      @success="archiveConversation"
    />

    <participants-list-dialog
      v-model="participantsDlgVisible"
      :conversation="conversation"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import ConfirmationDialog from '@/components/Common/Dialogs/ConfirmationDialog.vue'
import { storeKey } from '@/store'

import ParticipantsListDialog from './ParticipantsListDialog.vue'

export default defineComponent({
  name: 'BroadcastMessageHeader',
  components: {
    ConfirmationDialog,
    ParticipantsListDialog,
  },
  setup() {
    const { t } = useI18n()
    const router = useRouter()
    const store = useStore(storeKey)
    const conversation = computed(() => store.state.message.currentConversation!)
    const profileId = computed(() => store.state.auth.profileId!)
    const archiveDlgVisible = ref<boolean>(false)
    const participantsDlgVisible = ref<boolean>(false)
    const title = computed(() => {
      return `${conversation.value.title} (${conversation.value.participants.length - 1} Participants)`
    })
    const unreadCount = computed(() => {
      return conversation.value.unreadMessagesCount
    })
    const unreadText = computed(() => {
      return t('messages.unread-messages', { count: conversation.value.unreadMessagesCount })
        .toString()
    })

    const maybeArchiveConversation = () => {
      archiveDlgVisible.value = true
    }

    const showParticipantsDialog = () => {
      participantsDlgVisible.value = true
    }

    const archiveConversation = async () => {
      await store.dispatch('message/archiveConversation', conversation.value.id)
      // Navigate back to the message inbox page
      await router.push({ name: 'Message' })
    }

    return {
      archiveConversation,
      archiveDlgVisible,
      conversation,
      maybeArchiveConversation,
      participantsDlgVisible,
      profileId,
      showParticipantsDialog,
      title,
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

.message-header__participants {
  color: $colorSecondary;
}

.message-header__archive {
  color: $colorRed;
}

.message-header__icon {
  width: 45px;
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  color: $colorRed;
  background: $colorLightGrey2;
}
</style>
