<template>
  <FeedItemVideo
    v-if="media.mediaType === MediaType.VIDEO"
    :media="media"
    :feed-item-id="feedItemId"
    class="mt-2 w-100"
  />
  <BLink
    v-else-if="media.mediaType === MediaType.PICTURE"
    class="feed-item__attachment"
    @click.prevent="openFeedItemModal"
  >
    <BImg
      fluid-grow
      lazy
      blank-color="#f0f0f0"
      blank-height="400px"
      class="mt-2"
      :src="mediaUrl"
    />
  </BLink>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import FeedItemVideo from '@/components/Feed/FeedItem/FeedItemMedia/FeedItemVideo.vue'
import { Modal, useModalStore } from '@/stores/modal'
import { type Media, MediaSubType,MediaType } from '@/types'
import { maybeGetPublicThumbnailMediaUrl } from '@/utils'

export default defineComponent({
  name: 'FeedItemMedia',
  components: {
    FeedItemVideo
  },
  props: {
    media: {
      type: Object as () => Media,
      required: true,
    },
    feedItemId: {
      type: String,
      default: null,
    }
  },
  emits: ['media-clicked'],
  setup(props, context) {
    const { showModal } = useModalStore()
    const mediaUrl = computed(() => maybeGetPublicThumbnailMediaUrl(props.media))

    const openFeedItemModal = () => {
      if (props.feedItemId) {
        showModal({
          modal: Modal.FEED_ITEM,
          props: {
            modalFeedItemId: props.feedItemId,
          }
        })
      } else {
        context.emit('media-clicked')
      }
    }

    return {
      MediaSubType,
      MediaType,
      mediaUrl,
      openFeedItemModal
    }
  }
})
</script>
