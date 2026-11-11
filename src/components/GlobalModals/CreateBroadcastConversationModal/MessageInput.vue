<template>
  <div class="message-input">
    <div
      v-if="activeProfile"
      class="message-input__body"
    >
      <MessageInputTextarea
        ref="textareaRef"
        v-model="content"
        class="message-input__text"
        :class="{ 'message-input__text--animate-color': showAnimation }"
        :placeholder="placeholder"
      />
    </div>
    <WebScrapedEditor
      :content="content"
      @web-scraped="webScraped = $event"
    />
    <div
      v-if="attachmentDataUrl"
      class="message-input__attachment"
    >
      <BImg
        v-if="attachmentMediaType === MediaType.PICTURE"
        :src="attachmentDataUrl"
        class="message-input__preview-img"
      />
      <video 
        v-else-if="attachmentMediaType === MediaType.VIDEO" 
        class="message-input__preview-video"
        controls
      >
        <source :src="attachmentDataUrl" />
      </video>
      <button
        class="btn btn-primary btn-edit"
        @click="onEditAttachment"
      >
        <FaIcon
          :icon="['fal', 'pencil-alt']"
          class="icon"
        />
      </button>
      <button
        class="btn btn-primary btn-close"
        @click="onClearAttachment"
      >
        <FaIcon
          :icon="['fas', 'times']"
          class="icon"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import WebScrapedEditor from '@/components/WebScraped/WebScrapedEditor.vue'
import { storeKey } from '@/store'
import { MediaType, type Picture, type WebScrapedLarge } from '@/types'
import { getMediaType } from '@/utils'

import MessageInputTextarea from './MessageInputTextarea.vue'

export default defineComponent({
  name: 'Messageinput',
  components: {
    MessageInputTextarea,
    WebScrapedEditor
  },
  props: {
    attachment: {
      type: File,
      default: null,
    },
    modelValue: {
      type: String,
      default: ''
    }
  },
  emits: ['update:modelValue', 'edit-picture', 'clear-attachment'],
  setup(props, context) {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const editableFeed = computed(() => store.state.feed.editableFeed)
    const content = computed({
      get: () => props.modelValue,
      set: (val: string) => context.emit('update:modelValue', val)
    })
    const placeholder = computed(() => {
      if (!activeProfile.value) { return '' }
      return t(
        'conversations.create-broadcast-conversation-modal.type-your-message',
        { name: activeProfile.value.firstName }
      ).toString()
    })
    const webScraped = ref<WebScrapedLarge | null>(null)
    const attachmentDataUrl = ref<string | ArrayBuffer | null>(null)
    const showAnimation = ref<boolean>(false)
    const textareaRef = ref<(typeof MessageInputTextarea & { focusToEndWithDelay: () => void }) | null>(null)

    const attachmentMediaType = computed(() => {
      // use file attachment that user selects
      if (props.attachment) {
        return getMediaType(props.attachment)
      }
      return null
    })

    const onEditAttachment = () => {
      // Generate Picture item to be used as editingItem prop for UploadPictureModal
      let editPictureItem: Picture | null = null
      if (props.attachment) {
        editPictureItem = {
          id: '',
          original: attachmentDataUrl.value as string,
          medium: '',
          large: ''
        }
      }
      context.emit('edit-picture', editPictureItem)
    }

    const onClearAttachment = () => {
      if (props.attachment) {
        context.emit('clear-attachment')
      }
      attachmentDataUrl.value = null
    }

    watch(() => props.attachment, () => {
      if (props.attachment) {
        attachmentDataUrl.value = window.URL.createObjectURL(props.attachment)
        if (textareaRef.value) {
          const component = textareaRef.value
          component.focusToEndWithDelay && component.focusToEndWithDelay()
        }
        showAnimation.value = true
        setTimeout(() => {
          showAnimation.value = false
        }, 2000)
      } else {
        attachmentDataUrl.value = null
      }
    }, { immediate: true })
    
    onMounted(() => {
      if (textareaRef.value) {
        const component = textareaRef.value
        component.focusToEndWithDelay && component.focusToEndWithDelay()
      }
    })

    return {
      activeProfile,
      attachmentDataUrl,
      attachmentMediaType,
      content,
      editableFeed,
      MediaType,
      onClearAttachment,
      onEditAttachment,
      placeholder,
      showAnimation,
      textareaRef,
      webScraped,
    }
  }
})
</script>

<style lang="scss" scoped>
.message-input {
  background: white;
}

.message-input__content {
  flex: 1;
  margin-top: 2px;
  min-height: 150px;
  border-radius: 10px;
  overflow: auto;
  max-height: 600px;
  border-radius: 0;
}

.message-input__attachment {
  margin-top: 1rem;
  position: relative;
  text-align: center;
}

.message-input__preview-img {
  max-width: 40vh;
}

.message-input__preview-video {
  max-width: 40vh;
  object-fit: cover;
}

.btn {
  padding: 8px;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  line-height: 1rem;
}

.btn-edit {
  position: absolute;
  top: 0.5rem;
  right: 3rem;
}

.btn-close {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.icon {
  width: 1rem;
  height: 1rem;
}

@media (max-width: $mobileMaxWidth) {
  .message-input__content {
    font-size: .9rem;
  }
}

.rtl-at-root {
  .btn-edit {
    right: unset;
    left: 3rem;
  }

  .btn-close {
    right: unset;
    left: 0.5rem;
  }
}

.message-input__text--animate-color {
  background-image: linear-gradient(
      -225deg,
      grey 0%,
      #44107a 29%,
      $colorRed 67%,
      #fff800 100%
  );
  background-size: 200% auto;
  background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  animation: textclip 1.5s ease;
  animation-delay: 100ms;
  background-position: 200% center;
}

@keyframes textclip {
  0% {
    background-position: 200% center;
  }
  100% {
    background-position: 100% center;
  }
}
</style>
