<template>
  <BModal
    :id="id"
    v-model="isVisible"
    :title="$t('modals.sort-options.title')"
    size="md"
    content-class="sortby-modal-content"
    @hide="onHide"
  >
    <div
      class="content p-2"
      :class="rtlClassName"
    >
      <div class="d-flex flex-column pull-if-rtl">
        <h4 class="sort-subtitle pull-if-rtl-label" />
        <BFormCheckbox
          v-for="(option, index) in options"
          :key="index"
          v-model="sortOptionValue"
          class="check-button pull-if-rtl-label"
          :value="option.value"
          @change="onChangeFilter(option.value, $event)"
        >
          {{ $t(`modals.sort-options.${option.text}`) }}
        </BFormCheckbox>
      </div>
    </div>
    <template #footer>
      <BButton
        variant="primary"
        @click="$emit('apply', sortOptionValue)"
      >
        {{ $t('modals.sort-options.apply') }}
      </BButton>
    </template>
  </BModal>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from 'vue'
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import { useRegisterModal } from '@/composables'
import { type SearchSortBy } from '@/types'
import { SortByModalOptions } from '@/utils'

export default defineComponent({
  name: 'SortByModal',
  props: {
    id: {
      type: String,
      required: true,
    },
    sortOption: {
      type: String as () => SearchSortBy | null,
      default: null,
    },
  },
  emits: ['apply'],
  setup(props) {
    const { id } = toRefs(props)
    const { locale } = useI18n()
    const sortOptionValue = ref<SearchSortBy | null>(null)
    const rtlClassName = computed(() => {
      let className = ''
      if (locale.value === 'he') {
        className += 'rtl-at-root'
      }
      if (locale.value === 'ru') {
        className += 'locale-russian'
      }
      return className
    })
    const { isVisible } = useRegisterModal(id)

    const onChangeFilter = (key: SearchSortBy, val: boolean) => {
      if (val) {
        sortOptionValue.value = key
      }
    }

    const onHide = (event: any) => {
      if (event.trigger === 'backdrop') {
        sortOptionValue.value = props.sortOption
      }
    }

    watch(() => props.sortOption, () => {
      sortOptionValue.value = props.sortOption
    }, { immediate: true })

    return {
      isVisible,
      onChangeFilter,
      onHide,
      options: SortByModalOptions,
      rtlClassName,
      sortOptionValue,
    }
  }
})
</script>

<style scoped lang="scss">
  .content {

    .check-button {
      font-size: .9rem;
      margin-bottom: 0.5rem;
    }
  }

</style>
