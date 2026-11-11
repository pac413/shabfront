<template>
  <div class="container" :style="additionalContainerCss">
    <div
      ref="detailRef"
      :class="{
        default: !expanded,
        expanded,
      }"
      :style="`--lines: ${lines}`"
    >
      <div :style="additionalCss" v-html="text"></div>
    </div>
    <a v-if="hasMore && triggerShowMore" class="anchor" :style="additionalAnchorCss" @click="onClick">
      {{ moreText }}
    </a>
    <a v-if="hasMore && expanded" class="anchor" :style="additionalAnchorCss" @click="onClick">
      {{ lessText }}
    </a>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, onMounted, ref } from 'vue'

export default defineComponent({
  name: 'ShowMoreText',
  props: {
    lines: {
      type: Number,
      default: 3,
    },
    text: {
      type: String,
      default: '',
    },
    additionalContainerCss: {
      type: String,
      default: '',
    },
    additionalContentCss: {
      type: String,
      default: '',
    },
    additionalContentExpandedCss: {
      type: String,
      default: '',
    },
    hasMore: {
      type: Boolean,
      default: true,
    },
    moreText: {
      type: String,
      default: 'Show more',
    },
    lessText: {
      type: String,
      default: 'Show less',
    },
    additionalAnchorCss: {
      type: String,
      default: '',
    },
  },
  emits: ['click'],
  setup(props, context) {
    const expanded = ref(false)
    const triggerShowMore = ref(false)
    const detailRef = ref<HTMLDivElement | null>(null)
    const additionalCss = computed(() => {
      return expanded.value ? props.additionalContentCss : props.additionalContentExpandedCss
    })

    const onClick = () => {
      expanded.value = !expanded.value
      context.emit('click', expanded.value)
    }

    const determineShowMore = () => {
      if (detailRef.value && detailRef.value.offsetHeight < detailRef.value.scrollHeight) {
        triggerShowMore.value = true
      } else {
        triggerShowMore.value = false
      }
    }

    onMounted(() => {
      nextTick(() => {
        determineShowMore()
      })
    })

    return {
      additionalCss,
      expanded,
      onClick,
      triggerShowMore,
    }
  },
})
</script>

<style lang="scss" scoped>
.default {
  --lines: 3;
  white-space: pre-line;
  display: -webkit-box;
  max-width: 100%;
  -webkit-line-clamp: var(--lines);
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.expanded {
  display: block;
  display: -webkit-box;
  white-space: pre-line;
}

.anchor {
  display: block;
  text-align: right;
  padding: 8px;
  margin-bottom: 4px;
  color: #1976d2;
  cursor: pointer;
}

.container {
  padding: 10px;
}
</style>
