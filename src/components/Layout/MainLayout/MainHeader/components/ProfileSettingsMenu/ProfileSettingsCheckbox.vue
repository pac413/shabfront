<template>
  <div
    :id="`${item.id}-group`"
    class="profile-settings-checkbox"
  >
    <div class="label">
      {{ decamelizedLabel }}
    </div>
    <BFormCheckbox
      :id="item.id"
      :model-value="value"
      switch
      size="md"
      @change="handleChange"
    />
  </div>
</template>

<script lang="ts">
import decamelize from 'decamelize'
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import type { ProfileSettingsItem, ProfileSettingsValueType } from '@/types'

export default defineComponent({
  name: 'ProfileSettingsCheckbox',
  props: {
    item: {
      type: Object as () => ProfileSettingsItem,
      required: true,
    },
    value: {
      type: null,
      required: true,
    },
  },
  emits: ['change'],
  setup(props, context) {
    const { t } = useI18n()
    const decamelizedLabel = computed(() =>
      t(decamelize(`profile-settings.${props.item.id}`, { separator: '-' }))
    )
    const handleChange = (value: ProfileSettingsValueType) => {
      context.emit('change', props.item, value)
    }

    return {
      decamelizedLabel,
      handleChange,
    }
  }
})
</script>

<style lang="scss" scoped>
.profile-settings-checkbox {
  display: flex;
}

.label {
  flex: 1;
  font-weight: 700;
  font-size: .8rem;
}
</style>
