<template>
  <BModal
    :id="id"
    v-model="isVisible"
    centered
    size="lg"
    :title="title"
    no-close-on-backdrop
    modal-class="feed-item-preview-modal"
    @shown="onModalShown"
    @hidden="$emit('hidden')"
  >
    <div class="container">
      <div
        v-if="activeProfile"
        class="post-header"
      >
        <ProfileAvatar
          linkable
          class="avatar me-2"
          size="3em"
          thumbnail="medium"
          :profile="activeProfile"
        />
        <span class="p-1">{{ activeProfile.displayName }}</span>
      </div>
      <div
        v-if="activeProfile"
        class="post-body"
      >
        <FeedItemTextarea
          ref="textareaRef"
          class="post-content"
          :class="{ 'animate-color': showAnimation }"
          :value="content"
          :placeholder="placeholder"
          @change="onContentChanged"
        />
      </div>
      <WebScrapedEditor
        :content="content"
        :initial-web-scraped="editableFeed ? editableFeed.webScraped : undefined"
        @web-scraped="webScraped = $event"
      />
      <div
        v-if="attachmentDataUrl"
        class="post-attachment"
      >
        <BImg
          v-if="attachmentMediaType === MediaType.PICTURE"
          :src="attachmentDataUrl"
          class="preview-img"
        />
        <video 
          v-else-if="attachmentMediaType === MediaType.VIDEO" 
          class="preview-video"
          controls
        >
          <source :src="attachmentDataUrl" />
        </video>
        <button
          v-if="isMediaEditable"
          class="btn btn-primary btn-edit"
          @click="onEditAttachment"
        >
          <FaIcon
            :icon="['fal', 'pencil-alt']"
            class="icon"
          />
        </button>
        <!-- Hide this button as a temporaray solution -->
        <!-- <button
          v-if="isMediaDeletable"
          class="btn btn-primary btn-close"
          @click="onClearAttachment"
        >
          <FaIcon :icon="['fas', 'times']" class="icon" />
        </button> -->
      </div>
    </div>
    <template #footer>
      <FeedItemPreviewButtons
        :publishable="publishable"
        @add-picture="$emit('add-picture')"
        @add-video="$emit('add-video')"
        @add-job="$emit('add-job')"
        @add-emoji="onEmojiAdded"
        @submit="submit"
      />
    </template>

    <ConfirmationDialog
      :id="textOnlyConfirmDlgId"
      :body="$t('feed.modal.text-only-post.body')"
      :title="$t('feed.modal.text-only-post.title')"
      :no="$t('general.cancel')"
      :yes="$t('feed.modal.text-only-post.btn-post-anyway')"
      @success="onTextOnlySubmitConfirmed"
    />
  </BModal>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import ConfirmationDialog from '@/components/Common/Dialogs/ConfirmationDialog.vue'
import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import FeedItemPreviewButtons from '@/components/Feed/FeedItemPreview/FeedItemPreviewButtons.vue'
import FeedItemTextarea from '@/components/Feed/FeedItemPreview/FeedItemTextarea.vue'
import WebScrapedEditor from '@/components/WebScraped/WebScrapedEditor.vue'
import { useModal, useRegisterModal } from '@/composables'
import { storeKey } from '@/store'
import { type FeedItem, type Media, MediaType, type Picture, PostType, type WebScrapedLarge } from '@/types'
import { getMediaType, getPublicMediaUrl } from '@/utils'

type PostDetail = {
  content: string,
  webScraped: WebScrapedLarge | null,
  attachment: File | null,
  currentAttachments: Media[]
}

const textOnlyConfirmDlgId = 'feed-text-only-confirm-dlg'

