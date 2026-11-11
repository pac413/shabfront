<template>
  <div
    class="search-results-container"
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
      
      <div class="profile-list">
        <Spinner v-if="loading" />
        <div
          v-else-if="!profiles.length"
          class="text-center text-muted"
        >
          {{ $t('general.no-results') }}
        </div>
        <ProspectListItem
          v-for="profile in profiles"
          v-else
          :key="profile.id"
          :profile="profile"
          :selectable="true"
        />
      </div>

      <SearchPagination
        class="pagination"
        :total="total"
        :current-page="currentPage"
        :size-per-page="sizePerPage"
        @size-per-page-changed="onSizePerPageChanged"
        @page-changed="onPageChanged"
      />
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
import { computed, defineComponent, nextTick, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import ProspectListItem from '@/components/Common/ProspectListItem.vue'
import ScrollToTop from '@/components/Common/ScrollToTop.vue'
import SearchFilters from '@/components/Search/SearchFilters.vue'
import SearchPagination from '@/components/Search/SearchPagination.vue'
import SearchStickyHeader from '@/components/Search/SearchStickyHeader.vue'
import SortByModal from '@/components/Search/SortByModal.vue'
import { useModal } from '@/composables'
import { useProfileSearchResult } from '@/composables/useProfileSearchResult'
import { storeKey } from '@/store'
import { type SearchSortBy, SearchTypes } from '@/types'
import { PreferenceSearchModeKeys } from '@/utils'
import { getPeopleFilterType } from '@/utils/search'

export default defineComponent({
  name: 'SearchResultsList',
  components: {
    ScrollToTop,
    SearchFilters,
    SearchStickyHeader,
    SortByModal,
    ProspectListItem,
    SearchPagination,
  },
  setup() {
    const store = useStore(storeKey)
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
      profiles,
      removeSearchOption,
      saveSortByOption,
      searchOptions,
      selectedParams,
      sortByOption,
      total,
      sizePerPage,
      currentPage,
      onSizePerPageChanged,
      onPageChanged
    } = useProfileSearchResult(true)
    const isAdmin = computed(() => store.state.auth.isAdmin)
    const clientWidth = ref<number>(0)
    const innerContainer = ref<HTMLDivElement | null>(null)
    const filterVisible = ref<boolean>(false)
    
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
      await initOptions()

      if (checkIfNavigatedFromOut()) {
        const { query } = route
        searchOptions.value = {
          peopleFilterType: getPeopleFilterType(query.type as string | undefined),
        }
        sortByOption.value = query.sortBy as SearchSortBy
      }
      currentPage.value = 1
      clearSearchResult()
      await fetchMoreProfiles()

      /**
       * save search query into user preference
       */
      const preference = preparePreferenceToSave()
      await store.dispatch('search/setSearchPreference', preference)
    }, { immediate: true })

    return {
      clearPreference,
      currentPage,
      filterVisible,
      innerContainer,
      isAdmin,
      loading,
      onChangeFilterOptions,
      onClickFilters,
      onCloseSortByModal,
      onHideFilters,
      onPageChanged,
      onSizePerPageChanged,
      onSortByApply,
      profiles,
      removeSearchOption,
      saveSortByOption,
      searchOptions,
      searchTitle,
      selectedParams,
      sizePerPage,
      sortByOption,
      total,
      type: SearchTypes.SEARCH,
    }
  }
})
</script>

<style src="./SearchResultsList.style.scss" lang="scss" scoped />
