<template>
  <div class="card">
    <BNavbar
      v-if="title"
      class="card-header"
      :sticky="sticky ? 'top' : undefined"
    >
      <FaIcon
        v-if="icon"
        :icon="icon"
      />

      <div
        v-if="titleOptions.length > 0"
        class="card-header__title"
      >
        <BTabs
          pills
          class="card-header__tabs"
        >
          <BTab
            v-for="option in titleOptions"
            :key="option"
            :title="option"
            @click="$emit('title-changed', option)"
          />
        </BTabs>
      </div>
      <div
        v-else
        class="card-header__title"
        :class="{ clickable: $attrs.onTitleClicked }"
        @click="$emit('title-clicked')"
      >
        {{ title }}
      </div>
      <slot name="menu" />
    </BNavbar>
    <div class="card-content">
      <slot />
    </div>
    <slot name="footer" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'ProfileCard',
  props: {
    icon: {
      type: Array as () => string[],
      default: null,
    },
    title: {
      type: String,
      default: null,
    },
    titleOptions: {
      type: Array as () => string[],
      default: () => [],
    },
    sticky: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['title-changed', 'title-clicked'],
})
</script>

<style lang="scss" scoped>
.card {
  box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #e4e4e4;
  border-radius: 12px;
  margin-bottom: 1.5rem;
  padding: 18px 20px;
}

.card-header {
  color: $colorRed;
  font-family: $headerFont;
  font-size: 1rem;
  font-weight: bold;
  line-height: 2rem;
  border-bottom: none;
  background: none;
  padding: 0;
  margin-bottom: 1rem;

  :deep(.container-fluid) {
    display: flex;
    align-items: center;
    flex: 0 0 auto;
    gap: 10px;
  }
}

.card-header__title {
  flex: 1;

  &.clickable:hover {
    cursor: pointer;
  }
}

.card-header__tabs {
  :deep(.nav-link) {
    background-color: transparent;
    color: #666;
    line-height: 1.2rem;
    padding: .5rem 1.5rem;
    margin: 5px;

    &.active {
      background-color: #666;
      border-radius: 25px;
    }

    &:first-of-type {
      margin-left: 0;
    }
  }
}

.card-content {
  padding: 0 0.5rem;
  margin-bottom: 5px;
}

.rtl-at-root {
  .card-header__tabs {
    :deep(.nav-link) {
      &:first-of-type {
        margin-right: 0;
        margin-left: unset;
      }
    }
  }
}
</style>
