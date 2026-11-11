<template>
  <div
    class="member__row"
    @click="expandedModel = !expandedModel"
  >
    <div
      v-if="selectable"
      class="member__item__checkbox"
    >
      <BFormCheckbox
        v-model="isSelected"
        class="checkbox-red"
        button-variant="secondary"
        @click.stop
      />
    </div>
    <div class="member__item__name">
      <RouterLink
        target="_blank"
        :to="profileRoute"
      >
        <ProfileAvatar
          thumbnail="small"
          :profile="member"
        />
        <b> {{ member.displayName }}</b>
      </RouterLink>
    </div>
    <div class="member__item__content">
      <slot name="content">
        <b>{{ isReport ? 'Last Reported At:' : 'Registered:' }}</b> {{ isReport ? lastReportedDate : registedDate }}
      </slot>
    </div>

    <div class="col member__item__status">
      <slot name="status">
        <b>Status:</b> {{ status }}
      </slot>
    </div>

    <div class="col member__item__reported">
      <div v-if="member.reportId">
        <FaIcon
          :icon="['fal', 'exclamation-triangle']"
          class="me-1"
        />
        <b>Reported</b>
      </div>
    </div>

    <div class="col member__item__arrow">
      <Spinner
        v-if="loading"
        small
      />
      <button
        v-else
        class="btn btn-icon"
      >
        <FaIcon
          :icon="['fas', 'angle-up']"
          :class="{ 'fa-rotate-180': !expandedModel }"
        />
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import Spinner from '@/components/Common/Spinner.vue'
import type { IAdminRecentMemberFragmentFragment } from '@/composables/graphql/generated'
import { IAdminRecentMembersFilterInputType } from '@/composables/graphql/generated'
import moment from '@/plugins/moment'
import { AccountStatus } from '@/types'

export default defineComponent({
  name: 'RecentMemberItemHeader',
  components: { ProfileAvatar, Spinner },
  props: {
    member: {
      required: true,
      type: Object as () => IAdminRecentMemberFragmentFragment
    },
    expanded: {
      required: true,
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    selectable: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Boolean,
      default: false
    },
    type: {
      type: String,
      default: 'all'
    }
  },
  emits: ['select-changed', 'update:expanded'],
  setup(props, { emit }) {
    const expandedModel = computed({
      get: () => props.expanded,
      set: (value: boolean) => emit('update:expanded', value)
    })
    const isSelected = computed({
      get: () => props.selected,
      set: (value: boolean) => emit('select-changed', value)
    })
    const isReport = computed(() => props.type === IAdminRecentMembersFilterInputType.Reported)
    const profileRoute = computed(() => `/profile/${props.member.handle}`)
    const registedDate = computed(() => moment(props.member.createdAt).format('MMM DD, YYYY hh:mm A'))
    const lastReportedDate = computed(() => moment(props.member.lastReportedAt).format('MMM DD, YYYY hh:mm A'))
    const status = computed(() => {
      switch (props.member.accountStatus) {
      case AccountStatus.AdminSuspended:
        return 'Suspended'
      case AccountStatus.Deleted:
        return 'Deleted'
      case AccountStatus.Incomplete:
        return 'Incomplete'
      default:
        return 'Active'
      }
    })

    return {
      expandedModel,
      isSelected,
      profileRoute,
      registedDate,
      lastReportedDate,
      status,
      isReport
    }
  }
})
</script>

<style lang="scss" scoped>
.member__row {
  display: flex;
  cursor: pointer;
  align-items: center;
  margin-right: -15px;
  margin-left: -15px;
}

.member__item__checkbox {
  padding-left: 1rem;
}

.member__item__name {
  flex: 0 0 25%;
  margin-left: 12px;

  a {
    align-items: center;
    display: flex;
  }

  .b-avatar {
    margin-right: 12px;
  }
}

.member__item__content {
  padding: 1rem;
}

.member__item__arrow {
  max-width: 40px;
  padding: 0;
}

.rtl-at-root {
  .member__item__name {
    margin-right: 12px;

    .b-avatar {
      margin-right: 0;
      margin-left: 12px;
    }
  }
}
</style>
