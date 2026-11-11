<template>
  <SubProfileCard
    v-if="guestProfile"
    :icon="['fal', 'user-tie']"
    :site-role="SiteRole.GUEST"
    :title="$t('profile-view.guest.title')"
    :endorsements="guestProfile.guestEndorsements.endorsements"
    :endorsements-total="guestProfile.guestEndorsements.total"
    :references="guestProfile.references"
    @endorsement-submitted="onEndorsementSubmitted"
    @view-all="$emit('view-all')"
  >
    <div
      v-if="loading"
    >
      <Spinner small />
    </div>
    <template v-else>
      <IconItem
        v-if="displayInviteLink"
        class="link-style"
        :icon="['fal', 'house-flag']"
        :icon-class="availabilityStatusColor"
        :item-text="$t('invites.modal.invitation-label')"
        @click="displayInviteModal"
      />
      <IconItem
        v-else
        :icon="['fal', 'house-flag']"
        :icon-class="availabilityStatusColor"
        :item-text="availabilityText"
      />
    </template>
  </SubProfileCard>
</template>

<script lang="ts">
import { computed, defineComponent, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import SubProfileCard from '@/components/Profile/SubProfileCard.vue'
import {
  IGuestProfileStatus,
  IHostingType,
  useGuestProfileByProfileIdLazyQuery,
} from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { type CreateInviteModalProps, Modal, useModalStore } from '@/stores/modal'
import { InviteType, SiteRole } from '@/types'

export default defineComponent({
  name: 'GuestCard',
  components: {
    SubProfileCard,
  },
  emits: ['view-all'],
  setup() {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const route = useRoute()
    const router = useRouter()
    const currentProfileId = computed(() => store.state.profile.currentProfile?.id)
    const profile = computed(() => store.state.profile.currentProfile)
    const viewingSelf = computed<boolean>(() => store.getters['profile/viewingSelf'])
    const { load, result, loading } = useGuestProfileByProfileIdLazyQuery({
      id: currentProfileId.value,
    }, {
      fetchPolicy: 'cache-and-network',
    })
    const guestProfile = computed(() => {
      const data = result.value?.profile
      if (!data) {
        return null
      }
      return data.profile?.guestProfile
    })
    const availabilityStatusColor = computed(() => {
      switch (guestProfile.value?.status) {
      case IGuestProfileStatus.Available:
      case IGuestProfileStatus.ActivelyLooking:
        return 'green'
      default:
        return ''
      }
    })

    const availabilityText = computed(() => {
      if (!guestProfile.value?.status) {
        return t('profile-view.guest.unknown-availability').toString()
      }

      return (
        guestProfile.value.availabilitySentence ||
        t(`profile-view.guest.${guestProfile.value.status}`)
      )
    })

    const displayInviteLink = computed(() => {
      return !viewingSelf.value && availabilityStatusColor.value === 'green'
    })

    const viewAllRoute = computed(() => {
      const { handle } = route.params
      const prefix = handle ? `/profile/${handle}` : '/profile'
      return `${prefix}/endorsements`
    })

    const displayInviteModal = () => {
      if (!displayInviteLink.value || !profile.value) {
        return
      }
      const props: CreateInviteModalProps = {
        recipient: profile.value,
        type: IHostingType.Invitation,
      }
      showModal({
        modal: Modal.CREATE_INVITE,
        props,
      })
    }

    const onViewAll = () => {
      router.push(viewAllRoute.value)
    }

    const onEndorsementSubmitted = () => {
      load(undefined, { id: currentProfileId.value }, { fetchPolicy: 'network-only' })
    }

    watch(currentProfileId, () => load(), { immediate: true })

    return {
      availabilityStatusColor,
      availabilityText,
      displayInviteLink,
      displayInviteModal,
      guestProfile,
      InviteType,
      loading,
      onEndorsementSubmitted,
      onViewAll,
      profile,
      SiteRole,
      viewAllRoute,
      viewingSelf,
    }
  },
})
</script>
