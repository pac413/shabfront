<template>
  <div
    v-if="viewingSelf"
    class="intro-buttons"
  >
    <BButton
      size="sm"
      variant="primary"
      :to="contactInfoRoute"
    >
      {{ $t('profile-view.heading.edit-profile') }}
    </BButton>
  </div>

  <div
    v-else
    class="intro-buttons"
  >
    <template v-if="!profile.isBlocked && !profile.isBlocking">
      <BButton
        id="invite-me"
        size="sm"
        variant="primary"
        :class="{ 'shallow-disabled': !canInvite }"
        @click="showInviteModal"
      >
        <FaIcon
          class="me-1"
          :icon="['fal', 'calendar-circle-user']"
        />
        <span>{{ $t('profile-view.heading.invite-me') }}</span>
      </BButton>
      <BTooltip
        v-if="!canInvite"
        variant="danger"
        target="invite-me"
        triggers="hover"
      >
        {{ $t('profile-view.heading.invite-me-disabled', { firstName: profile.firstName }) }}
      </BTooltip>
      <BButton
        id="host-me"
        size="sm"
        variant="secondary"
        :class="{ 'shallow-disabled': !canRequestHosting }"
        @click="showHostingRequestModal"
      >
        <FaIcon
          class="me-1"
          :icon="['fal', 'house-flag']"
        />
        <span>{{ $t('profile-view.heading.host-me') }}</span>
      </BButton>
      <BTooltip
        v-if="!canRequestHosting"
        variant="danger"
        target="host-me"
        triggers="hover"
      >
        {{ $t('profile-view.heading.host-me-disabled', { firstName: profile.firstName }) }}
      </BTooltip>

      <template v-if="canInvite || canRequestHosting">
        <MessageMe
          v-if="!mq.mobile"
          :handle="profile.handle"
          variant="green"
          :icon="['fal', 'comment-plus']"
        />
      </template>
      <template v-else-if="friendIsPrimary">
        <BButton
          size="sm"
          variant="primary"
          @click="addFriend"
        >
          {{ $t('profile-view.friends.add-friend') }}
        </BButton>
        <MessageMe
          v-if="!mq.mobile"
          :handle="profile.handle"
          variant="secondary"
          :icon="['fal', 'comment-plus']"
        />
      </template>
      <template v-else>
        <MessageMe
          :handle="profile.handle"
          variant="primary"
          :icon="['fal', 'comment-plus']"
        />
      </template>
    </template>

    <ProfileOverlayMenu
      :profile="profile"
      :items="moreMenuItems"
      class="intro-buttons__more-menu"
    >
      <template #icon>
        <BButton
          size="sm"
          variant="link"
        >
          {{ $t('profile-view.heading.more') }}
        </BButton>
      </template>
      <template #default="{ hide: hideMenu }">
        <OverlayMenuItem
          v-if="isAdmin"
          :icon="['fal', 'user-edit']"
          :label="$t('profile-view.heading.edit-profile')"
          tag="a"
          :href="contactInfoRoute"
          @hide-menu="hideMenu"
        />
      </template>
    </ProfileOverlayMenu>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useMq } from 'vue3-mq'
import { useStore } from 'vuex'

import MessageMe from '@/components/Common/MessageMe.vue'
import OverlayMenuItem from '@/components/Common/OverlayMenu/OverlayMenuItem.vue'
import ProfileOverlayMenu from '@/components/Common/ProfileOverlayMenu/ProfileOverlayMenu.vue'
import { useToast } from '@/composables'
import { storeKey } from '@/store'
import { Modal, useModalStore } from '@/stores/modal'
import { FriendshipStatus, GuestAvailabilityStatus, HostProfileStatus, InviteType, SiteRole } from '@/types'
import { ProfileOverlayItem } from '@/utils'

/**
 * Primary Buttons - Logic overview:
 *
 * If viewing your own profile, primary button is 'Edit Profile'
 * If viewing a user who is 'Actively Looking' for hosting, primary button is 'Invite', with secondary button to message
 * If viewing a user who is not your friend or follower, primary button is 'Add Friend', with secondary button to message
 * In all other cases, primary button is 'Message'
 * When viewing on mobile, there is never a secondary button
 *
 * Everything else goes into the 'More...' menu
 */
