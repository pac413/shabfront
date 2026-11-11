<template>
  <div v-if="!isOwnProfile">
    <OverlayMenu
      :id="targetId"
    >
      <template v-if="$slots.icon" #icon>
        <slot name="icon" />
      </template>
      <template #default="{ hide: hideMenu }">
        <OverlayMenuSection>
          <template v-if="showFriendItem">
            <FriendMenuItem :profile="profile" @hide-menu="hideMenu" />
          </template>
          <template v-if="showFollowItem">
            <FollowMenuItem :profile="profile" @hide-menu="hideMenu" />
          </template>
          <template v-if="showDatingItem">
            <OverlayMenuItem
              :icon="['fal', 'heart']"
              :label="$t('menu-items.profile.view-dating-profile')"
              @hide-menu="hideMenu"
              @click="showDatingProfileModal"
            />
          </template>
          <div
            v-if="showFriendItem || showFollowItem || showDatingItem"
            class="divider"
          />

          <template v-if="showInviteItem">
            <InviteMenuItem :profile="profile" @hide-menu="hideMenu" />
          </template>
          <template v-if="showGuestItem">
            <OverlayMenuItem
              :icon="guestMenuItem.icon"
              :label="guestMenuItem.label"
              :hint="guestMenuItem.hint"
              @hide-menu="hideMenu"
              @click="handleGuestMenuItemClick"
            />
          </template>
          <div
            v-if="showInviteItem || showGuestItem"
            class="divider"
          />

          <template v-if="showReportItem">
            <OverlayMenuItem
              :icon="['fal', 'exclamation-triangle']"
              :label="$t('menu-items.profile.report-member')"
              :hint="$t('menu-items.profile.report-member-hint')"
              @hide-menu="hideMenu"
              @click="report"
            />
          </template>
          <template v-if="showBlockItem">
            <OverlayMenuItem
              :icon="['fal', 'ban']"
              :label="blockMenuItemLabel"
              :hint="blockMenuItemHint"
              @hide-menu="hideMenu"
              @click="block"
            />
          </template>
          <div
            v-if="(showReportItem || showBlockItem) && (showMessageItem || hasSlots)"
            class="divider"
          />

          <template v-if="showMessageItem">
            <OverlayMenuItem
              tag="router-link"
              :icon="['fal', 'comment-plus']"
              :label="$t('profile-view.friends.message')"
              :to="`/messages/${profile.handle}`"
              @hide-menu="hideMenu"
            />
            <div
              v-if="hasSlots"
              class="divider"
            />
          </template>

          <slot name="default" :hide="hideMenu" />
        </OverlayMenuSection>
      </template>
    </OverlayMenu>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import OverlayMenu from '@/components/Common/OverlayMenu/OverlayMenu.vue'
import OverlayMenuItem from '@/components/Common/OverlayMenu/OverlayMenuItem.vue'
import OverlayMenuSection from '@/components/Common/OverlayMenu/OverlayMenuSection.vue'
import FollowMenuItem from '@/components/Common/ProfileOverlayMenu/FollowMenuItem.vue'
import FriendMenuItem from '@/components/Common/ProfileOverlayMenu/FriendMenuItem.vue'
import InviteMenuItem from '@/components/Common/ProfileOverlayMenu/InviteMenuItem.vue'
import { useToast } from '@/composables'
import type { IProfileFragmentFragment } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { type GlobalConfirmationDialogProps,Modal, useModalStore } from '@/stores/modal'
import { SiteRole } from '@/types'
import { ProfileOverlayItem } from '@/utils'

