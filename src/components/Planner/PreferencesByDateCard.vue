<template>
  <PlannerCard :title="$t(`planner.preferences-by-date`)">
    <div class="text-secondary fw-bold p-2">
      {{ $t('planner.preferences-help-text') }}
      <BLink :to="{ name: 'edit.host-preferences'}">
        {{ $t('planner.edit-profile-link-text') }}
      </BLink>
    </div>

    <div class="py-2 d-flex">
      <div v-if="hostProfile && !loading" class="flex-grow-1">
        <div class="px-3 fw-bold">
          {{ $t('profile-edit.host-preferences.availability') }}
        </div>
        <HostPreferenceView
          :profile="profile"
          :date="selectedDate"
          :host-profile-for-date="hostProfile"
        />
        <div class="px-3 fw-bold">
          {{ $t('planner.preferences-additional-help-text') }}
          <BLink :to="{ name: 'edit.host-preferences'}">
            {{ $t('planner.edit-profile-link-text') }}
          </BLink>
        </div>
      </div>
      <Spinner v-else />
    </div>
  </PlannerCard>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import PlannerCard from '@/components/Planner/PlannerCard.vue'
import HostPreferenceView from '@/components/Profile/Edit/HostPreferenceView.vue'
import { storeKey } from '@/store'
import type { HostProfile } from '@/types'

export default defineComponent({
  name: 'PreferencesByDateCard',
  components: {
    PlannerCard,
    HostPreferenceView,
  },
  setup() {
    const store = useStore(storeKey)
    const profile = computed(() => store.state.profile.activeProfile)
    const hostProfile = computed<HostProfile>(() => store.getters['planner/hostProfileForDate'])
    const selectedDate = computed<string>(() => store.getters['planner/selectedDate'])
    const loading = computed<boolean>(() => store.getters['planner/isLoading'])

    return {
      hostProfile,
      loading,
      profile,
      selectedDate,
    }
  }
})
</script>

<style lang="scss" scoped>
:deep(.panel) {
  border: none;
  margin-bottom: 0;

  .panel-header {
    display: none
  }
  .panel-body {
    padding-top: 8px;
  }
}

:deep(#edit-prefs-sidebar) {
  padding: 10px;
  .custom-select {
    font-size: inherit
  }
}
:deep(.b-sidebar.b-sidebar-right > .b-sidebar-header) {
  flex-direction: row-reverse;
  font-weight: 600;
  text-transform: uppercase;
  font-family: $headerFont;
  padding-top: 1rem;

  .close {
    margin-left: auto;
    margin-right: 0;
  }
}

.rtl-at-root {
  :deep(.b-sidebar.b-sidebar-right > .b-sidebar-header) {
    .close {
      margin-left: 0;
      margin-right: auto;
    }
  }
}
</style>
