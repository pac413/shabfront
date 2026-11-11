<template>
  <ProfileCard :title="$t('admin.admin-totals.title')" :icon="['fal', 'users']">
    <Spinner v-if="loading" :small="true" type="grow" />
    <div v-else-if="totals" class="form-group">
      <BRow v-for="item in metrics" :key="item.key" class="my-1">
        <BCol sm="3">
          <label class="text-muted"> {{ item.label }} </label>
        </BCol>
        <BCol sm="9">
          <div class="fw-bold">
            {{ totals[item.key] }}
          </div>
        </BCol>
      </BRow>
    </div>
  </ProfileCard>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { useAdminTotalsQuery } from '@/composables/graphql/generated'

const metrics = [
  { key: 'totalActiveLastSixMonths', label: 'Active Last 6 Months:' },
  { key: 'totalActiveLastYear', label: 'Active Last Year:' },
  { key: 'totalActiveSinceCovid', label: 'Active Since Covid:' },
  { key: 'totalUsers', label: 'Total:' },
]

export default defineComponent({
  name: 'AdminTotals',
  components: { ProfileCard },
  setup() {
    const { result, loading } = useAdminTotalsQuery()
    const totals = computed(() => result.value?.adminTotals || null)

    return {
      loading,
      metrics,
      totals,
    }
  },
})
</script>
