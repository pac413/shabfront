<template>
  <component :is="searchResultsView" />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import { storeKey } from '@/store'

import SearchResultsGrid from './SearchResultsGrid.vue'
import SearchResultsList from './SearchResultsList.vue'

export default defineComponent({
  name: 'SearchResults',
  components: {
    SearchResultsGrid,
    SearchResultsList,
  },
  setup() {
    const store = useStore(storeKey)
    const currentSettings = computed(() => store.state.profileSettings.currentSettings)
    const paginatedSearchResult = computed(() =>
      currentSettings.value ? currentSettings.value.paginatedSearchResult ?? false : false,
    )
    const searchResultsView = computed(() => (paginatedSearchResult.value ? 'SearchResultsList' : 'SearchResultsGrid'))

    return {
      currentSettings,
      searchResultsView,
    }
  },
})
</script>
