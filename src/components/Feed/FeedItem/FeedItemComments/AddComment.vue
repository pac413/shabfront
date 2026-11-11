<template>
  <div
    v-if="activeProfile"
    class="add-comment d-flex flex-wrap"
  >
    <ProfileAvatar
      class="me-2 mt-2"
      size="3em"
      thumbnail="medium"
      :profile="activeProfile"
    />
    <speech-bubble
      class="add-comment__speech-bubble"
      :arrow-top="true"
    >
      <div class="add-comment_content">
        <div
          ref="comment"
          class="contenteditable add-comment__contenteditable"
          contenteditable
          :placeholder="$t('feed.comments.write-comment-placeholder')"
          @keydown.enter.prevent="submit"
        />
        <div
          v-if="attachment"
          class="add-comment_comment-media"
        >
          <BImg
            v-if="attachmentMediaType === MediaType.PICTURE"
            lazy
            :src="attachmentObjectUrl"
          />
          <video 
            v-else-if="attachmentMediaType === MediaType.VIDEO" 
            controls
          >
            <source :src="attachmentObjectUrl" />
          </video>
          <div
            class="add-comment_close-media"
            @click="clearAttachment"
          >
            <FaIcon :icon="['fas', 'times']" />
          </div>
        </div>
      </div>
      <div class="add-comment__comment-buttons">
        <button
          :id="`btn-add-emoji-${addCommentId}`"
          tabindex="0"
          class="btn"
        >
          <FaIcon
            class="icon"
            :icon="['fal', 'smile']"
          />
        </button>
        <EmojiPopover
          :target="`btn-add-emoji-${addCommentId}`"
          hover
          @select="onAddEmoji"
        />
        <button
          v-b-tooltip.hover="$t('feed.comments.attach-photo')"
          class="btn"
          @click="openUploadPictureModal"
        >
          <FaIcon
            class="icon"
            :icon="['fal', 'camera']"
          />
        </button>
        <button
          v-b-tooltip.hover="$t('feed.comments.attach-video')"
          class="btn"
          @click="openUploadVideoModal"
        >
          <FaIcon
            class="icon"
            :icon="['fal', 'video']"
          />
        </button>
      </div>
    </speech-bubble>
    <span class="add-comment__helper-text">{{ $t('feed.comments.press-enter-to-post') }}</span>
    <upload-picture-modal
      :upmid="`${addCommentId}-ac-upload-picture`"
      :title="$t('post.upload-photo')"
      :type="mediaSubType"
      @submit="addPicture"
    />
    <upload-video-modal
      :id="`${addCommentId}-ac-upload-video`"
      :title="$t('post.upload-video')"
      @submit="addVideo"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

import EmojiPopover from '@/components/Common/EmojiPopover.vue'
import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import SpeechBubble from '@/components/Common/SpeechBubble/SpeechBubble.vue'
import UploadPictureModal from '@/components/Common/UploadPictureModal.vue'
import UploadVideoModal from '@/components/Common/UploadVideoModal.vue'
import { useModal } from '@/composables'
import { storeKey } from '@/store'
import { type MediaSubType,MediaType } from '@/types'
import { getMediaType } from '@/utils'

export default defineComponent({
  name: 'AddComment',
  components: {
    EmojiPopover,
    ProfileAvatar,
    SpeechBubble,
    UploadPictureModal,
    UploadVideoModal
  },
  props: {
    addCommentId: {
      type: String,
      required: true,
    },
    mediaSubType: {
      type: String as () => MediaSubType,
      required: true,
    },
    focusOnInput: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['submit'],
  setup(props, context) {
    const store = useStore(storeKey)
    const modal = useModal()
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const attachment = ref<File | null>(null)
    const comment = ref<HTMLTextAreaElement | null>(null)
    const attachmentMediaType = computed(() => attachment.value ? getMediaType(attachment.value) : null)
    const attachmentObjectUrl = computed(() => attachment.value ? URL.createObjectURL(attachment.value) : null)

    const submit = (event: any) => {
      if ((event.target.textContent && event.target.textContent.length) || attachment.value) {
        context.emit('submit', {
          content: event.target.textContent,
          attachment: attachment.value
        })
        if (comment.value) {
          comment.value.innerHTML = ''
        }
        attachment.value = null
      }
    }

    const onAddEmoji = (emoji: any) => {
      if (!comment.value) { return }
      comment.value.innerText = comment.value.innerText + emoji['i']
    }

    const openUploadVideoModal = () => {
      modal.show(`${props.addCommentId}-ac-upload-video`)
    }

    const openUploadPictureModal = () => {
      modal.show(`${props.addCommentId}-ac-upload-picture`)
    }

    const addPicture = (file: File) => {
      attachment.value = file
      // Hack to force focus contentEditable div
      setTimeout(() => {
        comment.value?.focus()
      }, 500)
    }

    const addVideo = (input: { url: string; file: File }) => {
      const { file } = input
      attachment.value = file
      // Hack to force focus contentEditable div
      setTimeout(() => {
        comment.value?.focus()
      }, 500)
    }

    const clearAttachment = () => {
      attachment.value = null
      nextTick(() => {
        comment.value?.focus()
      })
    }

    onMounted(() => {
      if (comment.value && props.focusOnInput) {
        comment.value.focus()
      }
    })

    return {
      activeProfile,
      addPicture,
      addVideo,
      attachment,
      attachmentMediaType,
      attachmentObjectUrl,
      clearAttachment,
      comment,
      MediaType,
      onAddEmoji,
      openUploadPictureModal,
      openUploadVideoModal,
      submit,
    }
  }
})
</script>

<style lang="scss" scoped>
.add-comment {
  margin-bottom: 4px;
}

.add-comment__speech-bubble {
  flex: 1;
  display: flex;

  :deep(.bubble-body) {
    flex: 1;
    margin-bottom: 0;
    display: flex;
    align-items: flex-start;
  }
}

.add-comment__comment-buttons {
  .btn {
    padding: 0 0 0 15px;
    line-height: 1;
  }
}

.add-comment_content {
  flex: 1;
}

.add-comment__contenteditable {
  outline: none;
  background-color: transparent;
  border: none;
  padding: 0;
  margin: 0;
  font-size: .9rem;
  color: $colorText;
  min-height: 1rem;
  word-break: break-word;

  &::placeholder {
    color: $colorText;
  }

  &:focus, &:active {
    outline: none;
    box-shadow: none;

    &::placeholder {
      color: $colorGrey;
    }
  }
}

.add-comment_comment-media {
  position: relative;
  margin-top: 0.5rem;

  img {
    width: 100%;
    max-height: 400px;
    height: auto;
    object-fit: contain;
    margin: auto;
  }

  video {
    width: 100%;
    max-height: 400px;
    object-fit: cover;
    margin: auto;
  }

  .add-comment_close-media {
    background: white;
    border-radius: 50%;
    width: 1.5rem;
    height: 1.5rem;
    position: absolute;
    top: 10px;
    right: 10px;
    display: inline-flex;
    justify-content: center;
    align-items: center;

    &:hover {
      box-shadow: 1px 1px 15px white;
      cursor: pointer;
    }
  }
}

.add-comment__helper-text {
  font-size: 11px;
  flex-basis: 100%;
  margin-left: 4rem;
}

.rtl-at-root {
  .add-comment__comment-buttons {
    .btn {
      padding: 0 15px 0 0;
    }
  }

  .add-comment_comment-media {
    .add-comment_close-media {
      left: 10px;
      right: auto;
    }
  }

  .add-comment__helper-text {
    margin-left: auto;
    margin-right: 4rem;
  }
}
</style>