export default defineComponent({
  name: 'IntroButtons',
  components: {
    MessageMe,
    OverlayMenuItem,
    ProfileOverlayMenu
  },
  emits: ['hide-menu'],
  setup() {
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const route = useRoute()
    const mq = useMq()
    const { showErrorToast } = useToast()
    const profile = computed(() => store.state.profile.currentProfile)
    const isAdmin = computed(() => store.state.auth.isAdmin)
    const authRoles = computed(() => store.state.auth.siteRoles)
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const isGuest = computed<boolean>(() => store.getters['profile/isGuest'])
    const isHost = computed<boolean>(() => store.getters['profile/isHost'])
    const isFollowing = computed<boolean>(() => store.getters['profile/isFollowingCurrentProfile'])
    const friendshipStatus = computed<FriendshipStatus>(() => store.getters['profile/currentFriendshipStatus'])
    const viewingSelf = computed<boolean>(() => store.getters['profile/viewingSelf'])

    const moreMenuItems = computed(():ProfileOverlayItem[] => {
      const menuItems: ProfileOverlayItem[] = []
      menuItems.push(
        ProfileOverlayItem.FOLLOW,
        ProfileOverlayItem.BLOCK,
        ProfileOverlayItem.REPORT,
        ProfileOverlayItem.GUEST
      )

      if (mq.mobile) {
        menuItems.push(ProfileOverlayItem.MESSAGE)
      }
      // We do not want primary button to also appear in the 'more...' menu. Only add items if not primary
      if (!friendIsPrimary.value) {
        menuItems.push(ProfileOverlayItem.FRIEND)
      }
      if (canInvite.value || canRequestHosting.value) {
        menuItems.push(ProfileOverlayItem.INVITE)
      }

      return menuItems
    })

    const contactInfoRoute = computed(() => {
      const { handle } = route.params
      return handle ? `/profile/${handle}/edit/contact-info` : '/profile/edit/contact-info'
    })

    const canInvite = computed(() => {
      return (
        authRoles.value?.includes(SiteRole.HOST) &&
        profile.value?.siteRoles?.includes(SiteRole.GUEST) &&
        profile.value?.guestProfile?.status &&
        [
          GuestAvailabilityStatus.AVAILABLE,
          GuestAvailabilityStatus.ACTIVELY_LOOKING
        ].includes(profile.value.guestProfile?.status)
      )
    })

    const canRequestHosting = computed(() => {
      const isAvailableToGuest = !(profile.value?.hostProfile?.unavailableGuests.find(
        guest => guest.id === activeProfile.value?.id
      ))
      return (
        authRoles.value?.includes(SiteRole.GUEST) &&
        profile.value?.siteRoles?.includes(SiteRole.HOST) &&
        isAvailableToGuest && 
        profile.value?.hostProfile?.status &&
        [
          HostProfileStatus.AVAILABLE,
          HostProfileStatus.ACTIVELY_LOOKING
        ].includes(profile.value.hostProfile.status)
      )
    })

    const friendIsPrimary = computed(() => {
      if (canRequestHosting.value || canInvite.value) {return false}
      return !isFollowing.value && !friendshipStatus.value
    })
    
    const showInviteModal = () => {
      if (!canInvite.value) {
        return
      }
      showModal({
        modal: Modal.CREATE_INVITE,
        props: {
          type: InviteType.INVITATION,
          recipient: profile.value
        }
      })
    }

    const showHostingRequestModal = () => {
      if (!canRequestHosting.value) {
        return
      }
      if (!profile.value?.hostProfile?.privateInviteEnabled) {
        showModal({
          modal: Modal.CREATE_INVITE,
          props: {
            type: InviteType.REQUEST,
            recipient: profile.value
          }
        })
      } else {
        showModal({
          modal: Modal.PRIVATE_INVITE_PASSCODE,
          props: {
            name: profile.value?.displayName,
            passcode: profile.value?.hostProfile?.privateInviteCode,
            onSuccess: () => {
              showModal({
                modal: Modal.CREATE_INVITE,
                props: {
                  type: InviteType.REQUEST,
                  recipient: profile.value
                }
              })
            }
          }
        })
      }
      
    }

    const addFriend = async () => {
      const response = await store.dispatch(
        'connections/addFriend',
        { profileId: profile.value?.id }
      )
      if (response && 'error' in response) {
        showErrorToast(response)
      }
    }

    return {
      addFriend,
      authRoles,
      canInvite,
      canRequestHosting,
      contactInfoRoute,
      friendIsPrimary,
      friendshipStatus,
      FriendshipStatus,
      isAdmin,
      isFollowing,
      isGuest,
      isHost,
      moreMenuItems,
      mq,
      profile,
      ProfileOverlayItem,
      showHostingRequestModal,
      showInviteModal,
      viewingSelf,
    }
  }
})
</script>

<style lang="scss" scoped>
.intro-buttons {
  padding: 0.5rem 0;
  display: flex;
  gap: 10px;

  .intro-buttons__more-menu {
    display: inline-flex;
  }
}

button.btn-primary.shallow-disabled {
  color: white;
  background-color: $colorRed;
  opacity: 0.65;
}

button.btn-secondary.shallow-disabled {
  color: darken($colorGrey, 10%);
  background-color: rgba(255, 255, 255, 0.1);
  opacity: 0.65;
}

.rtl-at-root {
  .intro-buttons {
    :deep(.btn) {
      margin-left: 10px;
      margin-right: unset;
    }
  }
}
</style>
