<template>
  <div class="container">
    <div class="quote">
      {{ endorsementItem.body }}
    </div>
    <span v-if="endorsementItem.date">, {{ dateDiff(endorsementItem.date) }}</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { type IEndorsementFragmentFragment } from '@/composables/graphql/generated'
import { generateDateDiffString } from '@/utils'

export default defineComponent({
  name: 'FlaggedEndorsementItem',
  props: {
    endorsementItem: {
      required: true,
      type: Object as () => IEndorsementFragmentFragment
    },
  },
  setup() {
    return {
      dateDiff: generateDateDiffString
    }
  }
})
</script>

<style lang="scss" scoped>
</style>
