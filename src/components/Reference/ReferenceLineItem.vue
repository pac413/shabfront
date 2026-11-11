<template>
  <div class="reference-line-item row py-3 m-0 align-items-center">
    <div class="col">
      <strong>
        {{ reference.name }}
      </strong>
      <small
        v-if="relationship"
        class="ms-1 text-secondary text-uppercase"
      >
        {{ relationship }}
      </small>
    </div>
    <div class="col reference-details">
      <IconItem
        v-if="reference.phone"
        :icon="['fal', 'phone']"
        :item-text="reference.phone"
      />
      <IconItem
        v-if="reference.email"
        :icon="['fal', 'envelope']"
        :item-text="reference.email"
        :item-link="`mailto:${reference.email}`"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import { type Reference } from '@/types'
import { capitalizeFirstLetter } from '@/utils'

export default defineComponent({
  name: 'ReferenceLineItem',
  props: {
    reference: {
      type: Object as () => Reference,
      required: true,
    },
  },
  setup(props) {
    const relationship = computed(() => {
      const { relationship } = props.reference
      if (!relationship) { return null }

      return relationship
        .map(item => capitalizeFirstLetter(item))
        .join(' | ')
    })

    return {
      relationship
    }
  }
})
</script>

<style lang="scss" scoped>
.reference-details {
  font-size: .9em;
}
.reference-line-item:not(:last-of-type) {
    border-bottom: solid 1px #EEE;
}
</style>
