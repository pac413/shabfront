<template>
  <SubProfileCard
    v-if="hostProfile"
    :icon="['fal', 'glass-martini']"
    class="hosting-card-title"
    :site-role="SiteRole.HOST"
    :endorsements="hostProfile.hostEndorsements.endorsements"
    :endorsements-total="hostProfile.hostEndorsements.total"
    :references="hostProfile.references"
    :title="$t('profile-view.host.title')"
    @endorsement-submitted="onEndorsementSubmitted"
    @view-all="$emit('view-all')"
  >
    <div
      v-if="loading"
    >
      <Spinner small />
    </div>
    <div
      v-else-if="guests.length"
      class="guests-wrapper pt-2 pb-4"
    >
      <FaIcon :icon="['fal', 'users']" />
      <div class="guests-detail">
        <BLink
          class="link-unstyled"
          @click.prevent="viewGuests"
        >
          <strong>{{ guests[0].displayName }}&nbsp;</strong>
          <span v-if="guests.length === 1">
            {{ $t('invites.general.coming-alone-for-shabbat') }}
          </span>
          <span
            v-else
            v-html="$t('invites.general.multiple-coming-for-shabbat', { number: guests.length - 1 })"
          />
        </BLink>
        <BAvatarGroup
          size="2rem"
          rounded
        >
          <ProfileAvatar
            v-for="guest in guests.slice(0, maxAvatars)"
            :key="guest.id"
            linkable
            size="50px"
            thumbnail="medium"
            :profile="guest"
          />
        </BAvatarGroup>
      </div>
    </div>
    <IconItem
      v-if="displayInviteLink"
      class="link-style"
      :icon="['fal', 'calendar-circle-user']"
      :icon-class="availabilityStyle"
      :item-text="$t('invites.modal.hosting-request-label')"
      @click="displayInviteModal"
    />
    <IconItem
      v-else
      :icon="['fal', 'calendar-circle-user']"
      :icon-class="availabilityStyle"
      :item-text="availabilityText"
    />
    <IconItem
      v-if="hostProfile.details"
      :icon="['fal', 'users']"
      :item-text="$t('profile-view.host.'+ Object.keys(hostProfile.details).join())"
    />
    <IconItem
      :icon="['fal', 'utensils']"
      :icon-class="canHostMeals ? 'green' : ''"
      :item-text="canHostMeals? $t('profile-view.host.meals') : $t('profile-view.host.no-meals')"
    />
    <IconItem
      :icon="['fal', 'bed']"
      :icon-class="canHostSleep ? 'green' : ''"
      :item-text="canHostSleep ? $t('profile-view.intro.lodging') : $t('profile-view.intro.no-lodging')"
    />
    <IconItem
      v-if="hostProfile.reserveBy"
      :icon="['fal', 'calendar-check']"
      :item-text="$t('profile-view.intro.reserve-by') + formatReserveBy(hostProfile.reserveBy)"
    />
  </SubProfileCard>
</template>

