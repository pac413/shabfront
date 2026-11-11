<template>
  <div
    v-if="attachment"
    class="message-item-image"
    :class="{ 'message-item-image--blurred': isUploading }"
    @click="onOpen"
  >
    <BImg
      v-if="imageSrc"
      lazy
      :src="imageSrc"
    />
    <span
      v-else
      class="message-item__image-filename"
    >
      <FaIcon
        class="mx-2"
        :icon="['far', 'image']"
      />{{ $t('messages.new-image-processing') }}
    </span>
    <div
      v-if="isUploading"
      class="message-item-image__progress"
    >
      <message-item-upload-progress
        v-if="mediaData"
        :sent-bytes="mediaData.sentBytes"
        :total-bytes="mediaData.totalBytes"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import { storeKey } from '@/store'
import { LocalMediaStatus, type MediaData } from '@/store/media/types'
import { MediaStatus, type Message } from '@/types'
import { getPublicMediaUrl, getToken, maybeGetPublicThumbnailMediaUrl } from '@/utils'

import MessageItemUploadProgress from './MessageItemUploadProgress.vue'

export default defineComponent({
  name: 'MessageItemImage',
  components: { MessageItemUploadProgress },
  props: {
    message: {
      type: Object as () => Message,
      required: true,
    },
  },
  emits: ['open-image'],
  setup(props, context) {
    const store = useStore(storeKey)
    const mediaDataById = computed<(id: string) => MediaData>(() =>
      store.getters['media/mediaDataById']
    )

    const attachment = computed(() => {
      return props.message.attachments && props.message.attachments[0]
    })

    const mediaData = computed(() => {
      return mediaDataById.value(attachment.value!.id)
    })

    const status = computed(() => {
      if (
        attachment.value!.status === MediaStatus.PROCESSING ||
        attachment.value!.status === MediaStatus.COMPLETED
      ) {
        return LocalMediaStatus.COMPLETED
      }
      return mediaData.value?.status
    })

    const isUploading = computed(() => {
      return mediaData.value && status.value !== LocalMediaStatus.COMPLETED
    })

    const imageSrc = computed(() => {
      const accessToken = getToken()
      if (!accessToken) { return null }
      if (attachment.value?.thumbnails?.length) {
        return maybeGetPublicThumbnailMediaUrl(attachment.value!)
      }
      return mediaData.value?.fileContent
    })

    const onOpen = () => {
      const accessToken = getToken()
      if (isUploading.value || !accessToken) { return }
      if (attachment.value!.originalUrl) {
        context.emit('open-image', getPublicMediaUrl(attachment.value!.originalUrl))
      } else if (mediaData.value?.fileContent) {
        context.emit('open-image', mediaData.value.fileContent)
      }
    }

    return {
      attachment,
      imageSrc,
      isUploading,
      mediaData,
      onOpen,
      status,
    }
  }
})
</script>

<style lang="scss" scoped>
.message-item-image {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.message-item-image--blurred {
  cursor: unset;
}

.message-item-image img {
  width: 100%;
  object-fit: contain;
}

.message-item-image--blurred img {
  filter: blur(5px);
  -webkit-filter: blur(5px);
}

.message-item__image-filename {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.message-item-image__progress {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
