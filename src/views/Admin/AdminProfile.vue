<template>
  <ProfileCard title="Admin Profile" :icon="['fal', 'user']">
    <RecentMemberItem
      v-if="profile"
      :member="profile"
      expanded-by-default
      @refetch="refetch"
    />
  </ProfileCard>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue'
import { useRoute } from 'vue-router'

import RecentMemberItem from '@/components/Admin/RecentMembers/RecentMemberItem/RecentMemberItem.vue'
import { useAdminRecentMembers } from '@/components/Admin/RecentMembers/useAdminRecentMembers'
import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { getSingleIdFromRouteParam } from '@/utils'

export default defineComponent({
  name: 'AdminProfile',
  components: { RecentMemberItem, ProfileCard },
  setup() {
    const route = useRoute()
    const handle = computed(() => getSingleIdFromRouteParam(route.params.handle))
    const { loading, loadRecentMembers, profiles } = useAdminRecentMembers({
      limit: 1,
      offset: 0,
      filter: { handle: handle.value },
    })
    const profile = computed(() => {
      if (profiles.value.length > 0) {
        return profiles.value[0]
      }
      return null
    })
    const refetch = () => {
      loadRecentMembers({
        limit: 1,
        offset: 0,
        filter: { handle: handle.value },
      })
    }

    watch(
      handle,
      () => {
        loadRecentMembers({
          filter: { handle: handle.value },
        })
      },
      { immediate: true },
    )

    return {
      loading,
      profile,
      refetch,
    }
  },
})
</script>

<style lang="scss" scoped>
:deep(.card) {
  box-shadow: none;

  .card-header {
    color: $colorText;

    .card-header__title {
      font-size: 20px;
    }
  }
}
</style>
