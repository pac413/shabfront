<template>
  <component
    :is="tag"
    class="btn btn-outline-danger filter-button"
    :class="{ 'filter-button--active': active }"
    v-bind="$attrs"
    @click="$emit('click')"
  >
    <slot />
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AutoTypeSearchOption',
  props: {
    tag: {
      required: false,
      type: String,
      default: 'div',
    },
    active: {
      required: false,
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
})
</script>

<style lang="scss" scoped>
.filter-button {
  padding: 4px 14px;
  font-size: 11px;
  margin: 8px 8px 8px 0;
  font-weight: 600;
  cursor: pointer;
  transition: color 0.5s, background-color 0.5s;
  text-align: center;
  border-radius: 30px;
  background: white;
  color: $colorRed;
  border: 1px solid $colorRed;
  border-radius: 30px;

  &:hover,
  &:active {
    box-shadow: 0 3px 8px 0 rgba(255, 255, 255, 0.4);
    text-decoration: none;
    background-color: $colorRed;
    border: 1px solid $colorRed;
    color: white;
  }

  &:focus {
    outline: none;
    box-shadow: none;
  }
}

.filter-button--active {
  box-shadow: 0 3px 8px 0 rgba(255, 255, 255, 0.4);
  text-decoration: none;
  background-color: $colorRed;
  border: 1px solid $colorRed;
  color: white;
}
</style>
