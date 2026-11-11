<template>
  <div class="message-control">
    <div
      v-if="showPrivateIndicator"
      class="message-control__private-indicator"
    >
      <FaIcon :icon="['far', 'message-quote']" />
      <span>{{ privateIndicatorMessage }}</span>
    </div>
    <div class="message-control__upload">
      <button
        :id="`btn-add-emoji-${currentConversation.id}`"
        class="btn btn-iconed"
      >
        <FaIcon
          class="icon"
          :icon="['fal', 'smile']"
          :style="{ color: '#666666' }"
        />
      </button>
      <EmojiPopover
        :target="`btn-add-emoji-${currentConversation.id}`"
        hover
        @select="onAddEmoji"
      />
    </div>

    <div class="message-control__upload">
      <button
        :id="`btn-upload-picture-${currentConversation.id}`"
        class="btn btn-iconed"
        :disabled="audioActive"
        @click="onUploadPictureModal"
      >
        <FaIcon
          class="icon"
          :icon="['fal', 'camera']"
          :style="{ color: '#666666' }"
        />
      </button>
      <BTooltip
        :target="`btn-upload-picture-${currentConversation.id}`"
        triggers="hover"
      >
        {{ $t('messages.upload-image') }}
      </BTooltip>
    </div>

    <div class="message-control__upload">
      <button
        :id="`btn-upload-video-${currentConversation.id}`"
        class="btn btn-iconed"
        :disabled="audioActive"
        @click="onUploadVideoModal"
      >
        <FaIcon
          class="icon"
          :icon="['fal', 'video']"
          :style="{ color: '#666666' }"
        />
      </button>
      <BTooltip
        :target="`btn-upload-video-${currentConversation.id}`"
        triggers="hover"
      >
        {{ $t('messages.upload-video') }}
      </BTooltip>
    </div>

    <div class="message-control_text-section">
      <span
        v-if="!audioActive"
        ref="contentRef"
        contenteditable
        :placeholder="placeholder"
        class="input message-control__text pull-if-rtl-label"
        role="textbox"
        @input="onTyping"
        @keydown.enter.stop="onEnter"
      />
      <div
        v-else
        class="message-control__volume-meter-container"
      >
        <AudioVolumeMeter
          :is-recording="audioActive"
          class="message-control__volume-meter"
        />
      </div>
      <AudioRecorder
        :active="audioActive"
        class="message-control__audio"
        @update:active="audioActive = $event"
        @permission-error="onAudioPermissionError"
        @completed="uploadAudio"
      />
    </div>

    <button
      type="button"
      class="btn btn-iconed btn-sm message-control__send"
      :disabled="sendButtonDisabled"
      @click="sendMessage"
    >
      <FaIcon
        :icon="['far', 'paper-plane']"
        :style="{ color: '#FFFFFF' }"
      />
    </button>

    <!-- <div class="message-control__footer">
      <template v-if="typingSession">
        <typing-indicator class="message-control__typing">
          <span class="pull-if-rtl-label">{{ typingIndicatorText }}</span>
        </typing-indicator>
      </template>
    </div> -->

    <UploadPictureModal
      :upmid="`mc-upload-picture-${currentConversation.id}`"
      :title="$t('messages.upload-image')"
      :type="MediaSubType.MESSAGE"
      @submit="addPicture"
      @hidden="clearMessageTypingInterval"
    />
    <UploadVideoModal
      :id="`mc-upload-video-${currentConversation.id}`"
      :title="$t('messages.upload-video')"
      @submit="addVideo"
      @hidden="clearMessageTypingInterval"
    />
  </div>
</template>

