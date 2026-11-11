<template>
  <div
    ref="wrapperRef"
    class="search-wrapper nav-item"
  >
    <SearchInput
      v-model="keyword"
      :opened="popupVisible"
      @input-focus="bringContainerToTop"
      @open-popup="popupVisible = true"
      @close-popup="onClosePopup"
    />
    <transition name="search-fade">
      <div
        v-if="popupVisible"
        class="search-popup"
        tabindex="0"
      >
        <search-popup
          :keyword="keyword"
          :loading="loading"
          :profiles="searchResult.profiles"
          @close-popup="onClosePopup"
          @selected="$emit('drop', $event)"
        />
      </div>
    </transition>
    <div
      v-show="popupVisible"
      class="search-backdrop"
      @click="onClosePopup"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, type Ref, ref } from 'vue'

import { useDatingAutoTypeSearchQuery } from '@/composables/graphql/generated'
import { MatchmakingType } from '@/types'

import ProfileSearchInput from './ProfileSearchInput.vue'
import ProfileSearchPopup from './ProfileSearchPopup.vue'

export default defineComponent({
  name: 'MatchmakingAutoTypeProfileSearch',
  components: {
    SearchInput: ProfileSearchInput,
    SearchPopup: ProfileSearchPopup
  },
  props: {
    type: {
      required: true,
      type: String as () => MatchmakingType,
      default: MatchmakingType.Guys
    }
  },
  emits: ['drop'],
  setup(props) {
    const keyword: Ref<string> = ref('')
    const popupVisible: Ref<boolean> = ref(false)
    const wrapperRef: Ref<HTMLDivElement | null> = ref(null)

    const variables = computed(() => ({
      keyword: keyword.value,
      menOnly: props.type === MatchmakingType.Guys,
      womenOnly: props.type === MatchmakingType.Girls,
      limit: 5
    }))
    const { result, loading } = useDatingAutoTypeSearchQuery(variables, () => ({
      debounce: 300,
      enabled: !!keyword.value
    }))
    const searchResult = computed(() => result.value?.datingAutoTypeSearch || {
      profiles: []
    })

    const bringContainerToTop = (): void => {
      if (wrapperRef.value) {
        wrapperRef.value.style.zIndex = '999'
      }
    }

    const onClosePopup = (): void => {
      popupVisible.value = false
      wrapperRef.value!.style.zIndex = '1'
    }

    return {
      keyword,
      popupVisible,
      wrapperRef,
      searchResult,
      loading,
      bringContainerToTop,
      onClosePopup
    }
  }
})
</script>

<style scoped lang="scss">
.search-wrapper {
  position: relative;
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
