<template>
  <div class="search-wrapper nav-item">
    <SearchInput
      ref="inputRef"
      v-model="keyword"
      :opened="popupVisible"
      :search-by="searchBy"
      @open-popup="onOpenPopup"
      @close-popup="onClosePopup"
    />
    <Transition name="search-fade">
      <div
        v-if="popupVisible || mobile"
        class="search-popup"
        :class="{
          'search-popup--mobile': mobile
        }"
        tabindex="0"
      >
        <search-popup
          :keyword="keyword"
          :loading="loading"
          :search-by="searchBy"
          :profiles="searchResult.profiles"
          :locations="searchResult.locations"
          :occupations="searchResult.occupations"
          :typeahead-mode="typeaheadMode"
          @set-search-by="setSearchBy"
          @close-popup="onClosePopup"
          @selected="$emit('selected', $event)"
        />
      </div>
    </Transition>
    <div
      v-show="popupVisible"
      class="search-backdrop"
      @click="onClosePopup"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, type Ref, ref } from 'vue'

import { type IAutoTypeSearchBy, useAutoTypeSearchQuery } from '@/composables/graphql/generated'
import { useGlobalStore } from '@/stores/global'
import { SearchBy } from '@/types'

import AutoTypeSearchInput from './AutoTypeSearchInput.vue'
import AutoTypeSearchPopup from './AutoTypeSearchPopup.vue'

export default defineComponent({
  name: 'AutoTypeSearch',
  components: {
    SearchInput: AutoTypeSearchInput,
    SearchPopup: AutoTypeSearchPopup
  },
  props: {
    mobile: {
      type: Boolean,
      required: false,
      default: false
    },
    typeaheadMode: {
      type: Boolean,
      required: false,
      default: false
    }
  },
  emits: ['selected'],
  setup() {
    const globalStore = useGlobalStore()
    const keyword: Ref<string> = ref('')
    const popupVisible: Ref<boolean> = ref(false)
    const searchBy: Ref<SearchBy> = ref(SearchBy.PEOPLE)
    const inputRef: Ref<InstanceType<typeof AutoTypeSearchInput> | null> = ref(null)

    const variables = computed(() => ({
      keyword: keyword.value,
      searchBy: searchBy.value as unknown as IAutoTypeSearchBy,
      language: globalStore.language.locale as any,
      limit: 5
    }))
    const { result, loading } = useAutoTypeSearchQuery(variables, () => ({
      debounce: 300,
      enabled: !!keyword.value
    }))
    const searchResult = computed(() => result.value?.autoTypeSearch || {
      profiles: [],
      occupations: []
    })

    const setSearchBy = (value: SearchBy): void => {
      searchBy.value = value
    }

    const onOpenPopup = (): void => {
      popupVisible.value = true
    }

    const onClosePopup = (): void => {
      popupVisible.value = false
    }

    return {
      keyword,
      popupVisible,
      searchBy,
      inputRef,
      searchResult,
      loading,
      setSearchBy,
      onOpenPopup,
      onClosePopup
    }
  }
})
</script>

<style scoped lang="scss">
.search-wrapper {
  position: relative;
  flex: 1;
  z-index: 999;
}

.search-popup {
  position: absolute;
  width: 100%;
  box-shadow: rgba(26, 26, 29, 0.3) 0 15px 46px -10px;
  background-color: rgb(255, 255, 255);
  border: 1px solid rgb(235, 235, 235);
  border-radius: 0 0 12px 12px;
  overflow: hidden;

  &:focus {
    outline: none;
  }
}

.search-popup--mobile {
  margin-top: 20px;
  position: relative;
  box-shadow: none;
  border-radius: 4px;
}

.search-fade-enter-active,
.search-fade-leave-active {
  transition: all 200ms linear 0s;
}
.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
  filter: blur(2px);
}

.search-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0, 0.5);
}
</style>
