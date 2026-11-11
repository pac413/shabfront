<template>
  <div
    class="search-results-container"
    :class="{ skeleton: isSkeletonVisible }"
    @click="onHideFilters"
  >
    <div
      ref="innerContainer"
      class="pull-if-rtl inner-container px-3 pb-sm-3 pt-0"
    >
      <SearchStickyHeader
        :search-title="searchTitle"
        :selected-params="selectedParams"
        :profiles="profiles"
        @toggle-filters="onClickFilters"
        @remove-selected-param="removeSearchOption"
      />

      <!-- profile list -->
      <VirtualList
        wrap-class="profile-list"
        data-key="id"
        :data-sources="profileRows"
        :data-component="prospectRowComponent"
        page-mode
        :extra-props="extraProspectRowComponentProps"
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
        :class="{ 'has-selected-params': selectedParams.length > 0 }"
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

    <ScrollToTop />

    <SearchFilters
      :type="type"
      :visible="filterVisible"
      :search-options="searchOptions"
      @close="onHideFilters"
      @change-filter="onChangeFilterOptions"
      @clear="clearPreference"
    />

    <SortByModal
      id="sort-by-modal"
      :sort-option="sortByOption"
      @close="onCloseSortByModal"
      @apply="onSortByApply"
    />
  </div>
</template>

<script lang="ts">
import { debounce } from 'lodash'
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useMq } from 'vue3-mq'
import VirtualList from 'vue3-virtual-scroll-list'
import { useStore } from 'vuex'

import ProspectRow from '@/components/Common/ProspectRow.vue'
import ScrollToTop from '@/components/Common/ScrollToTop.vue'
import SearchFilters from '@/components/Search/SearchFilters.vue'
import SearchStickyHeader from '@/components/Search/SearchStickyHeader.vue'
import SortByModal from '@/components/Search/SortByModal.vue'
import ProspectCardSkeleton from '@/components/Skeleton/ProspectCardSkeleton.vue'
import {
  useModal,
} from '@/composables'
import { useProfileSearchResult } from '@/composables'
import { storeKey } from '@/store'
import { type SearchSortBy, SearchTypes } from '@/types'
import {
  checkIfScrolledOverPercentage,
  PreferenceSearchModeKeys,
} from '@/utils'
import { getPeopleFilterType } from '@/utils/search'

export default defineComponent({
  name: 'SearchResultsGrid',
  components: {
    VirtualList,
    ScrollToTop,
    SearchFilters,
    SearchStickyHeader,
    SortByModal,
    ProspectCardSkeleton
  },
  setup() {
    const store = useStore(storeKey)
    const mq = useMq()
    const route = useRoute()
    const modal = useModal()
    const {
      searchTitle,
      clearPreference,
      clearSearchResult,
      initOptions,
      loading,
      fetchMoreProfiles,
      onChangeFilterOptions,
      preparePreferenceToSave,
      profileRows,
      profiles,
      removeSearchOption,
      saveSortByOption,
      searchOptions,
      selectedParams,
      sortByOption,
    } = useProfileSearchResult()
    const isAdmin = computed(() => store.state.auth.isAdmin)
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
    const extraProspectRowComponentProps = computed(() => {
      return { selectable: true }
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

    const onCloseSortByModal = () => {
      modal.hide('sort-by-modal')
    }

    const onSortByApply = async (sortByOption: SearchSortBy | null) => {
      onCloseSortByModal()
      await saveSortByOption(sortByOption)
    }

    onMounted(() => {
      nextTick(() => {
        clientWidth.value = innerContainer.value?.clientWidth || 0
      })
    })

    watch(() => route.query, async () => {
      if (route.name !== 'Search') {
        return
      }
      isSkeletonVisible.value = true // show skeleton loader
      await initOptions()

      if (checkIfNavigatedFromOut()) {
        const { query } = route
        searchOptions.value = {
          peopleFilterType: getPeopleFilterType(query.type as string | undefined),
        }
        sortByOption.value = query.sortBy as SearchSortBy
      }
      clearSearchResult()
      await fetchMoreProfiles()
      isSkeletonVisible.value = false // hide skeleton loader

      /**
       * save search query into user preference
       */
      const preference = preparePreferenceToSave()
      await store.dispatch('search/setSearchPreference', preference)
    }, { immediate: true })

    return {
      clearPreference,
      debouncedOnScroll,
      extraProspectRowComponentProps,
      filterVisible,
      innerContainer,
      isAdmin,
      isSkeletonVisible,
      loading,
      onChangeFilterOptions,
      onClickFilters,
      onCloseSortByModal,
      onHideFilters,
      onSortByApply,
      profiles,
      profileRows,
      prospectRowComponent: ProspectRow,
      removeSearchOption,
      searchOptions,
      searchTitle,
      selectedParams,
      skeletonCardCount,
      skeletonCardWidth,
      sortByOption,
      type: SearchTypes.SEARCH,
    }
  }
})
</script>

<style src="./SearchResultsGrid.style.scss" lang="scss" scoped />
