<template>
  <component
    :is="tag"
    class="overlay-menu-item d-flex flex-row align-items-center"
    :class="{ 'disabled': disabled }"
    v-bind="$attrs"
    @click="onClick"
  >
    <FaIcon
      class="overlay-menu-item__icon"
      :class="{ 'disabled': disabled }"
      :icon="icon"
      :size="iconSize"
    />
    <div class="overlay-menu-item__label-wrapper">
      <div class="overlay-menu-item__label">
        {{ label }}
      </div>
      <div
        v-if="hint"
        class="overlay-menu-item__hint"
      >
        {{ hint }}
      </div>
    </div>
  </component>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import { useModalStore } from '@/stores/modal'

/**
 * Common component to serve as Overlay Menu item
 *
 * @property icon(required)   fontawesome icon of the menu item
 * @property label(required)  label of the menu item
 * @property tag              Tag name of this component, i.e. router-link, in that case you can attach router-link specific props when using
 * @property iconSize         size of icon
 *
 * Usage
 * <OverlayMenuItem :icon="['fal', 'comment']" label="Comment" />
 * <OverlayMenuItem :icon="['fal', 'comment']" label="Message" tag="router-link" to="/messages" />
 */
export default defineComponent({
  name: 'OverlayMenuItem',
  props: {
    icon: {
      type: Array as () => string[],
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    hint: {
      type: String,
      default: null,
    },
    tag: {
      type: String,
      default: 'div',
    },
    iconSize: {
      type: String,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    }
  },
  emits: ['hide-menu', 'click'],
  setup(props, context) {
    const { closeAllModals } = useModalStore()
    const onClick = (evt: MouseEvent) => {
      closeAllModals()
      context.emit('hide-menu')
      context.emit('click', evt)
    }

    return {
      onClick
    }
  }
})
</script>

<style lang="scss" scoped>
.overlay-menu-item {
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  padding: 4px;

  &.disabled {
    .overlay-menu-item__label, .overlay-menu-item__icon {
      color: $colorGrey !important;
    }
  }

  &:hover:not(.disabled) {
    .overlay-menu-item__label, .overlay-menu-item__icon {
      color: $colorRed !important;
    }
  }

  &:not(:last-child), &.with-indent {
    margin-bottom: 5px;
  }
}

.overlay-menu-item__icon {
  color: $colorActiveGreen;
  width: 20px;
  font-size: 16px;
}

.overlay-menu-item__label-wrapper {
  margin-left: 12px;

  .overlay-menu-item__label {
    color: $colorText;
    font-weight: 500;
  }

  .overlay-menu-item__hint {
    color: $secondary;
    font-size: 12px;
  }
}

.rtl-at-root {
  .overlay-menu-item__label-wrapper {
    margin-left: auto;
    margin-right: 12px;
  }
}
</style>
