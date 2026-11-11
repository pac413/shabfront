<template>
  <PlannerCard :title="$t(`planner.suggestions-for-${role}`)">
    <div
      v-if="profiles.length"
      class="suggestions-wrapper py-3"
    >
      <ProspectCard
        v-for="(profile, index) in profiles"
        :key="index"
        class="profile-card"
        :source="profile"
      />
      <!-- View More not working yet. Temporarily commenting it out
        <RouterLink to="/shabbat-suggestions" class="view-all-link" tag="div">
        {{ $t('invites.modal.view-more') }}
      </RouterLink> -->
    </div>
    <Spinner v-else-if="loading" />
    <div
      v-else
      class="pb-4 text-center text-secondary"
    >
      {{ $t('planner.coming-soon') }}
    </div>
  </PlannerCard>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import ProspectCard from '@/components/Common/ProspectCard.vue'
import PlannerCard from '@/components/Planner/PlannerCard.vue'
import {
  IHostingRole,
  ILanguage,
  IQueryFilterBy,
  ISearchFor,
  ISearchSortBy,
} from '@/composables/graphql/generated'
import { useSearchResult } from '@/composables/useSearchResult'
import { storeKey } from '@/store'

export default defineComponent({
  name: 'PlannerSuggestions',
  components: {
    PlannerCard,
    ProspectCard
  },
  setup() {
    const store = useStore(storeKey)
    const role = computed(() => store.state.planner.selectedRole)

    const variables = computed(() => ({
      filterBy: {
        availableToHost: true,
        availableForInvites: true
      },
      language: ILanguage.En,
      limit: 9,
      sortBy: ISearchSortBy.Random,
      queryBy: IQueryFilterBy.Location,
      searchFor: role.value === IHostingRole.Host ? ISearchFor.Guests : ISearchFor.Hosts,
    }))

    const {
      loading,
      profiles,
    } = useSearchResult(variables, 0)

    return {
      loading,
      role,
      profiles,
    }
  }
})
</script>

<style lang="scss" scoped>
.suggestions-wrapper {
  display: flex;
  flex-wrap: wrap;
  padding: 1em;

  .prospect-card {
    width: calc((100% / 6) - 1rem);
    margin: .5rem;
  }

  .view-all-link {
    width: 100%;
  }
}
</style>