<script lang="ts">
import { lowerCase,startCase } from 'lodash'
import { computed, defineComponent, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import SubProfileCard from '@/components/Profile/SubProfileCard.vue'
import {
  IHostingRole,
  IHostingType,
  IHostProfileStatus,
  useHostingsQuery,
  useHostProfileByProfileIdLazyQuery,
} from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { type CreateInviteModalProps, Modal, useModalStore } from '@/stores/modal'
import { InviteType, SiteRole } from '@/types'

export default defineComponent({
  name: 'HostCard',
  components: {
    ProfileAvatar,
    SubProfileCard
  },
  emits: ['view-all', 'view-hostings'],
  setup(_, context) {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const route = useRoute()
    const router = useRouter()
    const profile = computed(() => store.state.profile.currentProfile)
    const currentProfileId = computed(() => store.state.profile.currentProfile?.id)
    const viewingSelf = computed<boolean>(() => store.getters['profile/viewingSelf'])
    const { load, result: hostProfileResult, loading: hostProfileLoading } = useHostProfileByProfileIdLazyQuery({
      id: currentProfileId.value,
    }, {
      fetchPolicy: 'cache-and-network',
    })
    const hostProfile = computed(() => {
      const data = hostProfileResult.value?.profile
      if (!data) {
        return null
      }
      return data.profile?.hostProfile
    })
    const variables = computed(() => ({
      input: {
        profileId: currentProfileId.value,
        date: store.state.invites.selectedDate,
        role: IHostingRole.Host,
      }
    }))
    const { result: hostingsResult, loading: hostingsLoading } = useHostingsQuery(variables)
    const guests = computed(() => {
      return hostingsResult.value?.Hostings.hostings.map(item => item.guest) || []
    })

    const displayInviteLink = computed(() => {
      return !viewingSelf.value && hostProfile.value?.status &&
        [
          IHostProfileStatus.Available,
          IHostProfileStatus.ActivelyLooking,
        ].includes(hostProfile.value.status)
    })

    const availabilityText = computed(() => {
      return t('profile-view.host.' + (hostProfile.value?.status || 'UNAVAILABLE'))
    })

    const availabilityStyle = computed(() => {
      switch (hostProfile.value?.status) {
      case IHostProfileStatus.Available:
      case IHostProfileStatus.ActivelyLooking:
        return 'green'
      default:
        return ''
      }
    })

    const canHostMeals = computed(() => {
      return !!hostProfile.value?.mealAmount
    })

    const canHostSleep = computed(() => {
      return !!hostProfile.value?.sleepAmount
    })

    const viewAllRoute = computed(() => {
      const { handle } = route.params
      const prefix = handle ? `/profile/${handle}` : '/profile'
      return `${prefix}/endorsements`
    })

    const viewGuests = () => {
      if (viewingSelf.value) {
        router.push('/planner/host')
      } else {
        context.emit('view-hostings', { hostId: currentProfileId })
      }
    }

    const displayInviteModal = () => {
      if (!displayInviteLink.value || !profile.value) {
        return
      }

      const props: CreateInviteModalProps = {
        recipient: profile.value,
        type: IHostingType.Request,
      }
      showModal({
        modal: Modal.CREATE_INVITE,
        props,
      })
    }

    // Convert THURSDAY -> Thursday, LAST_MINUTE -> Last Minute
    const formatReserveBy =(reserveBy: string) => {
      return startCase(lowerCase(reserveBy.replace(/_/g, ' ')))
    }

    const onViewAll = () => {
      router.push(viewAllRoute.value)
    }

    const onEndorsementSubmitted = () => {
      load(undefined, { id: currentProfileId.value }, { fetchPolicy: 'network-only' })
    }

    watch(currentProfileId, () => load(), { immediate: true })

    return {
      availabilityStyle,
      availabilityText,
      canHostMeals,
      canHostSleep,
      displayInviteLink,
      displayInviteModal,
      formatReserveBy,
      guests,
      hostProfile,
      InviteType,
      loading: hostProfileLoading || hostingsLoading,
      maxAvatars: 5,
      onEndorsementSubmitted,
      onViewAll,
      SiteRole,
      viewAllRoute,
      viewGuests,
      viewingSelf,
    }
  }
})
</script>

<style lang="scss" scoped>
.modal-link {
  &:hover,
  &:focus {
    outline: none;
    text-decoration: underline;
    cursor: pointer;
  }
}
.modal-footer {
  align-items: center;
  button {
    border-radius: 18px;
  }
}

.guests-detail {
  :deep(.b-avatar) {
    width: 2rem;
    height: 2rem;
    min-width: 2rem;
    min-height: 2rem;
    border-radius: 50% !important;
  }
}

.host-note {
  font-size: 0.9em;
  font-weight: bold;
  text-align: center;
  margin-top: 20px;
}

.hosting-card-title :deep(.card-header) svg.fa-glass-martini {
  right: -1px;
  padding: 1px;
}

.guests-wrapper {
  display: flex;
  line-height: 1.2rem;

  .guests-detail {
    padding-left: 10px;
    cursor: pointer;

    :deep(strong) {

      &:hover {
        text-decoration: underline;

      }
    }
  }
}

.rtl-at-root {
  .hosting-card-title :deep(.card-header) svg.fa-glass-martini {
    right: unset;
    left: -1px;
  }
}
</style>
