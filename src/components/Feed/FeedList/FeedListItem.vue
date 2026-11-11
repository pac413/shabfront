<template>
  <BCard class="feed-list-item">
    <feed-item-detail
      :item="feedItem"
      :hide-media="hideAllMedia"
      :show-comments="showComments"
      :show-trending="showTrending"
      @toggle-comments="toggleComments"
    />
  </BCard>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import FeedItemDetail from '@/components/Feed/FeedItem/FeedItem.vue'
import { storeKey } from '@/store'
import type { FeedItem } from '@/types'

export default defineComponent({
  name: 'FeedListItem',
  components: {
    FeedItemDetail,
  },
  props: {
    source: {
      type: Object as () => FeedItem,
      required: true,
    },
    showTrending: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore(storeKey)
    const commentsHidden = computed(() => store.state.feed.feedListCommentsHidden)
    const hideAllMedia = computed<boolean>(() => store.getters['profileSettings/hideAllMedia'])
    const showComments = computed(() => !commentsHidden.value[props.source.id])
    const feedItem = computed(() => props.source)
    const toggleComments = () => {
      store.commit('feed/TOGGLE_FEED_LIST_ITEM_COMMENTS_HIDDEN', props.source.id)
    }

    return {
      commentsHidden,
      feedItem,
      hideAllMedia,
      showComments,
      toggleComments,
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
