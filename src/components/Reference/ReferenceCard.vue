<template>
  <BCard no-body>
    <BCardHeader class="reference-card-header">
      <BButton
        variant="transparent"
        class="reference-edit-btn float-end"
        @click="$emit('edit', reference)"
      >
        <FaIcon :icon="['fal', 'pencil-alt']" />
      </BButton>
      <BButton
        variant="transparent"
        class="reference-edit-btn float-end"
        @click="$emit('delete', reference)"
      >
        <FaIcon :icon="['fal', 'trash']" />
      </BButton>
    </BCardHeader>
    <BCardBody>
      <BCardTitle> {{ reference.name }} </BCardTitle>
      <BCardSubtitle
        v-if="relationship"
        class="mb-2"
      >
        {{ relationship }}
      </BCardSubtitle>
      <BListGroup flush>
        <BListGroupItem
          v-if="reference.phone"
          class="reference-item"
        >
          <FaIcon
            :icon="['fal', 'phone']"
            class="me-1"
          />
          <a :href="`tel:${reference.phone}`">{{ reference.phone }}</a>
        </BListGroupItem>
        <BListGroupItem
          v-if="reference.email"
          class="reference-item"
        >
          <FaIcon
            :icon="['fal', 'envelope']"
            class="me-1"
          />
          <a :href="`mailto:${reference.email}`">{{ reference.email }}</a>
        </BListGroupItem>
        <BListGroupItem class="reference-item">
          <FaIcon
            :icon="['fal', 'user']"
            class="me-1"
          />
          {{ siteRole }}
        </BListGroupItem>
      </BListGroup>
    </BCardBody>
  </BCard>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import { type Reference } from '@/types'
import { capitalizeFirstLetter } from '@/utils'

export default defineComponent({
  name: 'ReferenceCard',
  props: {
    reference: {
      type: Object as () => Reference,
      required: true,
    },
  },
  emits: ['edit', 'delete'],
  setup(props) {
    const { t } = useI18n()
    const relationship = computed(() => {
      const { relationship } = props.reference
      if (!relationship) { return null }
      return relationship
        .map(item => capitalizeFirstLetter(item))
        .join(' | ')
    })

    const siteRole = computed(() => {
      return t(
        `profile-edit.references.${props.reference.siteRole.toLowerCase()}`
      ).toString()
    })

    return {
      relationship,
      siteRole,
    }
  }
})
</script>

<style lang="scss" scoped>
.reference-item {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 0px;
  padding-right: 0px;

  &:last-child {
    border-bottom: 0px;
  }
}

.reference-card-header {
  padding: unset;
  background-color: transparent;
}
</style>
