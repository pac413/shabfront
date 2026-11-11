<template>
  <BCard class="member__item">
    <RecentMemberItemHeader
      v-model:expanded="expanded"
      :loading="loading"
      :member="member"
      :selectable="selectable"
      :selected="selected"
      :type="type"
      @select-changed="onSelectChanged"
    />

    <BCollapse
      :id="'collapse' + member.id"
      v-model="expanded"
    >
      <div
        class="row member__item-details-row"
      >
        <div class="col">
          <BTabs
            pills
            card
            content-class="mt-3"
          >
            <BTab
              title="Member Data"
              active
            >
              <RecentMemberData
                :member="member"
                :total-messages="totalMessages"
              />
            </BTab>
            <BTab title="Risk Assessment">
              <RecentMemberRiskAssessment :member="member" />
            </BTab>
            <BTab title="Flagged Content">
              <FlaggedContents
                :expanded="expanded"
                :profile="member"
              />
            </BTab>
            <BTab title="Restrictions">
              <RestrictionsCard
                :profile-id="member.id"
              />
            </BTab>
            <BTab
              title="Blocking Members"
              lazy
            >
              <BlockedMembers
                :expanded="expanded"
                :member="member"
              />
            </BTab>
            <BTab
              title="Pictures"
              lazy
            >
              <MemberPictures :member="member" />
            </BTab>
            <BTab
              v-if="member.reportId"
              title="Reports"
            >
              <MemberReport
                v-for="item in reports"
                :key="item.id"
                :item="item"
              />
            </BTab>
          </BTabs>
        </div>
        <div class="col member__item-dropdown">
          <RecentMemberActionMenu
            :member="member"
            @unreported="$emit('refetch')"
          />
        </div>
      </div>
    </BCollapse>
  </BCard>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, type Ref, ref, watch } from 'vue'

import BlockedMembers from '@/components/Admin/RecentMembers/BlockedMembers.vue'
import FlaggedContents from '@/components/Admin/RecentMembers/FlaggedContents.vue'
import MemberPictures from '@/components/Admin/RecentMembers/MemberPictures.vue'
import MemberReport from '@/components/Admin/RecentMembers/MemberReport.vue'
import RestrictionsCard from '@/components/Profile/RestrictionsCard.vue'
import {
  type IAdminRecentMemberFragmentFragment,
  useAdminRecentMemberDataLazyQuery,
} from '@/composables/graphql/generated'

import RecentMemberActionMenu from './RecentMemberActionMenu.vue'
import RecentMemberData from './RecentMemberData.vue'
import RecentMemberItemHeader from './RecentMemberItemHeader.vue'
import RecentMemberRiskAssessment from './RecentMemberRiskAssessment.vue'

export default defineComponent({
  name: 'RecentMemberItem',
  components: {
    MemberPictures,
    MemberReport,
    BlockedMembers,
    RestrictionsCard,
    FlaggedContents,
    RecentMemberActionMenu,
    RecentMemberData,
    RecentMemberItemHeader,
    RecentMemberRiskAssessment
  },
  props: {
    member: {
      required: true,
      type: Object as () => IAdminRecentMemberFragmentFragment
    },
    expandedByDefault: {
      type: Boolean,
      default: false
    },
    selectable: {
      required: false,
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'all'
    },
  },
  emits: ['select', 'refetch'],
  setup(props, context) {
    const expanded: Ref<boolean> = ref(false)
    const { load, loading, result } = useAdminRecentMemberDataLazyQuery({
      profileId: props.member.id,
    })
    const totalMessages = computed(() => result.value?.adminRecentMemberData?.totalMessages || 0)
    const reports = computed(() => result.value?.adminRecentMemberData?.reports || [])

    watch(expanded, () => {
      if (expanded.value) {
        load()
      }
    }, { immediate: true })

    onMounted(() => {
      if (props.expandedByDefault) {
        expanded.value = true
      }
    })

    const onSelectChanged = (isSelected: boolean) => {
      context.emit('select', isSelected)
    }

    return {
      expanded,
      loading,
      totalMessages,
      reports,
      onSelectChanged,
    }
  }
})
</script>

<style lang="scss" scoped>
.member__item {
  padding: 15px 20px;
  margin-bottom: 10px;

  & > :deep(.card-body) {
    padding: 0;
  }
}

.member__item__reported {
  color: red;
  b {
    margin-left: 4px;
  }
}

.member__item-details-row {
  margin-top: 14px;

  .member__item-dropdown {
    max-width: 58px;
    padding-left: 0;

    svg {
      width: 16px;
    }
  }

  :deep(.card-header) {
    padding-bottom: 15px;
    background: none;
  }
}

:deep(.restrictions-card),
:deep(.pictures) {
  background: none;
  border: none;
  padding: 0;
}


:deep(.nav-link).active {
  background-color: $colorRed;
}

.rtl-at-root {
  .member__item__reported {
    b {
      margin-left: 0;
      margin-right: 4px;
    }
  }

  .member__item-details-row {
    .member__item-dropdown {
      padding-right: 0;
    }
  }
}
</style>
