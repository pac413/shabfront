<template>
  <BCard
    no-body
    class="accordion-card"
  >
    <template #header>
      <h4
        v-b-toggle="id"
        class="mb-0"
      >
        <FaIcon
          v-if="icon"
          :icon="icon"
          class="me-3"
        />
        <span class="title">{{ title }}</span>
        <FaIcon :icon="['fas', 'chevron-down']" />
      </h4>
    </template>
    <BCollapse
      :id="id"
      :accordion="accordionId"
      :visible="visible"
      @show="$emit('show')"
    >
      <div class="p-4">
        <slot />
      </div>
    </BCollapse>
  </BCard>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AccordionCard',
  props: {
    accordionId: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    icon: {
      type: Array as () => string[],
      required: false,
      default: () => []
    },
    visible: {
      type: Boolean,
      required: false,
      default: false
    },
  }
})
</script>

<style lang="scss" scoped>

.accordion-card:not(:last-of-type){
  border-bottom-left-radius: 0;
  border-bottom-right-radius: 0;
  border-bottom: none;
}
.accordion-card:not(:first-of-type){
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}
.card-header {
  border: none;
  padding: 0;
}
:focus {
  outline: none
}
h4 {
  font-size: 1rem;
  font-weight: 600;
  text-transform: uppercase;
  display: flex;
  transition: .3s;
  padding: .8rem 1rem;
  .title {
    flex: 1;
  }
  &.not-collapsed {
    background-color: #DDD;
    svg.fa-chevron-down {
      transform: rotate(-180deg);
      transition: .3s;
    }
  }
  svg {
    flex: 0 0 30px;
    &.fa-chevron-down {
      transform: rotate(0deg);
      transition: .3s;
    }
  }
}

</style>
