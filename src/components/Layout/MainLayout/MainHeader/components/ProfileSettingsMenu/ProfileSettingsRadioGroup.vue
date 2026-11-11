<template>
  <BFormGroup
    :id="itemId"
    :label="decamelizedLabel"
    class="form-group"
  >
    <BFormRadioGroup
      :id="item.id"
      stacked
      :model-value="value"
      @change="handleChange"
    >
      <BFormRadio
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.text }}
      </BFormRadio>
    </BFormRadioGroup>
  </BFormGroup>
</template>

<script lang="ts">
import decamelize from 'decamelize'
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import type { ProfileSettingsItem, ProfileSettingsValueType } from '@/types'

export default defineComponent({
  name: 'ProfileSettingsRadioGroup',
  props: {
    item: {
      type: Object as () => ProfileSettingsItem,
      required: true,
    },
    value: {
      type: [String, Boolean] as unknown as () => ProfileSettingsValueType,
      required: true,
    },
  },
  emits: ['change'],
  setup(props, context) {
    const { t } = useI18n()
    const decamelizedLabel = computed(() =>
      t(decamelize(`profile-settings.${props.item.id}`, { separator: '-' })).toString()
    )
    const itemId = computed(() => `${props.item.id}-group`)
    const options = computed(() => props.item.options?.map((option) => {
      const translationKey = option.toLowerCase().replace(/_/g, '-')
      return {
        value: option,
        text: t(
          decamelize(
            `profile-settings.options.${props.item.id}.${translationKey}`,
            { separator: '-' },
          ),
        ).toString(),
      }
    }) || [])
    const handleChange = (value: ProfileSettingsValueType) => {
      context.emit('change', props.item, value)
    }
    return {
      decamelize,
      decamelizedLabel,
      itemId,
      handleChange,
      options,
    }
  }
})
</script>

<style lang="scss" scoped>
.form-group {
  margin-bottom: 1rem;
}
</style>
