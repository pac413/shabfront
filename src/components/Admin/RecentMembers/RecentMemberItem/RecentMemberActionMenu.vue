<template>
  <BDropdown
    variant="link"
    right
    no-caret
    class="role-dropdown my-1"
  >
    <template #button-content>
      <FaIcon :icon="['fal', 'cog']" />
    </template>
    <BDropdownItem
      v-if="!isDeleted && member.reportId"
      variant="success"
      @click.prevent="unreportMember()"
    >
      <FaIcon :icon="['fal', 'trash']" />
      Unreport Member
    </BDropdownItem>
    <BDropdownItem
      v-if="!isDeleted"
      variant="danger"
      @click.prevent="deleteMember(member)"
    >
      <FaIcon :icon="['fal', 'trash']" />
      Delete Member
    </BDropdownItem>
    <BDropdownItem
      v-if="!isDeleted"
      variant="danger"
      @click.prevent="deleteMember(member, true)"
    >
      <FaIcon :icon="['fal', 'ban']" />
      Suspend Member
    </BDropdownItem>
    <BDropdownItem
      v-if="isDeleted"
      variant="success"
      @click.prevent="restoreMember(member)"
    >
      <FaIcon :icon="['fas', 'undo']" />
      Restore Member
    </BDropdownItem>
    <BDropdownDivider v-if="!isDeleted" />
    <BDropdownItem
      v-if="!isDeleted"
      @click.prevent="toggleZealot(member, !member.isZealot)"
    >
      <FaIcon
        :icon="['fas', 'virus-slash']"
        :style="{ color: member.isZealot ? 'var(--green)' : '' }"
      />
      {{ member.isZealot ? 'Disable' : 'Enable' }} Zealot
    </BDropdownItem>
    <BDropdownItem
      v-if="!isDeleted"
      @click.prevent="mergeSocialLogin(member)"
    >
      <FaIcon :icon="['fas', 'code-merge']" />
      Merge Social Login
    </BDropdownItem>
    <BDropdownItem
      v-if="!isDeleted"
      @click.prevent="toggleAdmin(member, !member.isAdmin)"
    >
      <FaIcon
        :icon="['fal', 'user']"
        :style="{ color: member.isAdmin ? 'var(--green)' : '' }"
      />
      {{ member.isAdmin ? 'Revoke' : 'Grant' }} Admin Access
    </BDropdownItem>
  </BDropdown>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import type { IAdminRecentMemberFragmentFragment } from '@/composables/graphql/generated'
import { type ConfirmMemberUnreportModalProps, Modal, useModalStore } from '@/stores/modal'
import { AccountStatus } from '@/types'

export default defineComponent({
  name: 'RecentMemberActionMenu',
  props: {
    member: {
      required: true,
      type: Object as () => IAdminRecentMemberFragmentFragment
    },
  },
  emits: ['unreported'],
  setup(props, context) {
    const { showModal } = useModalStore()
    const isDeleted = computed(() => {
      if (props.member.accountStatus) {
        return [
          AccountStatus.AdminSuspended,
          AccountStatus.Deleted
        ].includes(props.member.accountStatus as any)
      }
      return false
    })

    const unreportMember = () => {
      const modalProps: ConfirmMemberUnreportModalProps = {
        profileId: props.member.id,
        onComplete: () => {
          context.emit('unreported')
        }
      }
      showModal({
        modal: Modal.CONFIRM_MEMBER_UNREPORT,
        props: modalProps,
      })
    }

    const deleteMember = (member: IAdminRecentMemberFragmentFragment, suspend = false) => {
      showModal({
        modal: Modal.CONFIRM_MEMBER_DELETE,
        props: {
          profileId: member.id,
          suspend
        }
      })
    }

    const restoreMember = (member: IAdminRecentMemberFragmentFragment) => {
      showModal({
        modal: Modal.CONFIRM_MEMBER_RESTORE,
        props: {
          profileId: member.id
        }
      })
    }

    const toggleZealot = (member: IAdminRecentMemberFragmentFragment, value = false) => {
      showModal({
        modal: Modal.CONFIRM_ZEALOT,
        props: {
          profileId: member.id,
          value
        }
      })
    }

    const toggleAdmin = (member: IAdminRecentMemberFragmentFragment, value = false) => {
      showModal({
        modal: Modal.CONFIRM_ADMIN,
        props: {
          profileId: member.id,
          value
        }
      })
    }

    const mergeSocialLogin = (member: IAdminRecentMemberFragmentFragment) => {
      showModal({
        modal: Modal.MERGE_SOCIAL_LOGIN,
        props: {
          profileId: member.id
        }
      })
    }

    return {
      isDeleted,
      unreportMember,
      deleteMember,
      restoreMember,
      toggleZealot,
      toggleAdmin,
      mergeSocialLogin
    }
  }
})
</script>
