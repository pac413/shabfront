<template>
  <li class="message-item-new-hosting">
    <div class="message-item-new-hosting__wrapper">
      <div v-html="data.text" />
    </div>
  </li>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { type Message } from '@/types'

export default defineComponent({
  name: 'MessageItemNewHosting',
  props: {
    data: {
      type: Object as () => Message,
      required: true,
    }
  }
})
</script>

<style lang="scss" scoped>
.message-item-new-hosting {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 10px;
}

.message-item-new-hosting__wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px 20px;
  background: $colorLightGrey3;
  border-radius: 6px;
}
</style>
