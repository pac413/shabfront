<template>
  <div v-if="hasEndorsements" class="full-width">
    <all-endorsements-card v-if="isDating" :site-role="SiteRole.DATING" />
    <all-endorsements-card v-if="isGuest" :site-role="SiteRole.GUEST" />
    <all-endorsements-card v-if="isHost" :site-role="SiteRole.HOST" />
  </div>
  <ProfileCard v-else class="text-center">
    {{ $t('profile-view.general.no-endorsements') }}
  </ProfileCard>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import AllEndorsementsCard from '@/components/Profile/Endorsement/AllEndorsementsCard.vue'
import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { storeKey } from '@/store'
import { SiteRole } from '@/types'

export default defineComponent({
  name: 'Endorsements',
  components: {
    AllEndorsementsCard,
    ProfileCard,
  },
  setup() {
    const store = useStore(storeKey)
    const isGuest = computed<boolean>(() => store.getters['profile/isGuest'])
    const isHost = computed<boolean>(() => store.getters['profile/isHost'])
    const isDating = computed<boolean>(() => store.getters['profile/isDating'])
    const hasEndorsements = computed(() => {
      return isHost.value || isGuest.value || isDating.value
    })

    return {
      hasEndorsements,
      isDating,
      isGuest,
      isHost,
      SiteRole,
    }
  },
})
</script>
