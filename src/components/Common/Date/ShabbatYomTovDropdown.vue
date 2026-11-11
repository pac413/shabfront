<template>
  <BFormSelect
    v-model="value"
    :options="options"
    @input="onChangeDate"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'

import shabbatYomTovDates from '@/assets/js/dates'
import type { InputOption, ShabbatOrYomTovDetail } from '@/types'

export default defineComponent({
  name: 'ShabbatYomTovDropdown',
  props: {
    modelValue: {
      type: String,
      default: null,
    },
  },
  emits: ['update:modelValue'],
  setup(props, context) {
    const { t } = useI18n()
    const options = computed<InputOption[]>(() => {
      return shabbatYomTovDates.map((item: ShabbatOrYomTovDetail) => ({
        value: item.date,
        text: (
          item.isYomTov
            ? item.yomTov!.enDiaspora
            : t('general.Shabbat') + ' ' + item.parsha!.en
        ).toString() + ', ' + item.date
      }))
    })
    const value = computed(() => props.modelValue)
    const onChangeDate = (date: string) => context.emit('update:modelValue', date)
    return {
      value,
      options,
      onChangeDate,
    }
  }
})
</script>
