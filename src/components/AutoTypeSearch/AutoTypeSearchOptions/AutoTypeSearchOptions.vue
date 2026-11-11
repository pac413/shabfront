<template>
  <div class="search-options">
    <div class="search-group">
      <search-group-title>
        {{ $t('outer-search.searchBy') }}

        <template #action>
          <RouterLink
            :to="{ name: 'AdvancedSearch' }"
            @click="$emit('close-popup')"
          >
            {{ $t('outer-search.advancedSearch') }}
          </RouterLink>
        </template>
      </search-group-title>

      <div class="filter-buttons">
        <search-option
          v-for="option in searchByOptions"
          :key="option.value"
          :active="option.value === searchBy"
          @click="$emit('update:search-by', option.value)"
        >
          {{ $t(option.title) }}
        </search-option>
      </div>
    </div>

    <div class="search-group">
      <search-group-title>
        {{ $t('outer-search.exploreShabbat') }}
      </search-group-title>

      <div class="filter-buttons">
        <search-option
          v-for="guideOption in guideOptions"
          :key="guideOption.title"
          tag="RouterLink"
          :to="guideOption.url"
          @click="$emit('close-popup')"
        >
          {{ $t(guideOption.title) }}
        </search-option>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useRouter } from 'vue-router'

import AutoTypeSearchGroupTitle from '@/components/AutoTypeSearch/Common/AutoTypeSearchGroupTitle.vue'
import { SearchBy, SearchSortBy } from '@/types'
import { DEFAULT_ME_PROXIMITY } from '@/utils'

import AutoTypeSearchOption from './AutoTypeSearchOption.vue'

type GuideOption = {
  title: string
  url: string
}

export default defineComponent({
  name: 'AutoTypeSearchOptions',
  components: {
    SearchGroupTitle: AutoTypeSearchGroupTitle,
    SearchOption: AutoTypeSearchOption,
  },
  props: {
    searchBy: {
      required: true,
      type: String as () => SearchBy
    }
  },
  emits: ['close-popup', 'update:search-by'],
  setup() {
    const router = useRouter()
    const  searchByOptions = [
      // { title: 'outer-search.all', value: SearchBy.ALL },
      { title: 'outer-search.people', value: SearchBy.PEOPLE },
      { title: 'outer-search.locations', value: SearchBy.LOCATIONS },
      { title: 'outer-search.occupations', value: SearchBy.OCCUPATIONS }
    ]

    const guideOptions: Array <GuideOption> = [
      {
        title: 'outer-search.hostsNearby',
        url: router.resolve({
          name: 'Search',
          query: {
            type: 'hosts',
            locationMe: 'true',
            proxRadius: `${DEFAULT_ME_PROXIMITY}`,
            sortBy: SearchSortBy.proximity
          }
        }).href
      },
      {
        title: 'outer-search.guestsNearby',
        url: router.resolve({
          name: 'Search',
          query: {
            type: 'guests',
            locationMe: 'true',
            proxRadius: `${DEFAULT_ME_PROXIMITY}`,
            sortBy: SearchSortBy.proximity
          }
        }).href
      },
      {
        title: 'outer-search.recentHosts',
        url: router.resolve({
          name: 'Search',
          query: {
            type: 'hosts',
            recentMembership: 'true',
          }
        }).href
      },
      {
        title: 'outer-search.recentGuests',
        url: router.resolve({
          name: 'Search',
          query: {
            type: 'guests',
            recentMembership: 'true',
          }
        }).href
      }
    ]
    return {  
      searchByOptions,
      guideOptions
    }
  }
})
</script>

<style lang="scss" scoped>
.search-group {
  margin: 0 0 16px;
  padding: 0 12px;
}

.filter-buttons {
  padding: 0;
  margin: 0;
  list-style: none;
}
</style>
