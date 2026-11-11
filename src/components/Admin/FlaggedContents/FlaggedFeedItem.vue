<template>
  <div class="container">
    <feed-item-content :feed-item="feedItem" />
    <feed-item-media
      v-for="media in feedItem.medias"
      :key="media.id"
      :media="media"
      :feed-item-id="feedItem.id"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import FeedItemContent from '@/components/Feed/FeedItem/FeedItemContent.vue'
import FeedItemMedia from '@/components/Feed/FeedItem/FeedItemMedia/FeedItemMedia.vue'
import { type FeedItem } from '@/types'

export default defineComponent({
  name: 'FlaggedFeedItem',
  components: {
    FeedItemContent,
    FeedItemMedia
  },
  props: {
    feedItem: {
      required: true,
      type: Object as () => FeedItem
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
