<template>
  <div class="feed-item-content">
    <ShowMoreText
      :text="contentWithLink"
      :lines="2"
      additional-container-css="padding: 0px;"
      additional-content-css="font-size: 14px;"
      additional-content-expanded-css="font-size: 14px;"
      additional-anchor-css="font-size: 14px; color: #f43838;"
    />
    <web-scraped-renderer-advanced
      v-if="webScraped"
      :web-scraped="webScraped"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import ShowMoreText from '@/components/Common/ShowMoreText/ShowMoreText.vue'
import WebScrapedRendererAdvanced from '@/components/WebScraped/WebScrapedRendererAdvanced.vue'
import { storeKey } from '@/store'
import type { FeedItem, SimpleProfile } from '@/types'
import { escapeHtml, MinimalTextMaxSize, TextMaxSize } from '@/utils'

export default defineComponent({
  name: 'FeedItemContent',
  components: { WebScrapedRendererAdvanced, ShowMoreText },
  props: {
    feedItem: {
      type: Object as () => FeedItem,
      required: true,
    },
  },
  setup(props) {
    const store = useStore(storeKey)
    const simpleProfileById = computed<(id: string) => SimpleProfile | null>(() =>
      store.getters['profile/simpleProfileById']
    )

    const hasMedia = computed(() => {
      return props.feedItem.medias.length > 0 || !!webScraped.value
    })

    const maxTextSize = computed(() => {
      return hasMedia.value ? MinimalTextMaxSize : TextMaxSize
    })

    const postedByProfile = computed(() => {
      const { postedBy } = props.feedItem
      return typeof postedBy === 'string'
        ? simpleProfileById.value(postedBy)
        : postedBy
    })

    const content = computed(() => {
      const { content } = props.feedItem
      return content
    })

    const contentWithLink = computed(() => {
      const html = escapeHtml(content.value)
      if (webScraped.value && webScraped.value.url && content.value) {
        const link = `<a class="me-1" href="${webScraped.value.canonical}" target="_blank">
          ${webScraped.value.title}
        </a>`
        return content.value.replace(webScraped.value.url, link)
      }
      return html
    })

    const webScraped = computed(() => {
      return props.feedItem.webScraped || null
    })

    return {
      content,
      contentWithLink,
      hasMedia,
      maxTextSize,
      postedByProfile,
      simpleProfileById,
      webScraped,
    }
  }
})
</script>

<style lang="scss" scoped>
.feed-item-content {
  white-space: pre-line;
}
</style>
