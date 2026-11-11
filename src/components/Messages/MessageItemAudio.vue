<template>
  <div class="message-item-audio">
    <audio
      ref="audioRef"
      controls
    >
      <source :src="audioUrl">
    </audio>
    <div
      v-if="isUploading"
      class="message-item-audio__progress"
    >
      <div class="message-item-audio__backdrop bg-light" />
      <message-item-upload-progress
        v-if="mediaData"
        :sent-bytes="mediaData.sentBytes"
        :total-bytes="mediaData.totalBytes"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

import { storeKey } from '@/store'
import { LocalMediaStatus, type MediaData } from '@/store/media/types'
import { type Media, MediaStatus } from '@/types'
import { getPublicMediaUrl } from '@/utils'

import MessageItemUploadProgress from './MessageItemUploadProgress.vue'

export default defineComponent({
  name: 'MessageItemAudio',
  components: { MessageItemUploadProgress },
  props: {
    attachment: {
      type: Object as () => Media,
      required: true,
    },
  },
  setup(props) {
    const store = useStore(storeKey)
    const mediaDataById = computed<(id: string) => MediaData>(() =>
      store.getters['media/mediaDataById']
    )
    const audioRef = ref<HTMLAudioElement | null>(null)
    const mediaData = computed(() => {
      return mediaDataById.value(props.attachment.id)
    })
    const status = computed(() => {
      if (
        props.attachment.status === MediaStatus.PROCESSING ||
        props.attachment.status === MediaStatus.COMPLETED
      ) {
        return LocalMediaStatus.COMPLETED
      }
      return mediaData.value?.status
    })
    const isUploading = computed(() => {
      return mediaData.value && status.value !== LocalMediaStatus.COMPLETED
    })
    const audioUrl = computed(() => {
      if (!props.attachment || !props.attachment.originalUrl) {
        return
      }
      return getPublicMediaUrl(props.attachment!.originalUrl)
    })

    watch(audioUrl, () => {
      nextTick(() => {
        if (audioRef.value) {
          audioRef.value.load()
        }
      })
    }, { immediate: true })

    onMounted(() => {
      if (audioRef.value) {
        audioRef.value.load()
      }
    })

    return {
      audioRef,
      audioUrl,
      isUploading,
      mediaData,
      status,
    }
  }
})
</script>

<style lang="scss" scoped>
.message-item-audio {
  width: 100%;
  height: 100%;
  min-height: 50px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  position: relative;
  cursor: pointer;
}

.message-item-audio__progress {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.message-item-audio__backdrop {
  position: absolute;
  top: 0px;
  left: 0px;
  bottom: 0px;
  right: 0px;
  opacity: 0.85;
  border-radius: 100px;
  backdrop-filter: blur(2px);
}
</style>
