<template>
  <span v-b-tooltip.hover.bottom="`${count} views`" class="feed-item-views">
    <FaIcon class="icon" :icon="['fal', 'eye']" /> {{ count }}
  </span>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'FeedItemViews',
  props: {
    count: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const label = computed(() => t('feed.views.views-count', { count: props.count }).toString())

    return {
      label,
    }
  },
})
</script>

<style lang="scss" scoped>
.feed-item-views {
  cursor: pointer;
}
</style>
