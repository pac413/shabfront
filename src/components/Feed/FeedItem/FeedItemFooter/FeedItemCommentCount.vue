<template>
  <span v-b-tooltip.hover.bottom="label" class="feed-item-comment-count" @click="$emit('click')">
    <FaIcon class="icon" :icon="['fal', 'comment']" /> {{ count }}
  </span>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

export default defineComponent({
  name: 'FeedItemCommentCount',
  props: {
    count: {
      type: Number,
      required: true,
    },
  },
  emits: ['click'],
  setup(props) {
    const { t } = useI18n()
    const label = computed(() => t('feed.comments.comments-count', { count: props.count }).toString())

    return {
      label,
    }
  },
})
</script>

<style lang="scss" scoped>
.feed-item-comment-count {
  cursor: pointer;
}
</style>
