<template>
  <div
    class="dating-container"
    :class="{'skeleton': isSkeletonVisible}"
    @click="onHideFilters"
  >
    <div
      ref="innerContainer"
      class="pull-if-rtl inner-container px-3 pb-sm-3 pt-0"
    >
      <!-- <h5 class="statistics pull-if-rtl-label d-none d-sm-block">
        Displaying
        <span class="blue">{{ listTotal }}</span> of a total of
        <span class="blue">{{ totalResults }}</span> prospects and
        <span class="green">{{ totalSingles }}</span>
        singles overall.
      </h5> -->
      <div 
        class="sticky-subheader pt-sm-3"
        :style="{ top: `${mainHeaderHeight}px` }"
      >
        <div class="sticky-subheader row align-items-center py-2 px-5">
          <div class="title">
            <div class="row justify-content-center justify-content-md-start m-0">
              <h5 class="statistics pull-if-rtl-label d-none d-sm-block">
                {{ $t('sticky-subheader.dating-title') }}
              </h5>
            </div>
          </div>
          <div class="w-auto mt-3 mt-md-0">
            <div class="row align-items-center justify-content-center justify-content-md-end mx-0">
              <BButton
                variant="primary"
                class="filter-button"
                @click="onClickFilters"
              >
                {{ $t('sticky-subheader.narrow-your-search') }}
                <FaIcon
                  :icon="['fal', 'sliders-h']"
                  class="ms-1"
                />
              </BButton>
            </div>
          </div>
        </div>
      </div>

      <!-- profile list -->
      <VirtualList
        class="profile-list"
        data-key="id"
        :data-sources="profileRows"
        :data-component="prospectRowComponent"
        page-mode
        @scroll="debouncedOnScroll"
      />

      <div
        v-if="!loading && !profiles.length"
        class="text-center text-muted"
      >
        {{ $t('general.no-results') }}
      </div>

      <!-- skeleton loader -->
      <div
        v-if="isSkeletonVisible"
        class="profile-list-skeleton"
      >
        <ProspectCardSkeleton
          v-for="index in skeletonCardCount"
          :key="`skeleton-${index}`"
          :width="skeletonCardWidth"
          class="skeleton-card"
        />
      </div>

      <Spinner v-if="!isSkeletonVisible && loading" />
    </div>

    <ScrollToTop position="right" />

    <SearchFilters
      :type="type"
      :visible="filterVisible"
      :search-options="searchOptions"
      @close="onHideFilters"
      @change-filter="onChangeFilterOptions"
      @clear="clearPreference"
      @reset="onApplyDefaults"
    />
  </div>
</template>

<script lang="ts">
import { debounce } from 'lodash'
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMq } from 'vue3-mq'
// @ts-ignore
import VirtualList from 'vue3-virtual-scroll-list'

import ProspectRow from '@/components/Common/ProspectRow.vue'
import ScrollToTop from '@/components/Common/ScrollToTop.vue'
import SearchFilters from '@/components/Search/SearchFilters.vue'
import ProspectCardSkeleton from '@/components/Skeleton/ProspectCardSkeleton.vue'
import { useDatingSearchResult } from '@/composables/useDatingSearchResult'
import { useGlobalStore } from '@/stores/global'
import {
  type SearchSortBy,
  SearchTypes
} from '@/types'
import { checkIfScrolledOverPercentage, PreferenceSearchModeKeys } from '@/utils'
import { getPeopleFilterType } from '@/utils/search'

export default defineComponent({
  name: 'Dating',
  components: {
    VirtualList,
    ScrollToTop,
    SearchFilters,
    ProspectCardSkeleton
  },
  setup() {
    const globalStore = useGlobalStore()
    const route = useRoute()
    const mq = useMq()
    const {
      applyDefault,
      clearPreference,
      clearSearchResult,
      fetchNewProfiles,
      fetchMoreProfiles,
      initOptions,
      loading,
      onChangeFilterOptions,
      profileRows,
      profiles,
      removeSearchOption,
      searchOptions,
      selectedParams,
      sortByOption,
    } = useDatingSearchResult()

    const mainHeaderHeight = computed(() => globalStore.mainHeaderHeight)
    const innerContainer = ref<HTMLDivElement | null>(null)
    const clientWidth = ref<number>(0)
    const isSkeletonVisible = ref<boolean>(false)
    const filterVisible = ref<boolean>(false)
    
    const skeletonCardCount = computed(() => {
      if (clientWidth.value) {
        if (mq.mobile || mq.tablet) {
          return 12
        } else {
          return 20
        }
      }
      return 20
    })
    const skeletonCardWidth = computed(() => {
      if (clientWidth.value) {
        if (mq.mobile || mq.tablet) {
          return clientWidth.value / 3 - 32 // 2rem = 32px
        } else {
          return clientWidth.value / 5 - 32 // 2rem = 32px
        }
      }
      return 0
    })

    const checkIfNavigatedFromOut = () => {
      const query = { ...route.query }

      // delete search type, name, occupation
      PreferenceSearchModeKeys.forEach((key) => delete query[key])

      // delete sort by
      delete query.sortBy

      return !Object.keys(query).length
    }

    const onClickFilters = (event: Event) => {
      filterVisible.value = !filterVisible.value
      event.stopPropagation()
    }

    const onHideFilters = () => {
      filterVisible.value = false
    }

    const onScroll = async () => {
      if (checkIfScrolledOverPercentage()) {
        await fetchMoreProfiles()
      }
    }

    const debouncedOnScroll = debounce(onScroll, 50)

    onMounted(() => {
      nextTick(() => {
        clientWidth.value = innerContainer.value?.clientWidth || 0
      })
    })

    watch(() => route.query, async () => {
      if (route.name !== 'Dating') {
        return
      }
      isSkeletonVisible.value = true // show skeleton loader
      clearSearchResult()
      await initOptions()

      if (checkIfNavigatedFromOut()) {
        const { query } = route
        searchOptions.value = {
          peopleFilterType: getPeopleFilterType(query.type as string | undefined),
        }
        sortByOption.value = query.sortBy as SearchSortBy
      }
      await fetchNewProfiles()
      isSkeletonVisible.value = false // hide skeleton loader
    }, { immediate: true })

    return {
      clearPreference,
      debouncedOnScroll,
      filterVisible,
      innerContainer,
      isSkeletonVisible,
      loading,
      mainHeaderHeight,
      onApplyDefaults: applyDefault,
      onChangeFilterOptions,
      onClickFilters,
      onHideFilters,
      profiles,
      profileRows,
      prospectRowComponent: ProspectRow,
      removeSearchOption,
      searchOptions,
      selectedParams,
      skeletonCardCount,
      skeletonCardWidth,
      sortByOption,
      type: SearchTypes.DATING,
    }
  }
})
</script>

<style src="./style.scss" lang="scss" scoped />
