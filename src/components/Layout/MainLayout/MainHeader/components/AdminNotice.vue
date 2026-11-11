<template>
  <BAlert
    v-model="visible"
    class="admin-notice"
    variant="dark"
    dismissible
    @dismissed="$emit('dismissed')"
  >
    <div v-html="$t('main-header.admin-notice')" />
  </BAlert>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'AdminNotice',
  emits: ['dismissed'],
  setup() {
    const visible = ref(true)

    return {
      visible
    }
  }
})
</script>

<style lang="scss" scoped>
.admin-notice {
  background-color: $colorSecondary;
  color: white;
  padding: 0.5rem;
  text-align: center;
  margin-bottom: 0;
  border-radius: unset;

  :deep(a) {
    color: white;
    font-weight: bold;
  }
}

:deep(.btn-close) {
  padding: 0.5rem 1.25rem;
  color: white;
  background: transparent;
  top: 0;
  bottom: 0;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '×';
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
  }

  &:focus, &:hover, &:active {
    color: white;
    outline: none;
    border: none;
    box-shadow: none;
  }
}
</style>
