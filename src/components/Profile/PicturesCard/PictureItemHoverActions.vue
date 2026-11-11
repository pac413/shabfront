<template>
  <div class="btn-group">
    <button
      v-b-tooltip.hover.bottom="$t('profile-view.pictures.edit')"
      type="button"
      class="btn btn-secondary btn-sm"
      @click="$emit('edit')"
    >
      <FaIcon :icon="['fal', 'pencil-alt']" />
    </button>
    <button
      v-b-tooltip.hover.bottom="$t('profile-view.pictures.flag')"
      type="button"
      class="btn btn-secondary btn-sm"
      @click="$emit('flag')"
    >
      <FaIcon :icon="['far', 'flag']" />
    </button>
    <button
      v-b-tooltip.hover.bottom="$t('profile-view.admin.remove')"
      type="button"
      class="btn btn-secondary btn-sm"
      @click="$emit('remove')"
    >
      <FaIcon :icon="['fal', 'trash']" />
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'PictureItemHoverActions',
  emits: ['edit', 'flag', 'remove'],
})
</script>

<style lang="scss" scoped>
.btn-group {
  margin: auto;
}
</style>
