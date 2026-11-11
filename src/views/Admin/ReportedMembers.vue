<template>
  <ProfileCard
    :title="$t('admin.reported-members.title')"
    :icon="['fal', 'users']"
  >
    <div
      v-if="!loading && !profiles.length"
      class="reported-members__empty text-muted"
    >
      {{ $t('admin.reported-members.empty') }}
    </div>
    <recent-members-toolbar
      v-else
      class="recent-members__toolbar my-3 "
      :profiles="profiles"
      :profiles-selection="profilesSelection"
      @toggle-all="toggleAll"
      @delete-selected="deleteSelectedMembers"
    />
    <RecentMemberItem
      v-for="profile in profiles"
      :key="profile.id"
      :member="profile"
      :selected="profilesSelection[profile.id]"
      type="reported"
      selectable
      @select="selectProfile(profile.id, $event)"
      @refetch="refetch"
    />
    <InfiniteLoading
      :distance="500"
      @infinite="infiniteHandler"
    >
      <template #spinner>
        <Spinner
          :small="true"
          type="grow"
        />
      </template>
      <template #complete>
        <span></span>
      </template>
    </InfiniteLoading>
  </ProfileCard>
</template>

<script lang="ts">
import 'v3-infinite-loading/lib/style.css'

import InfiniteLoading from 'v3-infinite-loading'
import { defineComponent, ref } from 'vue'

import RecentMemberItem from '@/components/Admin/RecentMembers/RecentMemberItem/RecentMemberItem.vue'
import RecentMembersToolbar from '@/components/Admin/RecentMembers/RecentMemberToolbar.vue'
import { useAdminRecentMembers } from '@/components/Admin/RecentMembers/useAdminRecentMembers'
import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { IAdminRecentMembersFilterInputType } from '@/composables/graphql/generated'

export default defineComponent({
  name: 'ReportedMembers',
  components: {
    InfiniteLoading,
    RecentMemberItem,
    ProfileCard,
    RecentMembersToolbar
  },
  setup() {
    const infiniteStageChanger = ref<any>(null)
    const {
      clearSelection,
      loading,
      loadRecentMembers,
      onResult,
      profiles,
      profilesSelection,
      reset,
      selectProfile,
      toggleAll,
      deleteSelectedMembers
    } = useAdminRecentMembers({
      filter: {
        type: IAdminRecentMembersFilterInputType.Reported,
      }
    })

    const infiniteHandler = (stateChanger: any) => {
      infiniteStageChanger.value = stateChanger
      loadRecentMembers()
    }

    const refetch = () => {
      reset()
      loadRecentMembers()
    }

    onResult((result) => {
      if (result.loading) {
        return
      }
      if (!infiniteStageChanger.value) {
        return
      }

      const loadedProfiles = result?.data.adminRecentMembers?.profiles || []
      // if no more items, let's complete
      if (loadedProfiles.length === 0) {
        infiniteStageChanger.value.complete()
      } else {
        infiniteStageChanger.value.loaded()
      }
    })

    return {
      clearSelection,
      infiniteHandler,
      loading,
      profiles,
      profilesSelection,
      refetch,
      selectProfile,
      toggleAll,
      deleteSelectedMembers,
    }
  }
})
</script>

<style lang="scss" scoped>
:deep(.reported-member-item__section) {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  .reported-member-item__label {
    display: inline-block;
    width: 100px;
    font-size: 0.8rem;
    font-weight: 500;
    margin-right: 0.5rem;
  }

  .reported-member-item__profile-name {
    a {
      align-items: center;
      display: flex;
    }

    .b-avatar {
      margin-right: 8px;
    }
  }
}

.rtl-at-root {
  :deep(.reported-member-item__section) {
    .reported-member-item__label {
      margin-left: 0.5rem;
      margin-right: unset;
    }

    .reported-member-item__profile-name {
      .b-avatar {
        margin-left: 8px;
        margin-right: unset;
      }
    }
  }
}
</style>
