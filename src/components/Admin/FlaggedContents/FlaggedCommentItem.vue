<template>
  <div class="container">
    <div class="text">
      {{ commentItem.content }}
    </div>
    <feed-item-media
      v-if="media"
      :media="media"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import FeedItemMedia from '@/components/Feed/FeedItem/FeedItemMedia/FeedItemMedia.vue'
import { type PostComment } from '@/types'

export default defineComponent({
  name: 'FlaggedCommentItem',
  components: { FeedItemMedia },
  props: {
    commentItem: {
      required: true, 
      type: Object as () => PostComment
    }
  },
  setup(props) {
    const media = computed(() => {
      const { commentItem } = props
      return commentItem.medias!.length ? commentItem.medias![0] : null
    })

    return {
      media
    }
  }
})
</script>
