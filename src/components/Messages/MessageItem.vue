<template>
  <li
    v-observe-visibility="observeOptions"
    class="message-item-wrapper"
    :class="{
      'message-item__wrapper-other': isOtherMessage,
      'message-item__wrapper-non-text': isNonTextMessage,
    }"
  >
    <div
      class="message-item"
      :class="{
        'message-item__other': isOtherMessage,
        'message-item__non-text': isNonTextMessage
      }"
    >
      <div class="message-item__content">
        <div
          v-if="showSender"
          class="message-item__sender"
        >
          <ProfileAvatar
            class="message-item__sender-avatar"
            thumbnail="small"
            linkable
            :profile="data.sender"
          />
          <ProfileLinkableName
            class="message-item__sender-name"
            :profile="data.sender"
          />
        </div>
  
        <div
          v-if="text"
          class="message-item__text pull-if-rtl-label"
          v-html="text"
        />
  
        <div
          v-if="messageType === MessageType.IMAGE"
          class="message-item__image"
        >
          <MessageItemImage
            :message="data"
            @open-image="$emit('open-image', $event)"
          />
        </div>
  
        <div
          v-else-if="messageType === MessageType.VIDEO"
          class="message-item__video"
        >
          <MessageItemVideo :message="data" />
        </div>
  
        <div
          v-else-if="messageType === MessageType.AUDIO"
          class="message-item__audio"
        >
          <MessageItemAudio :attachment="audioAttachment" />
        </div>

        <WebScrapedRendererBasic :web-scraped="data.webScraped" />

        <div class="message-item__read-status">
          <FaIcon
            v-if="!isOtherMessage"
            :icon="['fas', 'check']"
            :class="{'message-item__read': isRead}"
          />
    
          <div
            v-if="data.date"
            class="message-item__date pull-if-rtl-label"
          >
            <AgoString :date="data.date" />
          </div>
        </div>
      </div>
      <div
        v-if="reactions"
        class="message-item__reactions"
      >
        <div
          v-for="reaction in reactions"
          :key="reaction.id"
          class="message-item__reaction"
        >
          {{ reaction.reaction }}
        </div>
      </div>
    </div>

    <div class="message-item__actions">
      <div
        v-if="showOverlay"
        class="message_item__action-btn"
      >
        <MessageItemOverlay
          :message="data"
          @delete="$emit('delete')"
          @info="$emit('info')"
        />
      </div>
      <button
        :id="`btn-add-emoji-${messageId}`"
        class="message_item__action-btn"
      >
        <FaIcon
          v-b-tooltip.hover="$t('messages.react')"
          class="icon"
          :icon="['fal', 'smile']"
        />
      </button>
      <EmojiPopover
        click
        :target="`btn-add-emoji-${messageId}`"
        @select="onAddEmoji"
      />
    </div>
  </li>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import AgoString from '@/components/Common/AgoString.vue'
import EmojiPopover from '@/components/Common/EmojiPopover.vue'
import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import ProfileLinkableName from '@/components/Common/ProfileLinkableName.vue'
import WebScrapedRendererBasic from '@/components/WebScraped/WebScrapedRendererBasic.vue'
import { storeKey } from '@/store'
import { type Message, MessageStatus, MessageType } from '@/types'
import { getMessageType, replaceTextNewLineWithBr } from '@/utils'

import MessageItemAudio from './MessageItemAudio.vue'
import MessageItemImage from './MessageItemImage.vue'
import MessageItemOverlay from './MessageItemOverlay.vue'
import MessageItemVideo from './MessageItemVideo.vue'

export default defineComponent({
  name: 'MessageItem',
  components: {
    AgoString,
    EmojiPopover,
    MessageItemAudio,
    MessageItemVideo,
    MessageItemImage,
    MessageItemOverlay,
    ProfileAvatar,
    ProfileLinkableName,
    WebScrapedRendererBasic,
  },
  props: {
    data: {
      type: Object as () => Message,
      required: true,
    },
  },
  emits: ['delete', 'info', 'visible', 'add-emoji', 'open-image'],
  setup(props, context) {
    const store = useStore(storeKey)
    const activeProfileId = computed(() => store.state.auth.profileId)
    const conversation = computed(() => store.state.message.currentConversation)

    /**
     * If id is empty, that means it's temporary generated message for audio, video and picture.
     * Should use internalId for a while.
     * If id has a value, this is a real message from server
     */
    const messageId = computed(() => {
      return props.data.id || props.data.internalId
    })

    const isOtherMessage = computed(() => {
      return props.data.sender.id !== activeProfileId.value
    })

    const showOverlay = computed(() => {
      return !isOtherMessage.value ||
        (
          conversation.value?.isBroadcast &&
          conversation.value?.initiator?.id === activeProfileId.value
        )
    })

    const showSender = computed(() => {
      return isOtherMessage.value &&
        conversation.value?.isBroadcast &&
        conversation.value?.initiator?.id === activeProfileId.value
    })

    const isNonTextMessage = computed(() => {
      const nonTextMessageTypes: MessageType[] = [MessageType.AUDIO, MessageType.IMAGE, MessageType.VIDEO]
      return nonTextMessageTypes.includes(messageType.value) && !props.data.text
    })

    const messageType = computed(() => {
      return getMessageType(props.data)
    })

    const text = computed(() => {
      return replaceTextNewLineWithBr(props.data.text)
    })

    const audioAttachment = computed(() => {
      if (messageType.value !== 'AUDIO') { return null }
      return props.data.attachments && props.data.attachments[0]
    })

    const observeOptions = computed(() => {
      if (props.data.status.status === MessageStatus.READ) { return }
      return {
        callback: onVisibilityChanged,
        throttle: 300,
        throttleOptions: {
          leading: 'visible'
        }
      }
    })

    const isRead = computed(() => {
      return props.data.status.status === MessageStatus.READ
    })

    const hasReactions = computed(() => {
      return (props.data.reactions || []).length > 0
    })

    const reactions = computed(() => {
      return props.data.reactions
    })

    const onAddEmoji = (emoji: any) => {
      context.emit('add-emoji', messageId.value, emoji['i'])
    }

    const onVisibilityChanged = (isVisible: boolean) => {
      if (isVisible) {
        context.emit('visible', props.data)
      }
    }

    return {
      audioAttachment,
      isNonTextMessage,
      isOtherMessage,
      isRead,
      messageId,
      MessageType,
      messageType,
      observeOptions,
      onVisibilityChanged,
      showSender,
      showOverlay,
      text,
      hasReactions,
      reactions,
      onAddEmoji
    }
  }
})
</script>

