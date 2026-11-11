<template>
  <div
    v-if="attachment"
    class="message-item-video"
    :class="{ 'message-item-video-blurred': isUploading }"
  >
    <video
      v-if="videoSrc"
      type="video"
      controls
      allowfullscreen
    >
      <source :src="videoSrc">
    </video>
    <span
      v-else
      class="message-item-video__filename"
    >
      <FaIcon
        class="mx-2"
        :icon="['far', 'image']"
      />{{ $t('messages.new-video-processing') }}
    </span>
    <div
      v-if="isUploading"
      class="message-item-video__progress"
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
import { getPublicMediaUrl } from '@/utils'

import MessageItemUploadProgress from './MessageItemUploadProgress.vue'

export default defineComponent({
  name: 'MessageItemVideo',
  components: { MessageItemUploadProgress },
  props: {
    message: {
      type: Object as () => Message,
      required: true,
    },
  },
  setup(props) {
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
      if (attachment.value!.status === MediaStatus.PROCESSING || attachment.value!.status === MediaStatus.COMPLETED) {
        return LocalMediaStatus.COMPLETED
      }
      return mediaData.value?.status
    })

    const isUploading = computed(() => {
      return mediaData.value && status.value !== LocalMediaStatus.COMPLETED
    })

    const videoSrc = computed(() => {
      if (attachment.value!.thumbnails && attachment.value!.thumbnails.length > 0) {
        return getPublicMediaUrl(attachment.value!.originalUrl)
      }
      return mediaData.value?.fileUrl
    })

    return {
      attachment,
      isUploading,
      mediaData,
      status,
      videoSrc,
    }
  }
})
</script>

<style lang="scss" scoped>
.message-item-video {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.message-item-video-blurred {
  cursor: unset;
}

.message-item-video video {
  max-width: 100%;
  outline: none;
}

.message-item-video-blurred video {
  filter: blur(5px);
  -webkit-filter: blur(5px);
}

.message-item-video__filename {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.message-item-video__progress {
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
