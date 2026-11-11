<template>
  <div
    ref="containerRef"
    class="feed-video"
    :class="{ 'feed-video--portrait': isPortrait && forModal }"
  >
    <Player
      ref="playerRef"
      :muted="!expanded"
      :current-time="currentTime"
      :aspect-ratio="aspectRatio"
      @vmPlaybackReady="onPlaybackReady"
    >
      <template v-if="videoSource">
        <VmVideo
          v-if="thumbnail"
          :poster="thumbnail"
          preload="auto"
        >
          <source :src="videoSource">
        </VmVideo>
        <VmVideo
          v-else
          preload="auto"
        >
          <source :src="videoSource">
        </VmVideo>
      </template>

      <DefaultUi
        no-controls
        no-settings
        @click.stop.prevent="onUiClicked"
      >
        <Controls full-width>
          <PlaybackControl
            hide-tooltip
            @click="player.muted = false"
          />
          <VolumeControl />
          <TimeProgress />
          <ScrubberControl />
          <LiveIndicator />
          <PipControl />
          <Control
            v-if="!expanded && media.mediaSubType === MediaSubType.POST"
            :label="$t('feed.modal.enlarge')"
            @click="onExpand"
          >
            <Icon name="fullscreen-enter" />
            <Tooltip>{{ $t('feed.modal.enlarge') }}</Tooltip>
          </Control>
          <FullscreenControl v-else />
        </Controls>
        <Poster fit="contain" />
      </DefaultUi>
    </Player>
  </div>
</template>

<script lang="ts">
import '@vime/core/themes/default.css'

import {
  Control,
  Controls,
  DefaultUi,
  FullscreenControl,
  Icon,
  LiveIndicator,
  PipControl,
  PlaybackControl,
  Player,
  Poster,
  ScrubberControl,
  TimeProgress,
  Tooltip,
  Video as VmVideo,
  VolumeControl,
} from '@vime/vue-next'
import { computed, defineComponent, onMounted, onUnmounted, ref, watch } from 'vue'
import { useStore } from 'vuex'

import { storeKey } from '@/store'
import { Modal, useModalStore } from '@/stores/modal'
import { type Media, MediaSubType } from '@/types'
import { getPublicMediaUrl } from '@/utils'

export default defineComponent({
  name: 'FeedItemVideo',
  components: {
    Player,
    VmVideo,
    DefaultUi,
    Controls,
    VolumeControl,
    PlaybackControl,
    TimeProgress,
    ScrubberControl,
    LiveIndicator,
    Tooltip,
    Icon,
    Control,
    PipControl,
    FullscreenControl,
    Poster
  },
  props: {
    media: {
      type: Object as () => Media,
      required: true,
    },
    feedItemId: {
      type: String,
      default: null,
    },
    currentTime: {
      type: Number,
      default: 0,
    },
    expanded: {
      type: Boolean,
      default: false,
    },
    forModal: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const activeVideoId = computed(() => store.state.feed.activeVideoId)
    const observer = ref<IntersectionObserver | null>(null)
    const containerRef = ref<HTMLDivElement | null>(null)
    const playerRef = ref<typeof Player | null>(null)

    const id = computed(() => {
      // while using mock, use the originalUrl as id
      return props.media.originalUrl
    })

    const player = computed(() => {
      return (playerRef.value as any).$el as HTMLVideoElement
    })

    const thumbnail = computed(() => {
      const thumbnailUrl = props.media.thumbnails && props.media.thumbnails.length ? props.media.thumbnails[0].url : ''
      return getPublicMediaUrl(thumbnailUrl)
    })

    const videoSource = computed(() => {
      // when playing inline, use performanceUrl if available. Otherwise play original.
      const videoUrl = props.expanded ? props.media.originalUrl : props.media.performanceUrl || props.media.originalUrl
      return getPublicMediaUrl(videoUrl)
    })

    const aspectRatio = computed(() => {
      return `${props.media.meta.width!}:${props.media.meta.height!}`
    })

    const isPortrait = computed(() => {
      const ratio = props.media.meta.width! / props.media.meta.height!

      return (props.media.meta.orientation === 'PORTRAIT') ||
        (
          props.media.meta.orientation === 'LANDSCAPE'
          && containerRef.value
          && (containerRef.value.clientWidth / ratio) > window.innerHeight
        )
    })

    const onPlaybackReady = () => {
      observer.value = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.intersectionRatio >= 0.75) {
            store.commit('feed/PLAY_VIDEO', id.value)
          } else if (entry.intersectionRatio <= 0.25) {
            store.commit('feed/STOP_VIDEO', id.value)
          }
        })
      }, { threshold: [0.25, 0.75] })

      if (!props.expanded) {
        observer.value.observe(player.value)
      } else {
        player.value.currentTime = props.currentTime
      }
    }

    const onExpand = () => {
      showModal({
        modal: Modal.FEED_ITEM,
        props: {
          modalFeedItemId: props.feedItemId,
          currentTime: player.value.currentTime || 0
        }
      })
    }

    const onUiClicked = (e: any) => {
      // If clicking the background of the UI, and not a button, then launch the feed item modal (SC-6778)
      if (e.target.tagName && e.target.tagName.toUpperCase() === 'VM-DEFAULT-UI' &&
         !props.expanded && props.media.mediaSubType === MediaSubType.POST) {
        onExpand()
      }
    }

    watch(activeVideoId, () => {
      if (id.value === activeVideoId.value) {
        player.value.paused && player.value.play()
      } else {
        (player.value as any).playing && player.value.pause()
      }
    })

    onMounted(() => {
      if (props.forModal) {
        const ratio = props.media.meta.width! / props.media.meta.height!

        // calculate the width of the video player to fit to the layout
        if (isPortrait.value && containerRef.value) {
          containerRef.value.style.width = `${window.innerHeight * ratio}px`
        }
      }
    })

    onUnmounted(() => {
      if (observer.value) {
        observer.value.disconnect()
      }
    })

    return {
      activeVideoId,
      aspectRatio,
      containerRef,
      id,
      isPortrait,
      onExpand,
      onPlaybackReady,
      onUiClicked,
      player,
      playerRef,
      MediaSubType,
      thumbnail,
      videoSource,
    }
  }
})
</script>

<style lang="scss" scoped>
.feed-video {
  width: 100%;
  overflow: hidden;

  :deep(vm-player) {
    --vm-controls-bg: rgba(0, 0, 0, .4);
    --vm-player-bg: black;
  }
}

.feed-video--portrait {
  height: 100vh;
}
</style>
