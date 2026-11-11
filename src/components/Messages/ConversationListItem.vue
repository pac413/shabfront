<template>
  <RouterLink
    class="conversation-item animated fadeIn"
    :class="{
      'conversation-item--active': isActive,
      'conversation-item--unread': unreadMessagesCount > 0,
      'conversation-item--sent': status === 'SENT',
      'conversation-item--problem': status === 'PROBLEM'
    }"
    :to="conversationUrl"
  >
    <ProfileAvatar
      v-if="otherParticipant"
      class="conversation-item__avatar"
      :profile="otherParticipant.profile"
      size="45px"
    />

    <div class="conversation-item__content">
      <div class="conversation-item__title">
        <div class="conversation-item__name pull-if-rtl-label">
          <div
            v-if="conversation.isBroadcast"
            class="conversation-item__broadcast-icon"
          >
            <FaIcon :icon="['fal', 'megaphone']" />
          </div>
          <text-highlighter
            :text="title"
            :term="searchKeyword"
          />
        </div>

        <div class="conversation-item__date pull-if-rtl-label">
          <AgoString
            v-if="conversation.lastMessage"
            :date="conversation.lastMessage.date"
          />
        </div>
      </div>

      <div class="conversation-item__subtitle">
        <template v-if="typingSession">
          <typing-indicator class="conversation-item__typing pull-if-rtl-label">
            <span>{{ typingIndicatorText }}</span>
          </typing-indicator>
        </template>

        <template v-else-if="isWaitingYourApproval">
          <div
            class="conversation-item__text"
            v-html="$t('messages.request-text', { firstName })"
          />
        </template>

        <template v-else-if="isRejectedByOpponent">
          <div class="conversation-item__text">
            <span>{{ $t('messages.rejected-by-opponent-simple') }}</span>
          </div>
        </template>

        <template v-else-if="conversation.lastMessage">
          <div class="conversation-item__last-message">
            <FaIcon
              :icon="['fas', 'check']"
              :class="{'conversation-item__read': status === MessageStatus.READ}"
            />
            <span
              class="me-1 pull-if-rtl-label"
              v-html="lastMessageText"
            />
            <FaIcon
              v-if="lastMessageType === MessageType.IMAGE"
              :icon="['far', 'image']"
            />
            <FaIcon
              v-else-if="lastMessageType === MessageType.VIDEO"
              :icon="['fal', 'video']"
            />
            <FaIcon
              v-else-if="lastMessageType === MessageType.AUDIO"
              :icon="['fas', 'microphone']"
            />
          </div>

          <div
            v-if="unreadMessagesCount > 0"
            class="conversation-item__bubble pull-if-rtl-label"
          >
            {{ unreadMessagesCount }}
          </div>
        </template>
      </div>
    </div>
  </RouterLink>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import AgoString from '@/components/Common/AgoString.vue'
import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import TextHighlighter from '@/components/Common/TextHighlighter.vue'
import TypingIndicator from '@/components/Common/TypingIndicator.vue'
import { storeKey } from '@/store'
import {
  type Conversation,
  type ConversationParticipant,
  ConversationParticipantStatus,
  MediaType,
  MessageStatus,
  MessageType} from '@/types'
import {
  getConversationOpponent,
  getMessageType,
  getMyConversationStatus,
  getOpponentConverationStatus
} from '@/utils'

/**
 * Component to render each conversation item.
 */
