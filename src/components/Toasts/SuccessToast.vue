<template>
  <div class="success-toast">
    <div class="success-toast__header">
      <FaIcon :icon="['fal', 'check-circle']" />
      <span class="success-toast__title">{{ title }}</span>
    </div>
    <div class="success-toast__body">
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
.success-toast__header {
  padding: 10px 20px;
  font-size: 1.5em;
  color: #155724;
  background-color: rgba(212,237,218,.85);
  border-bottom: 1px solid rgba(195,230,203,.85);

  span {
    padding: 0 10px;
  }
}

.success-toast__body {
  padding: 20px;
  color: $colorText;
  font-size: .875rem;
  background-color: rgba(230,245,233,.85);
}
</style>
