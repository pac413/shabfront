<template>
  <ContentLoader :width="width" :height="height" :speed="1">
    <rect :x="0" :y="0" :rx="borderRadius" :ry="borderRadius" :width="width" :height="width" />
    <rect
      :x="width / 3"
      :y="width + 10"
      :rx="borderRadius"
      :ry="borderRadius"
      :width="width / 3"
      :height="textHeight"
    />
    <rect
      :x="width / 5"
      :y="width + textHeight + 20"
      :rx="borderRadius"
      :ry="borderRadius"
      :width="(width * 3) / 5"
      :height="textHeight"
    />
  </ContentLoader>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import ContentLoader from '@/components/Common/ContentLoader/ContentLoader.vue'

export default defineComponent({
  name: 'ProspectCardSkeleton',
  components: {
    ContentLoader,
  },
  props: {
    width: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const borderRadius = 5
    const textHeight = 10
    const height = computed(() => props.width + 2 * textHeight + 20)

    return {
      borderRadius,
      textHeight,
      height,
    }
  },
})
</script>

<style lang="scss" scoped></style>