export default defineComponent({
  name: 'ConversationListItem',
  components: { AgoString, ProfileAvatar, TextHighlighter, TypingIndicator },
  props: {
    conversation: {
      type: Object as () => Conversation,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const searchKeyword = computed(() => store.state.message.conversationsSearch)
    const currentConversation = computed(() => store.state.message.currentConversation)
    const typingSessions = computed(() => store.state.message.typingSessions)
    const profileId = computed(() => store.state.auth.profileId!)

    const isActive = computed(() => {
      return currentConversation.value && props.conversation.id === currentConversation.value.id
    })

    const conversationUrl = computed(() => {
      if (props.conversation.isBroadcast) {
        return `/messages/broadcast/${props.conversation.id}`
      }
      return `/messages/${otherParticipant.value?.profile.handle}`
    })

    const otherParticipant = computed((): ConversationParticipant | undefined => {
      return getConversationOpponent(props.conversation, profileId.value)
    })

    const isWaitingYourApproval = computed((): boolean => {
      return getMyConversationStatus(props.conversation, profileId.value) === ConversationParticipantStatus.PENDING &&
      getOpponentConverationStatus(props.conversation, profileId.value) === ConversationParticipantStatus.APPROVED
    })

    const isRejectedByOpponent = computed((): boolean =>
      getOpponentConverationStatus(props.conversation, profileId.value) === ConversationParticipantStatus.REJECTED
    )

    const status = computed(() => {
      if (!props.conversation.lastMessage) { return 'PROBLEM' }
      return props.conversation.lastMessage.status.status
    })

    const title = computed(() => {
      if (props.conversation.isBroadcast && props.conversation.title) {
        return props.conversation.title
      }
      if (!otherParticipant.value) { return '' }
      const { firstName, lastName } = otherParticipant.value.profile
      return `${firstName} ${lastName}`
    })

    const firstName = computed(() => {
      if (!otherParticipant.value) { return '' }
      const { firstName } = otherParticipant.value.profile
      return firstName
    })

    const lastMessageText = computed(() => {
      const { lastMessage } = props.conversation
      if (!lastMessage) { return '' }
      return lastMessage.text
    })

    const lastMessageType = computed(() => {
      const { lastMessage } = props.conversation
      if (!lastMessage) { return 'TEXT' }
      return getMessageType(lastMessage)
    })

    const unreadMessagesCount = computed(() => {
      return props.conversation.unreadMessagesCount
    })

    const typingSession = computed(() => {
      const existingSession = typingSessions.value.find(ts => ts.conversationId === props.conversation.id)
      return existingSession
    })

    const typingIndicatorText = computed(() => {
      if (!typingSession.value) { return '' }
      const { profileId } = typingSession.value
      const typingProfile = props.conversation.participants.find(p => p.profile.id === profileId)
      if (!typingProfile) { return '' }

      switch (typingSession.value.mediaType) {
      case MediaType.PICTURE:
        return t('messages.uploading-image', { firstName: typingProfile.profile.firstName }).toString()
      case MediaType.VIDEO:
        return t('messages.uploading-video', { firstName: typingProfile.profile.firstName }).toString()
      case MediaType.AUDIO:
        return t('messages.recording-audio', { firstName: typingProfile.profile.firstName }).toString()
      default:
        return t('messages.typing', { firstName: typingProfile.profile.firstName }).toString()
      }
    })

    return {
      conversationUrl,
      currentConversation,
      firstName,
      lastMessageText,
      lastMessageType,
      isActive,
      isRejectedByOpponent,
      isWaitingYourApproval,
      title,
      MessageStatus,
      MessageType,
      otherParticipant,
      profileId,
      searchKeyword,
      status,
      typingIndicatorText,
      typingSession,
      typingSessions,
      unreadMessagesCount,
    }
  }
})
</script>

<style lang="scss" scoped>
.conversation-item {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  color: black;
  padding: 1rem 1.5rem;
  cursor: pointer;
  overflow: hidden;
  flex-shrink: 0;

  &:hover:not(.conversation-item--active) {
    background: #f8f8f8;
  }

  &:active, &--active:not(.conversation-item--unread) {
    background: white;
    box-shadow: 12px 0px 20px rgba(0, 0, 0, 0.14);
    border-radius: 0 3px 3px 0;

  }

  &:hover, &:active, &--active:not(.conversation-item--unread) {
    .conversation-item__bubble {
      background: white;
      color: $colorRed;
    }
  }

  &--unread {
    .conversation-item__subtitle, .conversation-item__name {
      color: black;
      font-weight: bold;
    }
  }
}

.conversation-item__avatar {
  margin-right: 15px;
}

.rtl-at-root .conversation-item__avatar {
  margin-left: 15px;
  margin-right: unset;
}

.conversation-item__content {
  flex: 1 1 auto;
  overflow: hidden;
}

.conversation-item__title {
  display: flex;
  min-height: 1rem;
}

.conversation-item__name {
  flex: 1;
  display: flex;
  align-items: center;
  font-weight: normal;
  @include ellipsis(1, 16px, 18px);
}

.conversation-item__broadcast-icon {
  color: $colorRed;
  margin-right: 5px;
}

.conversation-item__date {
  margin-left: 10px;
  font-size: 12px;
  color: $colorGrey
}

.rtl-at-root {
  .conversation-item__broadcast-icon {
    margin-left: 5px;
  }

  .conversation-item__date {
    margin-left: unset;
    margin-right: 10px;
  }
}

.conversation-item__subtitle {
  display: flex;
  overflow: hidden;
}

.conversation-item__typing {
  font-size: 12px;
  color: $colorRed;
}

.conversation-item__text {
  flex: 1;
  display: flex;
  align-items: center;
  overflow: hidden;

  span {
    margin-left: 5px;
    overflow: hidden;
    @include ellipsis(1, 12px, 18px);
  }
}

.rtl-at-root {
  .conversation-item__text {
    span {
      margin-left: unset;
      margin-right: 5px;
    }
  }
}

.conversation-item__last-message {
  display: flex;
  flex-direction: row;
  align-items: center;
  color: $colorGrey;

  span {
    margin-left: 5px;
    overflow: hidden;
    @include ellipsis(1, 12px, 18px);
    color: $colorText;
  }

  svg {
    width: .8rem;
    height: .8rem;
  }
  .conversation-item__read {
    color: #28a745;
  }
}

.rtl-at-root {
  .conversation-item__last-message {
    span {
      margin-left: unset;
      margin-right: 5px;
    }
  }
}

.conversation-item__bubble {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: $colorRed;
  color: white;
  font-size: 10px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
