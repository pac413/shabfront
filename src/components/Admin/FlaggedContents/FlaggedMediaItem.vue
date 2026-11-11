<template>
  <div class="container">
    <BImg
      fluid-grow
      lazy
      blank-color="#f0f0f0"
      blank-height="400px"
      class="mt-2"
      :src="mediaUrl"
    />
  </div>
</template>

<script lang="ts">
import { computed,defineComponent } from 'vue'

import { type Media } from '@/types'
import { maybeGetPublicThumbnailMediaUrl } from '@/utils'

export default defineComponent({
  name: 'FlaggedMediaItem',
  props: {
    mediaItem: {
      required: true,
      type: Object as () => Media
    }
  },
  setup(props) {
    const mediaUrl = computed(() => maybeGetPublicThumbnailMediaUrl(props.mediaItem))
    return { mediaUrl }
  }
})
</script>

<style lang="scss" scoped>
</style>
