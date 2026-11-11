<template>
  <div
    v-if="webScraped"
    class="WebScrapedEditor"
  >
    <web-scraped-renderer-advanced :web-scraped="webScraped" />
    <button
      class="btn preview-close"
      @click="closePreview"
    >
      <FaIcon
        class="icon"
        :icon="['fas', 'times']"
      />
    </button>
  </div>
</template>

<script lang="ts">
import { find } from 'linkifyjs'
import { defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'

import WebScrapedRendererAdvanced from '@/components/WebScraped/WebScrapedRendererAdvanced.vue'
import { useToast } from '@/composables'
import { storeKey } from '@/store'
import type { IframelyResponse, WebScrapedLarge } from '@/types'
import { isValidUrl } from '@/utils/webScraped'

export default defineComponent({
  name: 'WebScrapedEditor',
  components: { WebScrapedRendererAdvanced },
  props: {
    content: {
      type: String,
      required: true,
    },
    initialWebScraped: {
      type: Object as () => WebScrapedLarge,
      default: null,
    }
  },
  emits: ['web-scraped'],
  setup(props, context) {
    const store = useStore(storeKey)
    const { showErrorToast } = useToast()
    const webScraped = ref<WebScrapedLarge | null>(null)

    const extractLinkAndPreparePreview = (message: string) => {
      if (!message) {
        webScraped.value = null
        context.emit('web-scraped', null)
        return
      }
      const links = find(message)

      let hasUrl = false
      if (links.length) {
        const link = links[links.length - 1]
        if (isValidUrl(link.href)) {
          fetchPreview(link)
          hasUrl = true
        }
      }
      if (!hasUrl) {
        webScraped.value = null
        context.emit('web-scraped', null)
      }
    }

    const fetchPreview = async (link: {
      type: string;
      value: any;
      isLink: boolean;
      href: string;
      start: number;
      end: number;
    }) => {
      const response = await store.dispatch('feed/getPreview', link.href)
      if ('error' in response) {
        return showErrorToast(response)
      }

      const preview: IframelyResponse = response.data

      if (preview && preview.meta) {
        webScraped.value = mapWebScrapedData(preview)
        webScraped.value.url = link.value
        context.emit('web-scraped', webScraped.value)
      }
    }

    const mapWebScrapedData = (preview: IframelyResponse): WebScrapedLarge => {
      const result: WebScrapedLarge = {
        canonical: preview.meta.canonical,
        site: preview.meta.site,
        author: preview.meta.author,
        title: preview.meta.title || '',
        description: preview.meta.description || ''
      }

      if (preview.links) {
        if (preview.links.thumbnail) {
          result.thumbnails = (preview.links.thumbnail || []).map(item => ({
            height: item.media.height,
            width: item.media.width,
            href: item.href,
            type: item.type
          }))
        }

        if (preview.links.icon) {
          result.icons = (preview.links.icon || []).map(item => ({
            href: item.href,
            type: item.type,
            ...(item.media ? {
              height: item.media.height,
              width: item.media.width
            } : {})
          }))
        }

        if (preview.links.player) {
          result.players = (preview.links.player || []).map(item => ({
            html: item.html,
            href: item.href,
            type: item.type,
            aspect: item.media['aspect-ratio']
          }))
        }
      }

      return result
    }

    const closePreview = () => {
      webScraped.value = null
      context.emit('web-scraped', null)
    }

    watch(() => props.content, () => {
      extractLinkAndPreparePreview(props.content)
    })

    watch(() => props.initialWebScraped, () => {
      if (props.initialWebScraped) {
        webScraped.value = props.initialWebScraped || null
      }
    }, { immediate: true })

    return {
      closePreview,
      fetchPreview,
      mapWebScrapedData,
      webScraped,
    }
  }
})
</script>

<style lang="scss" scoped>
.WebScrapedEditor {
  margin: 16px 8px 8px;
  position: relative;

  .preview-close {
    position: absolute;
    right: 2px;
    top: 2px;
    font-size: 18px;
  }
}

.rtl-at-root {
  .WebScrapedEditor {
    .preview-close {
      right: unset;
      left: 2px;
    }
  }
}
</style>
