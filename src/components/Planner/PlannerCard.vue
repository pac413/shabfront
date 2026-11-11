<template>
  <div class="planner-card my-4">
    <div class="card">
      <h4 v-if="title" class="card-title py-2">
        {{ title }}
      </h4>
      <div class="menu">
        <slot name="menu" />
      </div>
      <BOverlay :show="loading" rounded="lg" spinner-variant="secondary">
        <div class="card-content">
          <slot />
        </div>
      </BOverlay>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import { storeKey } from '@/store'

export default defineComponent({
  name: 'PlannerCard',
  props: {
    title: {
      type: String,
      default: null,
    },
  },
  setup() {
    const store = useStore(storeKey)
    const loading = computed<boolean>(() => store.getters['planner/isLoading'])
    return {
      loading,
    }
  },
})
</script>

<style lang="scss" scoped>
.card {
  font-size: 14px;
  border: 1px solid #e4e4e4;
  border-radius: 12px;
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
  margin-bottom: 1rem;
  position: relative;
  padding: 1rem 2rem;

  :deep(.btn) {
    font-size: 1rem;
    align-items: center;
    justify-content: center;
    display: inline-flex;
  }
}

.card-title {
  font-family: $headerFont;
  font-weight: bold;
  font-size: 1.2rem;
  flex: 1;

  &.clickable:hover {
    cursor: pointer;
  }
}

.menu {
  position: absolute;
  top: 1rem;
  right: 2rem;
  display: flex;
}
.card-content {
  font-size: 1em;
  display: flex;
  flex-direction: column;
}

.rtl-at-root {
  .menu {
    right: unset;
    left: 2rem;
  }
}
</style>
