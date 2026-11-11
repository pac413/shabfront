<template>
  <a
    v-if="webScraped"
    class="web-scraped-renderer-basic_preview"
    :href="webScraped.canonical"
    target="_blank"
  >
    <div
      v-if="poster"
      class="web-scraped-renderer-basic_poster"
    >
      <img
        :src="poster.href"
        class="img-responsive"
      >
    </div>
    <div class="web-scraped-renderer-basic_meta">
      <div class="web-scraped-renderer-basic_meta-website">
        {{ domain }}
      </div>
      <div class="web-scraped-renderer-basic_meta-title">
        {{ webScraped.title }}
      </div>
    </div>
  </a>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import { type WebScrapedIcon, type WebScrapedLarge, type WebScrapedThumbnail } from '@/types'

export default defineComponent({
  name: 'WebScrapedRendererBasic',
  props: {
    webScraped: {
      type: Object as () => WebScrapedLarge,
      default: null,
    }
  },
  setup(props) {
    const poster = computed<WebScrapedThumbnail | null>(() => {
      // TODO: investigate and select best thumbnail in a smart way
      if (props.webScraped?.thumbnails) {
        return props.webScraped.thumbnails[0] || null
      }
      return null
    })

    const icon = computed<WebScrapedIcon | null>(() => {
      // TODO: investigate and select best icon in a smart way
      if (props.webScraped?.icons) {
        return props.webScraped.icons[0] || null
      }
      return null
    })

    const domain = computed<string>(() => {
      if (props.webScraped?.site) {
        return props.webScraped.site || ''
      }
      if (props.webScraped?.canonical) {
        return new URL(props.webScraped.canonical).hostname
      }
      return ''
    })

    return {
      domain,
      icon,
      poster,
    }
  }
})
</script>

<style lang="scss" scoped>
  .web-scraped-renderer-basic_preview {
    display: flex;
    flex-grow: 1;
    flex-wrap: nowrap;
    flex-basis: 100%;
    overflow: hidden;
    border: 1px solid #ced0d4;
    border-radius: 18px;
    margin-top: 4px;
    position: relative;

    &:hover {
      text-decoration: none;
    }

    &:hover:after {
      position: absolute;
      content: '';
      width: 100%;
      height: 100%;
      background-color: #44495026;
    }

    .web-scraped-renderer-basic_poster {
      img {
        width: 98px;
        height: 96px;
        object-fit: cover;
      }
    }

    .web-scraped-renderer-basic_meta {
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 10px;
      background: white;

      .web-scraped-renderer-basic_meta-website {
        font-weight: 600;
        font-size: 13px;
        color: #65676b;
        word-break: break-word;
        text-transform: uppercase;
        letter-spacing: 0.4px;
      }
      .web-scraped-renderer-basic_meta-title {
        font-size: 17px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        word-break: break-word;
      }
    }
  }
</style>