<style lang="scss" scoped>
.message-item-wrapper {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  width: 100%;
  margin-bottom: 30px;
  clear: both;
  list-style-type: none;

  &:hover .message-item__actions {
    opacity: 1;
    transition: opacity 300ms linear;
  }
}

.message-item__wrapper-other {
  flex-direction: row;
}

.message-item__wrapper-non-text {
  margin-bottom: 40px;
}

.message-item {
  color: black;
  max-width: 55%;
  min-width: 200px;
  position: relative;
  display: flex;
  flex-direction: column;
  padding-left: 0px;
  padding-right: 4px;

  &:after {
    content: " ";
    position: absolute;
    top: 10px;
    right: 0px;
    left: unset;
    height: 0;
    width: 0;
    border-top: 12px solid $colorMessaging;
    border-left: 12px solid $colorMessaging;
    pointer-events: none;
    transform: rotateZ(45deg);
  }

  .message-item__content {
    background: $colorMessaging;
  }
}

.message-item__non-text {
  padding-left: 0px;
  padding-right: 0px;

  &:after {
    display: none;
  }

  .message-item__content {
    padding: 0;
    background: transparent !important;
  }

  .message-item__read-status {
    bottom: -20px;
  }
}

.message-item__other {
  align-self: flex-start;
  padding-left: 4px;
  padding-right: 0px;

  &:after {
    left: 0px;
    right: unset;
    border-color: #EBEBEB;
  }

  .message-item__content {
    background: #EBEBEB;
  }
}

.message-item__sender {
  text-align: left;
}

.message-item__content {
  position: relative;
  background: $colorMessaging;
  border-radius: 6px;
  padding: 12px 18px 24px;
  font-size: 14px;
  line-height: 20px;
}

.message-item__sender {
  position: absolute;
  top: -20px;
  left: 0;
  display: flex;
  align-items: center;
}

.message-item__sender-avatar {
  margin-right: 5px;
}

.message-item__sender-name {
  padding-bottom: 5px;
}

.message-item__text {
  word-break: break-word;
}

.message-item__audio,
.message-item__image,
.message-item__video {
  max-width: 100%;
  width: 300px;
}

.message-item__reactions {
  z-index: 1;
  position: absolute;
  bottom: -1.3rem;
  left: 18px;
  display: flex;
  flex-direction: row;
  align-items: center;

  .message-item__reaction {
    background: rgba(255, 255, 255, 1);
    border: 1px solid #EEEEEE;
    border-radius: 8px;
    padding: 4px;
  }
}

.message-item__actions {
  background: rgba(255, 255, 255, 1);
  border: 1px solid $colorBorder;
  border-radius: 15px;
  margin: 0 10px;
  opacity: 0;
  z-index: 1;
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 0 0.2rem;
  overflow: hidden;

  .message_item__action-btn {
    width: 30px;
    height: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0;
    border: none;
    background: transparent;
    cursor: pointer;
    color: $colorGrey;
    transition: color 300ms linear;
    outline: none;

    &:hover, &:active {
      color: $colorText;
      background: $colorBackground;
      outline: none;
    }

    svg:focus {
      outline: none;
    }
  }
}

.message-item__read-status {
  position: absolute;
  bottom: 2px;
  right: 6px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  font-size: 12px;
  line-height: 20px;
  color: #666666;
}

.message-item__date {
  margin-left: 5px;
}

.message-item__read {
  color: #28a745;
}

.rtl-at-root {
  .message-item {
    padding-left: 4px;
    padding-right: 0;

    &:after {
      left: 0px;
      right: unset;
      border-left: unset;
      border-right: 12px solid $colorMessaging;
    }
  }
  .message-item__other {
    padding-left: 0;
    padding-right: 4px;

    &:after {
      left: unset;
      right: 0px;
    }
  }
  .message-item__read-status {
    margin-left: unset;
    margin-right: 16px;
  }
  .message-item__date {
    margin-left: 0;
    margin-right: 5px;
  }
}
</style>
