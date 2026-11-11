<template>
  <RouterLink
    class="conversation-item animated fadeIn"
    :class="{
      'conversation-item--active': isActive,
      'conversation-item--unread': unreadMessagesCount > 0,
      'conversation-item--sent': status === 'SENT',
      'conversation-item--problem': status === 'PROBLEM'
    }"
    :to="`/messages/broadcast/${conversation.id}`"
  >
    <div class="conversation-item__icon">
      <FaIcon :icon="['fal', 'megaphone']" />
    </div>

    <div class="conversation-item__content">
      <div class="conversation-item__title">
        <div class="conversation-item__name pull-if-rtl-label">
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
        <template v-if="conversation.lastMessage">
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
import { useStore } from 'vuex'

import AgoString from '@/components/Common/AgoString.vue'
import TextHighlighter from '@/components/Common/TextHighlighter.vue'
import { storeKey } from '@/store'
import {
  type Conversation,
  MessageStatus,
  MessageType} from '@/types'
import { getMessageType } from '@/utils'

/**
 * Component to render each conversation item.
 */
export default defineComponent({
  name: 'BroadcastConversationListItem',
  components: { AgoString, TextHighlighter },
  props: {
    conversation: {
      type: Object as () => Conversation,
      required: true,
    },
  },
  setup(props) {
    const store = useStore(storeKey)
    const searchKeyword = computed(() => store.state.message.conversationsSearch)
    const currentConversation = computed(() => store.state.message.currentConversation)
    const profileId = computed(() => store.state.auth.profileId!)

    const title = computed(() => {
      if (props.conversation.initiator?.id === profileId.value) {
        return `${props.conversation.title} (${props.conversation.participants.length - 1} Participants)`
      }
      return props.conversation.title
    })
    const isActive = computed(() => {
      return currentConversation.value && props.conversation.id === currentConversation.value.id
    })

    const status = computed(() => {
      if (!props.conversation.lastMessage) { return 'PROBLEM' }
      return props.conversation.lastMessage.status.status
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

    return {
      currentConversation,
      lastMessageText,
      lastMessageType,
      isActive,
      MessageStatus,
      MessageType,
      profileId,
      searchKeyword,
      status,
      title,
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

.conversation-item__icon {
  min-width: 45px;
  min-height: 45px;
  max-width: 45px;
  max-height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  color: $colorRed;
  background: $colorLightGrey2;
  margin-right: 15px;
}

.rtl-at-root .conversation-item__icon {
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
  font-weight: normal;
  @include ellipsis(1, 16px, 18px);
}

.conversation-item__date {
  margin-left: 10px;
  font-size: 12px;
  color: $colorGrey
}

.rtl-at-root {
  .conversation-item__date {
    margin-left: unset;
    margin-right: 10px;
  }
}

.conversation-item__subtitle {
  display: flex;
  overflow: hidden;
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
