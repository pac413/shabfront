<template>
  <ProfileCard v-if="profileTotals">
    <div class="totals">
      <div class="total">
        <span>{{ profileTotals.views }}</span> {{ $t('profile-view.intro.views') }}
      </div>
      <div class="total">
        <span>{{ profileTotals.connections }}</span> {{ $t('profile-view.intro.connections') }}
      </div>
      <div class="total">
        <span>{{ profileTotals.invites }}</span> {{ $t('profile-view.intro.invites') }}
      </div>
    </div>
  </ProfileCard>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { useProfileTotalsQuery } from '@/composables/graphql/generated'
import { storeKey } from '@/store'

export default defineComponent({
  name: 'StatsCard',
  components: { ProfileCard },
  setup() {
    const store = useStore(storeKey)
    const activeProfileId = computed(() => store.state.auth.profileId)
    const currentProfileId = computed(() => store.state.profile.currentProfile?.id)
    const { result } = useProfileTotalsQuery({
      id: currentProfileId.value || activeProfileId.value,
    }, {
      fetchPolicy: 'cache-and-network',
    })
    const profileTotals = computed(() => {
      const data = result.value?.profile
      if (!data) {
        return null
      }
      return data.profile?.totals
    })

    return {
      profileTotals,
    }
  },
})
</script>

<style lang="scss" scoped>
.totals {
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;

  .total {
    display: flex;
    flex-direction: column;
    align-items: center;
    font-size: 0.9rem;
    color: $colorSecondary;

    span {
      font-size: 1.5rem;
      font-weight: bold;
      color: $colorRed;
    }
  }
}
</style>
