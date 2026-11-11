
<template>
  <div class="date-picker-wrapper">
    <VueDatePicker
      ref="datepickerRef"
      v-model="date"
      auto-apply
      calendar-cell-class-name="date-picker-cell"
      :disabled-dates="disabledDates"
      :enable-time-picker="false"
      :highlight="[date]"
      highlight-disabled-days
      :min-date="futureOnly ? new Date() : undefined"
      model-type="yyyy-MM-dd"
      no-today
      :position="right ? 'right' : 'center'"
      week-start="0"
    >
      <template #trigger>
        <BButton
          size="md"
          class="date-picker-trigger"
          :variant="variant"
        >
          <FaIcon
            :icon="['far', 'calendar']"
            size="lg"
          />
        </BButton>
      </template>
    </VueDatePicker>
  </div>
</template>

<script lang="ts">
import '@vuepic/vue-datepicker/dist/main.css'

import VueDatePicker from '@vuepic/vue-datepicker'
import { computed, defineComponent, ref } from 'vue'

import shabbatYomTovDates from '@/assets/js/dates'
import moment from '@/plugins/moment'

const validDates: string[] = shabbatYomTovDates.map(item => item.date)

export default defineComponent({
  name: 'ShabbatYomTovDatePicker',
  components: { VueDatePicker },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    variant: {
      type: String,
      default: null,
    },
    right: {
      type: Boolean,
      required: false,
      default: false
    },
    futureOnly: {
      type: Boolean,
      required: false,
      default: false
    },
  },
  emits: ['update:modelValue', 'change'],
  setup(props, context) {
    const datepickerRef = ref<typeof VueDatePicker | null>(null)
    const date = computed({
      get: () => new Date(props.modelValue),
      set: (value: Date) => {
        context.emit('change', value)
        context.emit('update:modelValue', value)
      }
    })
    const disabledDates = (date: Date): boolean => {
      // isBefore() defaults to current date
      if (props.futureOnly && moment(date).isBefore()) {
        return true
      }

      return !validDates.includes(moment(date).format('yyyy-MM-DD'))
    }

    const focus = () => {
      datepickerRef.value?.openMenu()
    }

    context.expose({ focus })

    return {
      date,
      datepickerRef,
      disabledDates,
      focus,
    }
  }
})
</script>

<style lang="scss" scoped>
.date-picker-wrapper {
  display: inline-flex;
}

.date-picker-trigger{
  border: none;
  &.btn-primary {
    background: lighten($colorRed, 0.5);
    border-color: lighten($colorRed, 0.5);
  }
}

:deep(.date-picker-cell) {
  border-radius: 50%;
  
  &.dp__cell_highlight {
    color: white;
    background-color: $colorRed;
    box-shadow: 0 0 0 0.2rem rgba(246,86,86,.5);
  }
}
</style>
