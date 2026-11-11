<template>
  <div class="feed-item-media-skeleton-container">
    <Player>
      <VmVideo>
        <source :type="sourceType">
      </VmVideo>
      <DefaultUi no-controls />
    </Player>
    <div class="upload-progress-container">
      <message-item-upload-progress
        v-if="mediaData"
        :sent-bytes="mediaData.sentBytes"
        :total-bytes="mediaData.totalBytes"
      />
      <span class="upload-progress-text">{{ progressText }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import '@vime/core/themes/default.css'

import { DefaultUi,Player, Video as VmVideo } from '@vime/vue-next'
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import MessageItemUploadProgress from '@/components/Messages/MessageItemUploadProgress.vue'
import { storeKey } from '@/store'
import type { MediaData } from '@/store/media/types'

export default defineComponent({
  name: 'FeedItemMediaSkeleton',
  components: {
    Player,
    VmVideo,
    DefaultUi,
    MessageItemUploadProgress
  },
  props: {
    mediaId: {
      type: String,
      required: true
    },
    processing: {
      type: Boolean,
      default: false,
    }
  },
  setup(props) {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const mediaDataById = computed<(id: string) => MediaData>(() => store.getters['media/mediaDataById'])

    const mediaData = computed(() => {
      return mediaDataById.value(props.mediaId)
    })

    const sourceType = computed(() => {
      return 'video/mp4'
    })

    const progressText = computed(() => {
      return props.processing ? t('post.processing').toString() : t('post.uploading').toString()
    })

    return {
      mediaData,
      progressText,
      sourceType,
    }
  }
})
</script>

<style lang='scss' scoped>
.feed-item-media-skeleton-container {
  position: relative;
  overflow: hidden;
}

.upload-progress-container {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 2;

  .upload-progress-text {
    margin-top: 20px;
    font-size: 24px;
    color: $colorRed;
  }
}
</style>