<script lang="ts">
import { throttle } from 'lodash'
import { computed, defineComponent, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import AudioRecorder from '@/components/Common/AudioRecorder/AudioRecorder.vue'
import AudioVolumeMeter from '@/components/Common/AudioRecorder/AudioVolumeMeter.vue'
import EmojiPopover from '@/components/Common/EmojiPopover.vue'
// import TypingIndicator from '@/components/Common/TypingIndicator.vue'
import UploadPictureModal from '@/components/Common/UploadPictureModal.vue'
import UploadVideoModal from '@/components/Common/UploadVideoModal.vue'
import { useModal, useToast } from '@/composables'
import { storeKey } from '@/store'
import {
  MediaSubType,
  MediaType,
  MessageType
} from '@/types'
import { getBasicScrapedData, MESSAGE_TYPING_THROTTLE_WAIT } from '@/utils'

/**
 * Component to render the message control to send text/image/audio
 */
export default defineComponent({
  name: 'MessageControl',
  components: {
    AudioRecorder,
    AudioVolumeMeter,
    EmojiPopover,
    // TypingIndicator,
    UploadPictureModal,
    UploadVideoModal
  },
  setup() {
    const { t } = useI18n()
    const modal = useModal()
    const store = useStore(storeKey)
    const { showErrorToast } = useToast()
    const activeProfileId = computed(() => store.state.auth.profileId!)
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const currentConversation = computed(() => store.state.message.currentConversation!)
    const typingSessions = computed(() => store.state.message.typingSessions)
    const message = ref<string>('')
    const audioActive = ref<boolean>(false)
    const messageSendLoading = ref<boolean>(false)
    const contentRef = ref<HTMLTextAreaElement | null>(null)
    const typingInterval = ref<number | undefined>(undefined)
    const placeholder = computed(() => {
      if (!activeProfile.value) { return '' }
      return t('messages.type-your-message', { name: activeProfile.value.firstName }).toString()
    })
    const sendButtonDisabled = computed(() => !message.value || audioActive.value)
    const typingSession = computed(() => {
      const existingSession = typingSessions.value.find(ts => ts.conversationId === currentConversation.value.id)
      return existingSession
    })
    const typingIndicatorText = computed(() => {
      if (!typingSession.value) { return '' }
      const { profileId } = typingSession.value
      const typingProfile = currentConversation.value.participants.find(p => p.profile.id === profileId)
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
    const showPrivateIndicator = computed(() => {
      const conversation = currentConversation.value
      return conversation.isBroadcast &&
        conversation.initiator &&
        conversation.initiator.id !== activeProfileId.value
    })
    const privateIndicatorMessage = computed(() => {
      const conversation = currentConversation.value
      if (!conversation.initiator) {
        return ''
      }
      return t(
        'messages.private-indicator',
        { name: conversation.initiator.firstName }
      )
    })

    const setTextareaFocus = () => {
      if (!contentRef.value) { return }
      contentRef.value.focus()
    }

    const focusToEndWithDelay = () => {
      if (!contentRef.value) { return }
      focusToEnd(contentRef.value)
    }

    const focusToEnd = (el: Node) => {
      if (!el) {return}

      const range = document.createRange()
      const sel = window.getSelection()
      const textNode = el.childNodes[0] as Text

      if (!textNode) {
        range.setStart(el, 0)
      } else {
        range.setStart(textNode, textNode.length)
      }
      range.collapse(true)

      if (sel) {
        sel.removeAllRanges()
        sel.addRange(range)
      }
    }

    const sendMessageTyping = async (mediaTypeIsTyping: MediaType | null = null) => {
      await store.dispatch('message/sendUserIsTyping', mediaTypeIsTyping)
    }

    const sendMessageTypingThrottled = computed(() => throttle(
      sendMessageTyping, MESSAGE_TYPING_THROTTLE_WAIT,
      { trailing: true }
    ))

    const setMessageTypingInterval = (mediaType: MediaType | null = null) => {
      typingInterval.value = window.setInterval(() => {
        sendMessageTypingThrottled.value(mediaType)
      }, MESSAGE_TYPING_THROTTLE_WAIT)
    }

    const clearMessageTypingInterval = () => {
      if (typingInterval.value) {
        window.clearInterval(typingInterval.value)
      }
    }

    const onTyping = () => {
      if (!contentRef.value) { return }
      message.value = contentRef.value.innerText
      sendMessageTypingThrottled.value()
    }

    const onUploadPictureModal = () => {
      modal.show(`mc-upload-picture-${currentConversation.value.id}`)
      setMessageTypingInterval(MediaType.PICTURE)
    }

    const onUploadVideoModal = () => {
      modal.show(`mc-upload-video-${currentConversation.value.id}`)
      setMessageTypingInterval(MediaType.VIDEO)
    }

    const onAddEmoji =(emoji: any) => {
      if (!contentRef.value) { return }
      message.value += emoji['i']
      contentRef.value.innerText = message.value
    }

    const onEnter = async (evt: KeyboardEvent) => {
      if (evt.shiftKey || evt.altKey) {
        return
      }
      evt.preventDefault()
      await sendMessage()
    }

    const sendMessage = async () => {
      if (!message.value || messageSendLoading.value) { return }
      messageSendLoading.value = true
      try {
        await store.dispatch('message/sendMessage', {
          conversationId: currentConversation.value.id,
          text: message.value,
          webScraped: await getBasicScrapedData(store, message.value)
        })

        message.value = ''
        if (contentRef.value) {
          contentRef.value.innerText = ''
        }
        store.commit('message/SET_MESSAGE_LIST_SCROLL_TO_BOTTOM', true)
      } finally {
        messageSendLoading.value = false
      }
    }

    const addPicture = async (file: File) => {
      await uploadMedia(file, MessageType.IMAGE)
      clearMessageTypingInterval()
    }

    const addVideo = async (input: { file: File }) => {
      const { file } = input
      await uploadMedia(file, MessageType.VIDEO)
      clearMessageTypingInterval()
    }

    const uploadAudio = async (file: File) => {
      if (messageSendLoading.value) {
        return
      }

      messageSendLoading.value = true
      try {
        const { error } = await store.dispatch('message/uploadMedia', {
          conversationId: currentConversation.value.id,
          file,
          messageType: 'AUDIO'
        })
        if (error) {
          throw error
        }
      } finally {
        messageSendLoading.value = false
      }
    }

    const uploadMedia = async (file: File, messageType: MessageType.IMAGE | MessageType.VIDEO) => {
      nextTick(() => {
        message.value = ''
      })
      const { error } = await store.dispatch('message/uploadMedia', {
        conversationId: currentConversation.value.id,
        file,
        text: message.value,
        messageType
      })
      if (error) {
        throw error
      }
    }

    const onAudioPermissionError = () => {
      showErrorToast(
        t('messages.microphone-permission-error-title').toString(),
        t('messages.microphone-permission-error').toString()
      )
    }

    watch(audioActive, () => {
      if (audioActive.value) {
        setMessageTypingInterval(MediaType.AUDIO)
      } else {
        clearMessageTypingInterval()
      }
    })

    onMounted(() => {
      setTextareaFocus()
    })

    onBeforeUnmount(() => {
      window.clearInterval(typingInterval.value)
    })

    return {
      activeProfile,
      activeProfileId,
      addPicture,
      addVideo,
      audioActive,
      clearMessageTypingInterval,
      contentRef,
      currentConversation,
      focusToEnd,
      focusToEndWithDelay,
      MediaSubType,
      message,
      messageSendLoading,
      onAddEmoji,
      onAudioPermissionError,
      onEnter,
      onTyping,
      onUploadPictureModal,
      onUploadVideoModal,
      placeholder,
      privateIndicatorMessage,
      sendButtonDisabled,
      sendMessage,
      sendMessageTyping,
      setMessageTypingInterval,
      setTextareaFocus,
      showPrivateIndicator,
      typingIndicatorText,
      typingInterval,
      typingSession,
      typingSessions,
      uploadAudio,
      uploadMedia,
    }
  }
})
</script>

<style lang="scss" scoped>
.message-control {
  position: relative;
  display: flex;
  padding: 28px 50px;
  align-items: center;
  background: #E8E8E8;
}

.message-control__private-indicator {
  position: absolute;
  top: 8px;
  left: 30px;
  display: flex;
  align-items: center;
  color: $colorSecondary;
  font-size: 12px;

  span {
    margin-left: 4px;
  }
}

.message-control__upload {
  position: relative;
  width: 34px;
  height: 34px;
  cursor: pointer;
  margin-right: 8px;

  input {
    position: absolute;
    left: 0;
    width: 30px;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    z-index: 9;

    &::-webkit-file-upload-button {
      cursor: pointer;
    }
  }

  button {
    width: 100%;
    height: 100%;
    padding: 0;
    border-radius: 50%;
    background: #F5F5F5;
  }

  icon {
    color: #666666
  }
}

.message-control_text-section {
  flex: 1;
  position: relative;
  background: #FFFFFF;
  border: 1px solid #D3D3D3;
  box-sizing: border-box;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.05);
  border-radius: 18px;
  align-items: center;
}

.message-control__volume-meter-container {
  flex: 1;
  padding: 2px 64px 2px 18px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.message-control__volume-meter {
  height: 32px;
}

.message-control__text {
  width: 100%;
  background: transparent;
  outline: none;
  border: none;
  font-size: 14px;
  line-height: 16px;
  padding: 10px 18px;
  display: inline-block;
  white-space: pre-wrap;

  &:empty:before {
    content: attr(placeholder);
    width: inherit;
    height: inherit;
    color: grey;
    display: block;
  }
}

.message-control__audio {
  position: absolute;
  right: 18px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  margin-left: 4px;
}

@keyframes pulse {
  to {
    opacity: 0.75;
  }
}

.message-control__send {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: $colorRed;
  margin-left: 8px;
}

.rtl-at-root {
  .message-control__upload {
    input {
      left: auto;
      right: 0;
    }
  }
  .message-control__audio {
    left: 18px;
    right: auto;
    margin-left: 0;
    margin-right: 4px;
  }
  .message-control__send {
    margin-left: 0;
    margin-right: 8px;
  }
}
</style>
