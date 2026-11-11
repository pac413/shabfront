<template>
  <div class="error-toast">
    <div class="error-toast__header">
      <FaIcon :icon="['fal', 'times-circle']" />
      <span class="error-toast__title">{{ title }}</span>
    </div>
    <div v-if="message" class="error-toast__body">
      {{ message }}
    </div>
  </div>
</template>

<script setup lang="ts">
import '@/plugins/fontawesome'

import { FontAwesomeIcon as FaIcon } from '@fortawesome/vue-fontawesome'

defineProps<{
  title: string
  message: string
}>()
</script>

<style lang="scss" scoped>
.error-toast__header {
  padding: 10px 20px;
  font-size: 1.5rem;
  border-bottom: 1px solid rgba(0,0,0,.05);
  color: $colorRed;

  span {
    padding: 0 10px;
  }
}

.error-toast__body {
  padding: 20px;
  color: $colorText;
  font-size: .875rem;
}
</style>