export default defineComponent({
  name: 'FeedItemPreviewModal',
  components: {
    ConfirmationDialog,
    FeedItemTextarea,
    FeedItemPreviewButtons,
    ProfileAvatar,
    WebScrapedEditor
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    attachment: {
      type: Object as () => File,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    'hidden',
    'add-picture',
    'add-video',
    'add-job',
    'add-emoji',
    'clear-attachment',
    'edit-picture',
    'submit'
  ],
  setup(props, context) {
    const { id } = toRefs(props)
    const { t } = useI18n()
    const store = useStore(storeKey)
    const { isVisible } = useRegisterModal(id)
    const modal = useModal()
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const editableFeed = computed(() => store.state.feed.editableFeed)
    const content = ref<string>('')
    const webScraped = ref<WebScrapedLarge | null>(null)
    const attachmentDataUrl = ref<string | ArrayBuffer | null>(null)
    const feedItem = ref<FeedItem | null>(null)
    const pendingPostDetails = ref<PostDetail | null>(null)
    const systemPostTypes = [PostType.AVATAR_UPDATED, PostType.PICTURE_ADDED]
    const showAnimation = ref<boolean>(false)
    const textareaRef = ref<(typeof FeedItemTextarea & { focusToEndWithDelay: () => void }) | null>(null)

    const isMediaEditable = computed(() => {
      if (feedItem.value) {
        return (
          attachmentMediaType.value === MediaType.PICTURE &&
          !systemPostTypes.includes(feedItem.value.postType)
        )
      }
      return true
    })

    const isMediaDeletable = computed(() => {
      if (feedItem.value) {
        return !systemPostTypes.includes(feedItem.value!.postType)
      }
      return true
    })

    const placeholder = computed(() => {
      switch (attachmentMediaType.value) {
      case MediaType.PICTURE: {
        return t('feed.editor-textarea.placeholder-photo')
      }
      case MediaType.VIDEO: {
        return t('feed.editor-textarea.placeholder-video')
      }
      default: {
        return t('feed.editor-textarea.placeholder', { firstName: activeProfile.value?.firstName })
      }
      }
    })

    const publishable = computed(() => {
      if (props.loading) {
        return false
      }
      if (!feedItem.value) {
        return Boolean(content.value || props.attachment)
      } else {
        return true
      }
    })

    const attachmentMediaType = computed(() => {
      // use file attachment that user selects
      if (props.attachment) {
        return getMediaType(props.attachment)
      }
      // use existing media that editable feed has
      if (feedItem.value && feedItem.value.medias.length > 0) {
        return feedItem.value.medias[0].mediaType
      }
      return null
    })

    const onModalShown = () => {
      if (feedItem.value) {
        content.value = feedItem.value.content
        if (feedItem.value.medias.length > 0) {
          attachmentDataUrl.value = getPublicMediaUrl(
            feedItem.value.medias[0].originalUrl
          ) as string | ArrayBuffer | null
        }
      } else {
        content.value = ''
        webScraped.value = null
        attachmentDataUrl.value = null
      }
    }

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
      } else if (feedItem.value && feedItem.value.medias.length > 0) {
        const currentMedia = feedItem.value.medias[0]
        editPictureItem = {
          id: currentMedia.id,
          originalMediaId: currentMedia.originalMediaId,
          original: currentMedia.originalUrl,
          medium: '',
          large: ''
        }
      }
      context.emit('edit-picture', editPictureItem)
    }

    const onClearAttachment = () => {
      if (props.attachment) {
        context.emit('clear-attachment')
      } else if (feedItem.value && feedItem.value.medias.length > 0) {
        feedItem.value!.medias = []
        context.emit('clear-attachment')
      }
      attachmentDataUrl.value = null
    }

    const onEmojiAdded = (emoji: string) => {
      content.value += emoji
    }

    const onContentChanged = (value: string) => {
      content.value = value
    }

    const isTextOnlyPost = (params: PostDetail): boolean => {
      return !!params.content &&
        !params.webScraped &&
        !params.attachment &&
        params.currentAttachments.length === 0
    }

    const submit = () => {
      let currentAttachments: Media[] = []
      if (feedItem.value) {
        currentAttachments = feedItem.value.medias
      }
      const postDetails = {
        content: content.value,
        webScraped: webScraped.value,
        attachment: props.attachment,
        currentAttachments
      }

      const isTextOnly = isTextOnlyPost(postDetails)
      if (isTextOnly) {
        modal.show(textOnlyConfirmDlgId)
        pendingPostDetails.value = postDetails
        return
      }

      pendingPostDetails.value = null
      context.emit('submit', postDetails)
    }

    const onTextOnlySubmitConfirmed = () => {
      modal.hide(textOnlyConfirmDlgId)
      context.emit('submit', pendingPostDetails.value)
      pendingPostDetails.value = null
    }

    watch(editableFeed, () => {
      if (editableFeed.value) {
        feedItem.value = { ...editableFeed.value! } as FeedItem
      } else {
        feedItem.value = null
      }
    }, { immediate: true })

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

    return {
      activeProfile,
      attachmentDataUrl,
      attachmentMediaType,
      content,
      editableFeed,
      feedItem,
      isMediaDeletable,
      isMediaEditable,
      isTextOnlyPost,
      isVisible,
      MediaType,
      onClearAttachment,
      onContentChanged,
      onEditAttachment,
      onEmojiAdded,
      onModalShown,
      onTextOnlySubmitConfirmed,
      pendingPostDetails,
      placeholder,
      publishable,
      showAnimation,
      submit,
      systemPostTypes,
      textOnlyConfirmDlgId,
      textareaRef,
      webScraped,
    }
  }
})
</script>

<style lang="scss" scoped>
.container {
  background: white;
}

.post-header {
  display: flex;
  align-items: flex-start;
  padding-bottom: 1em;
  border-bottom: solid 1px $colorBorder;
}

.post-content {
  flex: 1;
  margin-top: 2px;
  min-height: 150px;
  border-radius: 10px;
  overflow: auto;
  max-height: 600px;
  border-radius: 0;
}

.feed-item-preview-modal.show {
  .modal-footer {
    padding: .5em 1.5em;
  }
}

.post-attachment {
  margin-top: 1rem;
  position: relative;
  text-align: center;
}

.preview-img {
  max-width: 40vh;
}

.preview-video {
  width: 100%;
  max-height: 60vh;
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
  .post-content {
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

.animate-color {
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
