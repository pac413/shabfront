<template>
  <svg
    :width="width"
    :height="height"
    :viewBox="computedViewBox"
    version="1.1"
    :preserveAspectRatio="preserveAspectRatio"
  >
    <rect
      :style="{ fill: `url(${baseUrl}#${idGradient})` }"
      :clip-path="`url(${baseUrl}#${idClip})`"
      x="0"
      y="0"
      width="100%"
      height="100%"
    />

    <defs>
      <clipPath :id="idClip">
        <slot v-if="$slots.default" />
        <rect v-else x="0" y="0" rx="5" ry="5" width="100%" height="100%" />
      </clipPath>

      <linearGradient :id="idGradient">
        <stop offset="0%" :stop-color="primaryColor" :stop-opacity="primaryOpacity">
          <animate v-if="animate" attributeName="offset" values="-2; 1" :dur="`${speed}s`" repeatCount="indefinite" />
        </stop>
        <stop offset="50%" :stop-color="secondaryColor" :stop-opacity="secondaryOpacity">
          <animate
            v-if="animate"
            attributeName="offset"
            values="-1.5; 1.5"
            :dur="`${speed}s`"
            repeatCount="indefinite"
          />
        </stop>
        <stop offset="100%" :stop-color="primaryColor" :stop-opacity="primaryOpacity">
          <animate v-if="animate" attributeName="offset" values="-1; 2" :dur="`${speed}s`" repeatCount="indefinite" />
        </stop>
      </linearGradient>
    </defs>
  </svg>
</template>

<script lang="ts">
import { v4 } from 'uuid'
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'ContentLoader',

  props: {
    width: {
      type: [Number, String],
    },
    height: {
      type: [Number, String],
    },
    viewBox: {
      type: String,
    },
    preserveAspectRatio: {
      type: String,
      default: 'xMidYMid meet',
    },
    speed: {
      type: Number,
      default: 2,
    },
    baseUrl: {
      type: String,
      default: '',
    },
    primaryColor: {
      type: String,
      default: '#f9f9f9',
    },
    secondaryColor: {
      type: String,
      default: '#ecebeb',
    },
    primaryOpacity: {
      type: Number,
      default: 1,
    },
    secondaryOpacity: {
      type: Number,
      default: 1,
    },
    uniqueKey: {
      type: String,
    },
    animate: {
      type: Boolean,
      default: true,
    },
  },

  setup(props) {
    const idClip = computed(() => (props.uniqueKey ? `${props.uniqueKey}-idClip` : v4()))
    const idGradient = computed(() => (props.uniqueKey ? `${props.uniqueKey}-idGradient` : v4()))
    const width = computed(() => props.width ?? 400)
    const height = computed(() => props.height ?? 130)
    const computedViewBox = computed(() => props.viewBox ?? `0 0 ${width.value} ${height.value}`)

    return {
      idClip,
      idGradient,
      computedViewBox,
    }
  },
})
</script>
