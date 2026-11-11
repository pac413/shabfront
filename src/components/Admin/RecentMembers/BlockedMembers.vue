<template>
  <div class="blocked-members">
    <BListGroup class="blocked-members__list">
      <BListGroupItem
        v-for="(item, index) in blockingProfiles"
        :key="index"
        class="blocked-members__item"
      >
        <ProfileAvatar
          class="avatar"
          size="4em"
          thumbnail="medium"
          :profile="item"
        />
        <div class="item-content">
          <RouterLink
            target="_blank"
            :to="{ name: 'Profile', params: { handle: item.handle } }"
          >
            <div class="item-name text-body">
              {{ item.firstName }} {{ item.lastName }}
            </div>
          </RouterLink>
        </div>
        <div class="item-actions">
          <BButton
            variant="primary"
            @click="unblock(item)"
          >
            {{ $t('admin.blocked-members.unblock') }}
          </BButton>
        </div>
      </BListGroupItem>
    </BListGroup>

    <div
      v-if="!blockingProfiles.length"
      class="blocked-members__empty text-muted"
    >
      {{ $t('admin.blocked-members.empty') }}
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import { useToast } from '@/composables'
import type { IAdminRecentMemberFragmentFragment } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import type { SimpleProfile } from '@/types'

export default defineComponent({
  name: 'BlockedMembers',
  components: { ProfileAvatar },
  props: {
    expanded: {
      required: true,
      type: Boolean
    },
    member: {
      required: true,
      type: Object as () => IAdminRecentMemberFragmentFragment
    }
  },
  setup(props) {
    const store = useStore(storeKey)
    const { t } = useI18n()
    const { showSuccessToast, showErrorToast } = useToast()

    const blockingProfiles = computed(() => store.getters['profile/blockingProfilesById'](props.member.id))

    const unblock = async (item: SimpleProfile) => {
      try {
        await store.dispatch('profile/unblockProfile', {
          profile: item, onbehalf: props.member 
        })
        showSuccessToast(
          t('modals.view-blocking.toast.success').toString(), 
          t('modals.view-blocking.toast.title').toString()
        )
      } catch (error: any) {
        showErrorToast(error, t('modals.view-blocking.toast.title').toString())
      }
    }

    watch(() => props.expanded, () => {
      if (props.expanded) {
        store.dispatch('profile/blockingProfiles', props.member.id)
      }
    }, { immediate: true })

    return {
      blockingProfiles,
      unblock
    }
  }
})
</script>

<style lang="scss" scoped>
.blocked-members__list {
  display: flex;
  flex-wrap: wrap;
  flex-direction: column;
}

.blocked-members__item {
  border-bottom: 1px solid #e8e8e8;
  padding: 10px 20px;
  display: flex;
  align-items: center;

  &:hover {
    background: #e8e8e8;
  }

  .item-content {
    margin-left: 20px;
    flex-grow: 1;

    .item-secondary {
      font-size: 14px;
      color: rgba(0, 0, 0, .6);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      max-width: 700px;
    }
  }

  .item-actions {
    flex-wrap: nowrap;
    display: flex;

    :deep(.btn) {
      margin-left: 10px;
      font-weight: 700;
    }

    .btn-link {
      color: rgba(0, 0, 0, .6);
    }
  }
}

.rtl-at-root {
  .blocked-members__item {
    .item-content {
      margin-left: 0px;
      margin-right: 20px;
    }
    .item-actions {
      :deep(.btn) {
        margin-left: 0;
        margin-right: 10px;
      }
    }
  }
}
</style>
