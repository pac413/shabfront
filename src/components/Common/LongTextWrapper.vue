<template>
  <span>
    <span v-if="isHtml" :class="{ 'text-wrapper': !expanded }" v-html="text" />
    <span v-else :class="{ 'text-wrapper': !expanded }">{{ text }}</span>
    <a v-if="!expanded" href="#" @click.prevent="expand">{{ $t('common.long-text-wrapper.show-more') }}</a>
  </span>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

import { TextMaxSize } from '@/utils'

export default defineComponent({
  name: 'LongTextWrapper',
  props: {
    text: {
      type: String,
      required: true,
    },
    maxSize: {
      type: Number,
      default: TextMaxSize,
    },
    isHtml: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup() {
    const expanded = ref<boolean>(false)
    const expand = () => {
      expanded.value = true
    }

    return {
      expanded,
      expand,
    }
  },
})
</script>

<style lang="scss" scoped>
.text-wrapper {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
</style>
