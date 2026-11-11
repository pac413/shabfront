<template>
  <BAccordionItem
    :id="id"
    no-body
    class="accordion-card"
  >
    <template #title>
      <h4
        class="mb-0 accordion-card__title"
      >
        <FaIcon
          v-if="dynamicIcon"
          :icon="dynamicIcon"
          class="me-3"
        />
        <span class="title">{{ title }}</span>
        <FaIcon
          v-if="showArrow"
          :icon="['far', 'angle-right']"
        />
      </h4>
    </template>
    <template #default>
      <div class="accordion-item-wrapper">
        <slot />
      </div>
    </template>
  </BAccordionItem>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

export default defineComponent({
  name: 'AccordionMenu',
  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    icon: {
      type: [String, Array] as unknown as () => string | string[],
      required: false,
      default: () => [],
    },
    showArrow: {
      type: Boolean,
      default: true,
    },
  },
  setup(props) {
    const dynamicIcon = computed(() => {
      if (props.icon && props.icon.length > 1) {
        const [prefix, name] = props.icon
        const matches = name.match(/(fa.?)-(.+)/)
        return matches && matches[1]
          ? [matches[1], matches[2]]
          : [prefix, name]
      }
      return null
    })
    return {
      dynamicIcon,
    }
  }
})
</script>

<style lang="scss" scoped>
.accordion-menu {
  border: none;
}

:deep(.accordion-button) {
  &::after {
    display: none;
  }

  &:focus {
    border: none;
    box-shadow: none;
  }

  &:not(:last-of-type){
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: none;
  }

  &:not(:first-of-type){
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }

  &[aria-expanded=true] {
    .accordion-card__title {
      color: $colorRed;
      font-weight: bold;

      svg.fa-angle-right {
        transform: rotate(90deg);
        transition: .3s;
      }
    }
  }
}

:deep(.card-header) {
  border: none;
  padding: 0;
  background: none;
}

:focus {
  outline: none
}

.accordion-card__title {
  font-size: 1rem;
  font-weight: 400;
  display: flex;
  align-items: center;
  width: 100%;
  transition: .3s;

  .title {
    flex: 1;
    width: 300px;
  }

  &:hover {
    color: $colorRed;
  }

  svg {
    flex: 0 0 30px;
    &.fa-angle-right {
      transform: rotate(0deg);
      transition: .3s;
    }
  }
}

:deep(.accordion-body) {
  padding: 0;
}

.accordion-item-wrapper {
  padding: 2rem 1rem 1.5rem 2rem;
}

.rtl-at-root {
  .accordion-item-wrapper {
    padding-right: 2rem;
    padding-left: 1rem;
  }
}
</style>
