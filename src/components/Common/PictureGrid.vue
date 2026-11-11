<template>
  <div>
    <div class="picture-grid">
      <div
        v-for="(item, index) in visiblePics"
        :key="index"
        class="grid-item"
      >
        <slot
          name="item"
          :item="item"
          :index="index"
        />
      </div>
    </div>
    <div
      v-if="totalCount > visiblePics.length"
      class="view-all-link pt-3"
      @click="$emit('view-all')"
    >
      {{ $t('profile-view.intro.view-all') }} ({{ totalCount }})...
    </div>
    <Spinner v-else-if="loading" />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

/**
 * This component just provides the layout as a Picture Grid,
 */
export default defineComponent({
  name: 'PictureGrid',
  props: {
    id: {
      type: String,
      required: true
    },
    items: {
      type: Array as () => readonly any[],
      required: false,
      default: () => []
    },
    total: {
      type: Number,
      default: 0
    },
    loading: {
      type: Boolean,
      required: false,
      default: false
    },
    max: {
      type: Number,
      default: 5
    }
  },
  emits: ['view-all'],
  setup(props) {
    const visiblePics = computed(() => {
      let visibleCount = Math.min(props.max, props.items.length)

      // Disallow one item leftover in the last row (unless it's the only item),
      // so that all images will appear proportionate in grid UI
      if (visibleCount !== 1 && visibleCount % 3 === 1) {
        visibleCount--
      }
      return props.items.slice(0, visibleCount)
    })
    const totalCount = computed(() => {
      return Math.max(props.total, props.items.length)
    })

    return {
      totalCount,
      visiblePics
    }
  }
})
</script>

<style lang="scss" scoped>
:deep(.picture-grid) {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  margin: 0 auto;

  .grid-item {
    flex: 1 0 30%;
    margin: 3px;
    position: relative;
    background: #000;
    border-radius: 2px;
    max-width: 152px;
    max-height: 152px;
    overflow: hidden;

    &:only-of-type {
      max-width: unset;
      max-height: 350px;
    }

    a:hover {
      text-decoration: none;
    }
    .name {
      position: absolute;
      bottom: 2px;
      left: 4px;
      color: white;
      font-size: 0.9em;
      text-shadow: black 0px 0px 10px;
      max-width: 90%;
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }

    .img-responsive {
      display: block;
      max-width: 100%;
      min-width: 100%;
      min-height: 100%;
      object-fit: cover;
      overflow: hidden;
      opacity: 0.9;
      transition: opacity 0.2s;
      border-radius: 2px;

      &.no-hover {
        opacity: 1;
      }

      &:hover {
        opacity: 1;
        transition: opacity 0.5s;
      }

      &:before {
        content: '';
        float: left;
        padding-top: 100%;
      }
    }
  }
}
</style>
