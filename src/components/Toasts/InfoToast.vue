<template>
  <div class="info-toast">
    <div class="info-toast__header">
      <FaIcon :icon="['fal', 'info-circle']" />
      <span class="info-toast__title">{{ title }}</span>
    </div>
    <div class="info-toast__body">
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
.info-toast__header {
  padding: 10px 20px;
  font-size: 1.5em;
  color: #0c5460;
  background-color: rgba(209,236,241,.85);
  border-bottom-color: rgba(190,229,235,.85);

  .info-toast__title {
    padding: 0 10px;
  }
}

.info-toast__body {
  padding: 20px;
  color: $colorText;
  font-size: .875rem;
  background-color: rgba(229,244,247,.85);
  border-color: rgba(190,229,235,.85);
}
</style>
