<template>
  <div
    v-if="authRoles"
    class="m-0 p-0"
  >
    <OverlayMenuItem
      :icon="['fal', 'house-flag']"
      :label="$t('profile-view.heading.host-me')"
      :disabled="!canRequestHosting"
      :hint="requestHostingHint"
      @hide-menu="$emit('hide-menu')"
      @click="showInvite(InviteType.REQUEST)"
    />

    <OverlayMenuItem
      :icon="['fal', 'calendar-circle-user']"
      :label="$t('profile-view.heading.invite-me')"
      :disabled="!canInvite"
      :hint="inviteHint"
      @hide-menu="$emit('hide-menu')"
      @click="showInvite(InviteType.INVITATION)"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import OverlayMenuItem from '@/components/Common/OverlayMenu/OverlayMenuItem.vue'
import { storeKey } from '@/store'
import { type CreateInviteProps, Modal, useModalStore } from '@/stores/modal'
import { GuestAvailabilityStatus, HostProfileStatus, InviteType, type Profile, SiteRole } from '@/types'

export default defineComponent({
  name: 'InviteMenuItem',
  components: {
    OverlayMenuItem
  },
  props: {
    profile: {
      type: Object as () => Profile,
      required: true,
    },
  },
  emits: ['hide-menu'],
  setup(props) {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const authRoles = computed(() => store.state.auth.siteRoles)
    const canInvite = computed(() => {
      return (
        authRoles.value?.includes(SiteRole.HOST) &&
        props.profile.siteRoles?.includes(SiteRole.GUEST) &&
        props.profile.guestProfile &&
        [
          GuestAvailabilityStatus.AVAILABLE,
          GuestAvailabilityStatus.ACTIVELY_LOOKING
        ].includes(props.profile.guestProfile.status)
      )
    })
    const canRequestHosting = computed(() => {
      const unavailableGuests = props.profile.hostProfile?.unavailableGuests || []
      const isAvailableToGuest = !(unavailableGuests.find(guest => guest.id === activeProfile.value?.id))
      return (
        authRoles.value?.includes(SiteRole.GUEST) &&
        props.profile.siteRoles?.includes(SiteRole.HOST) &&
        isAvailableToGuest && 
        props.profile.hostProfile &&
        [
          HostProfileStatus.AVAILABLE,
          HostProfileStatus.ACTIVELY_LOOKING,
        ].includes(props.profile.hostProfile.status)
      )
    })
    const requestHostingHint = computed(() => (
      canRequestHosting.value ? 
        t('profile-view.heading.host-me-hint') : 
        t('profile-view.heading.host-me-disabled', { firstName: props.profile.firstName })
    ))
    const inviteHint = computed(() => (
      canInvite.value ? 
        t('profile-view.heading.invite-me-hint', { firstName: props.profile.firstName }) :
        t('profile-view.heading.invite-me-disabled', { firstName: props.profile.firstName })
    ))

    const showInvite = (type: InviteType) => {
      if (type === InviteType.REQUEST && !canRequestHosting.value) {
        return
      }

      if (type === InviteType.INVITATION && !canInvite.value) {
        return
      }

      const modalProps: CreateInviteProps = {
        recipient: props.profile,
        type
      }
      showModal({
        modal: Modal.CREATE_INVITE,
        props: modalProps
      })
    }

    return {
      activeProfile,
      authRoles,
      canInvite,
      canRequestHosting,
      requestHostingHint,
      inviteHint,
      InviteType,
      showInvite,
    }
  }
})
</script>

<style lang="scss" scoped>
.overlay-menu-item {
  margin-bottom: 5px;
}
</style>
