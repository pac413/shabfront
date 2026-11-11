<template>
  <div
    v-if="webScraped"
    class="web-scraped-renderer"
    :class="{'has-sidebar': hasSidebar}"
  >
    <div
      v-if="player"
      ref="playerRef"
      class="preview-poster"
    >
      <div v-html="player.html" />
    </div>
    <div
      v-else-if="poster"
      class="preview-poster"
    >
      <a
        :href="webScraped.canonical"
        target="_blank"
      >
        <img
          :src="poster.href"
          class="img-responsive"
          @error="hideOnError"
        >
      </a>
    </div>
    <div
      v-else-if="largeIcon"
      class="preview-large-icon"
    >
      <img
        :src="largeIcon.href"
        @error="hideOnError"
      >
    </div>
    <div class="preview-meta">
      <div class="preview-title">
        <a
          :href="webScraped.canonical"
          target="_blank"
        >
          <span>{{ webScraped.title }}</span>
        </a>
      </div>
      <ShowMoreText
        :text="contentWithLink"
        :lines="2"
        additional-container-css="padding: 0px;"
        additional-content-css="font-size: 14px;"
        additional-content-expanded-css="font-size: 14px;"
        additional-anchor-css="font-size: 14px; color: #f43838;"
      />
      <div class="preview-author">
        <a
          v-if="icon && icon.href"
          :href="webScraped.canonical"
          class="preview-icon"
          target="_blank"
        >
          <img
            :src="icon.href"
            @error="hideOnError"
          >
        </a>
        <a
          :href="webScraped.canonical"
          target="_blank"
        >
          <span>{{ webScraped.title }}</span>
          <span
            v-if="webScraped.author"
            class="preview-author-delimiter"
          >/</span>
        </a>
        <span>{{ webScraped.author }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, ref, watch } from 'vue'

import ShowMoreText from '@/components/Common/ShowMoreText/ShowMoreText.vue'
import type { WebScrapedIcon, WebScrapedLarge, WebScrapedPlayer, WebScrapedThumbnail } from '@/types'
import { escapeHtml } from '@/utils'

const MIN_POSTER_SIZE = 300
const MIN_LARGE_ICON_SIZE = 100

export default defineComponent({
  name: 'WebScrapedRendererAdvanced',
  components: { ShowMoreText },
  props: {
    webScraped: {
      type: Object as () => WebScrapedLarge,
      required: true,
    },
  },
  setup(props) {
    const playerRef = ref<Node | null>(null)
    const poster = computed<WebScrapedThumbnail | null>(() => {
      if (props.webScraped && props.webScraped.thumbnails) {
        return props.webScraped.thumbnails
          .find(item => item.width > MIN_POSTER_SIZE) || null
      }
      return null
    })

    const icon = computed<WebScrapedIcon | null>(() => {
      // TODO: investigate and select best icon in a smart way
      if (props.webScraped && props.webScraped.icons) {
        return props.webScraped.icons[0]
      }
      return null
    })

    const largeIcon = computed<WebScrapedIcon | null>(() => {
      if (props.webScraped) {
        if (props.webScraped.thumbnails) {
          const poster = props.webScraped.thumbnails.find(item => item.width < MIN_POSTER_SIZE)
          if (poster) {
            return poster
          }
        }

        if (props.webScraped && props.webScraped.icons) {
          return props.webScraped.icons
            .find(item => item.width && item.width > MIN_LARGE_ICON_SIZE) || null
        }
      }
      return null
    })

    const player = computed<WebScrapedPlayer | null>(() => {
      // TODO: investigate and select best player in a smart way
      if (props.webScraped && props.webScraped.players) {
        return props.webScraped.players[0]
      }
      return null
    })

    const hasSidebar = computed(() => {
      return !player.value && !poster.value && largeIcon.value
    })

    const contentWithLink = computed(() => {
      return escapeHtml(props.webScraped.description)
    })

    const hideOnError = (event: Event) => {
      const target = event.target as HTMLImageElement
      target.style.display = 'none'
    }

    watch(() => props.webScraped, () => {
      nextTick(() => {
        if (player.value) {
          const match = player.value.html.match(/<script.+src="(.+?)".+nonce="(.+?)".+<\/script>/)
          if (match && match[1] && match[2]) {
            const script = document.createElement('script')
            script.async = true
            script.defer = true
            script.crossOrigin = 'anonymous'
            script.setAttribute('src', match[1])
            script.setAttribute('nonce', match[2])
            if (playerRef.value) {
              playerRef.value.appendChild(script)
            }
          }
        }
      })
    }, { immediate: true })

    return {
      contentWithLink,
      hasSidebar,
      hideOnError,
      icon,
      largeIcon,
      player,
      playerRef,
      poster,
    }
  }
})
</script>

<style lang="scss" scoped>
.web-scraped-renderer {
  display: flex;
  margin-top: 8px;
  margin-bottom: 8px;
  position: relative;
  border: 1px solid rgba(0, 0, 0, 0.125);
  border-radius: 0.25rem;

  &:not(.has-sidebar) {
    flex-wrap: wrap;
  }

  .preview-poster {
    width: 100%;

    .img-responsive {
      display: block;
      max-width: 100%;
      min-width: 100%;
      min-height: 100%;
      max-height: 400px;
      object-fit: cover;
      overflow: hidden;
      opacity: 0.9;
      transition: opacity 0.2s;
      border-radius: 2px;
    }
  }

  .preview-large-icon {
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      max-width: 140px;
      max-height: 140px;
    }
  }

  .preview-meta {
    padding: 16px 20px;
  }

  .preview-title {
    font-size: 17px;
    margin-bottom: 8px;

    span {
      font-weight: bold;
      color: black;
      text-decoration: none;
    }
  }

  .preview-description {
    font-size: 15px;
    margin-bottom: 12px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .preview-author {
    display: flex;
    align-items: center;

    .preview-author-delimiter {
      margin-left: 4px;
      margin-right: 4px;
      opacity: .3;
    }

    &, a {
      font-size: 14px;
      line-height: 14px;
      color: #999;
    }

    .preview-icon {
      margin-right: 6px;

      img {
        width: 16px;
      }
    }
  }
}

.rtl-at-root {
  .web-scraped-renderer {
    .preview-author {
      .preview-icon {
        margin-right: unset;
        margin-left: 6px;
      }
    }
  }
}
</style>