export default defineComponent({
  name: 'ProfileOverlayMenu',
  components: {
    OverlayMenu,
    OverlayMenuItem,
    OverlayMenuSection,
    InviteMenuItem,
    FriendMenuItem,
    FollowMenuItem,
  },
  props: {
    profile: {
      type: Object as () => IProfileFragmentFragment,
      required: true,
    },
    target: {
      type: String,
      default: null,
    },
    items: {
      type: Array as () => string[],
      default: () => Object.values(ProfileOverlayItem),
    },
  },
  emits: ['hide-menu'],
  setup(props, { slots }) {
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const { t } = useI18n()
    const { showSuccessToast } = useToast()
    const activeProfile = computed(() => store.state.profile.activeProfile!)
    const showMenu = ref<boolean>(false)
    const isOwnProfile = computed(() => props.profile.id === activeProfile.value.id)
    const hasSlots = computed(() => !!slots.default)
    const timestamp = computed(() => new Date().getMilliseconds())
    const targetId = computed(() =>
      props.target || `ProfileOverlayMenu-${props.profile.id}-${timestamp.value}`
    )
    const showDatingItem = computed(() => {
      // Need to show DatingProfile modal even when it's private,
      return props.items.includes(ProfileOverlayItem.DATING) &&
        props.profile.siteRoles &&
        props.profile.siteRoles.includes(SiteRole.DATING) &&
        props.profile.datingProfile &&
        !props.profile.isBlocked &&
        !props.profile.isBlocking
    })
    const blockMenuItemLabel = computed(() => {
      return props.profile.isBlocking
        ? t('menu-items.profile.unblock-member').toString()
        : t('menu-items.profile.block-member').toString()
    })
    const blockMenuItemHint = computed(() => {
      return props.profile.isBlocking
        ? ''
        : t('menu-items.profile.block-member-hint').toString()
    })

    const isUnavailableGuest = computed(() => {
      const unavailableGuests = activeProfile.value?.hostProfile?.unavailableGuests || []
      return !!unavailableGuests.find(item => item.id === props.profile.id)
    })

    const guestMenuItem = computed(() => {
      return isUnavailableGuest.value ? {
        icon: ['fal', 'house-circle-check'],
        label: t('menu-items.profile.reinstate-guest').toString(),
        hint: t('menu-items.profile.reinstate-guest-hint').toString(),
        description: t('menu-items.profile.reinstate-guest-description').toString()
      } : {
        icon: ['fal', 'house-circle-xmark'],
        label: t('menu-items.profile.exclude-guest').toString(),
        hint: t('menu-items.profile.exclude-guest-hint').toString(),
        description: t('menu-items.profile.exclude-guest-description').toString(),
      }
    })

    const showDatingProfileModal = () => {
      showModal({
        modal: Modal.DATING_PROFILE,
        props: {
          profile: props.profile
        }
      })
    }

    const block = () => {
      if (props.profile.isBlocking) {
        store.dispatch('profile/unblockProfile', { profile: props.profile })
      } else {
        showModal({
          modal: Modal.BLOCK_MEMBER,
          props: {
            profile: props.profile
          }
        })
      }
    }

    const report = () => {
      showModal({
        modal: Modal.REPORT_MEMBER,
        props: {
          profileId: props.profile.id
        }
      })
    }

    const handleGuestMenuItemClick = () => {
      const props: GlobalConfirmationDialogProps = {
        title: guestMenuItem.value.label,
        body: guestMenuItem.value.description,
        onSuccess: handleGuestConfirmed,
      }
      showModal({
        modal: Modal.GLOBAL_CONFIRMATION_DIALOG,
        props,
      })
    }

    const handleGuestConfirmed = async () => {
      const payload: any = {
        profileId: activeProfile.value.id,
        unavailableGuests: []
      }
      const unavailableGuests = (activeProfile.value.hostProfile?.unavailableGuests || []).map(guest => guest.id)

      if (isUnavailableGuest.value) {
        payload.unavailableGuests = unavailableGuests.filter(id => id !== props.profile.id)
      } else {
        const index = unavailableGuests.findIndex(id => id === props.profile.id)
        if (index === -1) {
          unavailableGuests.push(props.profile.id)
        }
        payload.unavailableGuests = unavailableGuests
      } 
      const message = isUnavailableGuest.value ?
        t('menu-items.profile.reinstate-guest-success').toString() : 
        t('menu-items.profile.exclude-guest-success').toString()
        
      await store.dispatch('profile/updateHostProfile', payload)
      showSuccessToast(message)
    }

    const showFriendItem = computed(() =>
      props.items.includes(ProfileOverlayItem.FRIEND) && !props.profile.isBlocked && !props.profile.isBlocking
    )
    const showFollowItem = computed(() =>
      props.items.includes(ProfileOverlayItem.FOLLOW) && !props.profile.isBlocked && !props.profile.isBlocking
    )
    const showInviteItem = computed(() => 
      props.items.includes(ProfileOverlayItem.INVITE) && !props.profile.isBlocked && !props.profile.isBlocking
    )
    const showGuestItem = computed(() => props.items.includes(ProfileOverlayItem.GUEST))
    const showReportItem = computed(() => props.items.includes(ProfileOverlayItem.REPORT))
    const showBlockItem = computed(() => props.items.includes(ProfileOverlayItem.BLOCK))
    const showMessageItem = computed(() => 
      props.items.includes(ProfileOverlayItem.MESSAGE) && !props.profile.isBlocked && !props.profile.isBlocking
    )

    return {
      activeProfile,
      block,
      blockMenuItemLabel,
      blockMenuItemHint,
      isOwnProfile,
      hasSlots,
      ProfileOverlayItem,
      showDatingProfileModal,
      showMenu,
      report,
      targetId,
      timestamp,
      guestMenuItem,
      showBlockItem,
      showDatingItem,
      showFriendItem,
      showFollowItem,
      showGuestItem,
      showInviteItem,
      showMessageItem,
      showReportItem,
      handleGuestMenuItemClick,
      handleGuestConfirmed
    }
  }
})
</script>

<style lang="scss" scoped>
.divider {
  height: 0px;
  margin: 0.5rem 0;
  overflow: hidden;
  border-top: 1px solid #e9ecef;
}
</style>
