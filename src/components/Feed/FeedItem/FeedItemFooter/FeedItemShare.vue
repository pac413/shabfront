<template>
  <div class="feed-item-share">
    <button
      :id="popoverId"
      class="btn feed-item-share"
      :class="{'text-secondary': !isPublicPost}"
      @click.stop
    >
      <FaIcon
        class="icon"
        :icon="['fal', 'share']"
      />
      {{ $t('feed.share.title') }}
    </button>
    <BPopover
      v-model="showingMenu"
      custom-class="feed-item-share_popover"
      placement="bottom"
      container="body"
      click
      :target="popoverId"
    >
      <div
        v-if="!isPublicPost"
        class="feed-item-share__disabled text-secondary"
      >
        {{ $t('feed.share.disabled-privacy') }}
      </div>
      <div
        v-else
        v-click-outside="hideMenu"
        class="feed-item-share__content"
      >
        <ShareAddThis
          :id="feedItem.id"
          :data-a2a-url="dataUrl"
          :data-a2a-title="dataTitle"
          :data-a2a-description="dataDescription"
          :data-a2a-media="dataMedia"
        />
      </div>
    </BPopover>
  </div>
</template>

<script lang="ts">
import { uniqueId } from 'lodash'
import { computed, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'

import ShareAddThis from '@/components/Common/ShareAddThis.vue'
import { type FeedItem, PostPrivacySetting } from '@/types'
import { getPublicMediaUrl } from '@/utils'

export default defineComponent({
  name: 'FeedItemShare',
  components: {
    ShareAddThis
  },
  props: {
    feedItem: {
      type: Object as () => FeedItem,
      required: true,
    }
  },
  setup(props) {
    const router = useRouter()
    const showingMenu = ref<boolean>(false)
    const popoverId = computed(() => {
      // Trick here: We can't use same popoverId for the same feedItem in the FeedList and FeedItemModal
      return uniqueId(`feed-item-share-trigger-${props.feedItem.id}`)
    })

    const dataUrl = computed(() => {
      const resolved = router.resolve({
        name: 'PublicFeedPage',
        params: { feedId: props.feedItem.id }
      })
      return window.location.origin + resolved.href
    })

    const dataTitle = computed(() => {
      return props.feedItem.content
    })

    const dataDescription = computed(() => {
      return props.feedItem.content
    })

    const dataMedia = computed(() => {
      const { medias } = props.feedItem
      if (medias.length === 0) {
        return null
      }
      return getPublicMediaUrl(medias[0].originalUrl)
    })

    const isPublicPost = computed(() => {
      return props.feedItem.privacySetting === PostPrivacySetting.ALL
    })

    const hideMenu = () => {
      showingMenu.value = false
    }

    return {
      dataDescription,
      dataMedia,
      dataTitle,
      dataUrl,
      hideMenu,
      isPublicPost,
      popoverId,
      showingMenu
    }
  }
})
</script>

<style lang="scss">
.feed-item-share {
  padding-left: 0;
  font-size: 14px;
  cursor: pointer;

  &.active {
    color: $colorRed;
    font-weight: 600;
  }
  &:hover(:not(.active)) {
    color: #65676b;
  }
}

.feed-item-share_popover {
  padding: 5px 3px 0 3px;

  .popover-body {
    padding: 0;
  }
}

.feed-item-share__content {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.feed-item-share__disabled {
  max-width: 300px;
  padding: .5rem 1rem;
  font-size: .9rem;
}
</style>
