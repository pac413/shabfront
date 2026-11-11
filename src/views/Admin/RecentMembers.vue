<template>
  <ProfileCard
    :title="$t('admin.recent-members.title')"
    :icon="['fal', 'users']"
  >
    <div class="form-group search-input mb-3">
      <FaIcon
        class="form-control-feedback fa-search"
        :icon="['fa', 'search']"
      />
      <input
        ref="searchTermInput"
        v-model="keyword"
        type="text"
        class="form-control"
        :placeholder="$t('admin.recent-members.search').toString()"
        @input="onKeywordChanged"
      >
    </div>
    <div class="filter-container mb-4">
      <BButton
        v-for="option in filterOptions"
        :key="option.action"
        class="me-2"
        :variant="filter === option.action ? 'primary' : 'secondary'"
        size="sm"
        @click="onFilterChanged(option.action)"
      >
        {{ option.title }}
      </BButton>
    </div>
    <div
      v-if="!loading && !profiles.length"
      class="recent-members__empty text-muted"
    >
      {{ $t('admin.recent-members.empty') }}
    </div>
    <recent-members-toolbar
      v-else
      class="recent-members__toolbar my-3 "
      :profiles="profiles"
      :profiles-selection="profilesSelection"
      @toggle-all="toggleAll"
      @delete-selected="deleteSelectedMembers"
    />
    <div
      class="recent-members__content"
    >
      <RecentMemberItem
        v-for="profile in profiles"
        :key="profile.id"
        :member="profile"
        :selected="profilesSelection[profile.id]"
        selectable
        :type="filter"
        @select="selectProfile(profile.id, $event)"
        @refetch="refetch"
      />

      <InfiniteLoading
        :distance="500"
        :identifier="loadingIdentifier"
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
    </div>
  </ProfileCard>
</template>

<script lang="ts">
import 'v3-infinite-loading/lib/style.css'

import { debounce } from 'lodash'
import InfiniteLoading from 'v3-infinite-loading'
import { defineComponent, nextTick, type Ref, ref } from 'vue'
import { useI18n } from 'vue-i18n'

import RecentMemberItem from '@/components/Admin/RecentMembers/RecentMemberItem/RecentMemberItem.vue'
import RecentMembersToolbar from '@/components/Admin/RecentMembers/RecentMemberToolbar.vue'
import { useAdminRecentMembers } from '@/components/Admin/RecentMembers/useAdminRecentMembers'
import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { IAdminRecentMembersFilterInputType } from '@/composables/graphql/generated'

export default defineComponent({
  name: 'RecentMembers',
  components: {
    InfiniteLoading,
    RecentMemberItem,
    ProfileCard,
    RecentMembersToolbar
  },
  setup() {
    const { t } = useI18n()
    const keyword: Ref<string> = ref('')
    const filter: Ref<IAdminRecentMembersFilterInputType> = ref(IAdminRecentMembersFilterInputType.All)
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
    } = useAdminRecentMembers()
    
    // Reset identifier for infinite loader
    // Docs here: https://peachscript.github.io/vue-infinite-loading/api/#identifier
    const loadingIdentifier: Ref<Date> = ref(new Date())
    
    const filterOptions = [
      {
        action: IAdminRecentMembersFilterInputType.All,
        title: t('admin.recent-members.filters.all').toString()
      },
      {
        action: IAdminRecentMembersFilterInputType.Active,
        title: t('admin.recent-members.filters.active').toString()
      },
      {
        action: IAdminRecentMembersFilterInputType.Reported,
        title: t('admin.recent-members.filters.reported').toString()
      },
      {
        action: IAdminRecentMembersFilterInputType.Deleted,
        title: t('admin.recent-members.filters.deleted').toString()
      },
      {
        action: IAdminRecentMembersFilterInputType.Suspended,
        title: t('admin.recent-members.filters.suspended').toString()
      },
      {
        action: IAdminRecentMembersFilterInputType.Incomplete,
        title: t('admin.recent-members.filters.incomplete').toString()
      },
      {
        action: IAdminRecentMembersFilterInputType.Highrisk,
        title: t('admin.recent-members.filters.highrisk').toString()
      },
      {
        action: IAdminRecentMembersFilterInputType.Restricted,
        title: t('admin.recent-members.filters.restricted').toString()
      },
      {
        action: IAdminRecentMembersFilterInputType.Olami,
        title: t('admin.recent-members.filters.olami').toString()
      },
    ]
 
    const reloadRecentMembers = () => {
      reset()
      nextTick(() => {
        loadingIdentifier.value = new Date()
      })
    }

    const onKeywordChanged = debounce(reloadRecentMembers, 500)
    const onFilterChanged = (action: IAdminRecentMembersFilterInputType) => {
      filter.value = action
      reloadRecentMembers()
    }

    const infiniteHandler = (stateChanger: any) => {
      infiniteStageChanger.value = stateChanger
      loadRecentMembers({
        filter: {
          q: keyword.value,
          type: filter.value,
        },
      })
    }
    const refetch = () => {
      reset()
      loadRecentMembers({
        filter: {
          q: keyword.value,
          type: filter.value,
        },
      })
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
      keyword,
      filter,
      filterOptions,
      infiniteHandler,
      loading,
      loadingIdentifier,
      onFilterChanged,
      onKeywordChanged,
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
.recent-members__empty {
  display: flex;
  justify-content: center;
  padding: 20px 10px;
  font-size: 1rem;
  border: none;
}
:deep(.card) {
  box-shadow: none;

  .card-header {
    color: $colorText;

    .card-header__title {
      font-size: 20px;
    }
  }
}

.search-input {
  position: relative;

  .fa-search {
    position: absolute;
    text-align: center;
    pointer-events: none;
    color: #8e8e8e;
    top: 50%;
    left: 13px;
    bottom: 50%;
    margin: auto;
  }
  input {
    padding-left: 2.375rem;
  }
}
</style>
