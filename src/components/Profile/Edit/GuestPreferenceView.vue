<template>
  <div>
    <div class="panel">
      <div class="panel-header">
        {{ $t('profile-edit.guest-preferences.guest-role') }}
      </div>

      <div class="panel-body d-flex align-items-center">
        <label
          for="guest-role"
          class="input-label flex-grow-1"
        >
          {{ $t('profile-edit.guest-preferences.guest-role-label') }}
        </label>
        <BFormCheckbox
          id="guest-role"
          v-model="guestRole"
          name="guest-role-button"
          switch
          @change="handleGuestRoleChange"
        />
      </div>
    </div>

    <div
      v-if="guestRole"
      class="panel"
    >
      <div class="panel-header">
        {{ $t('profile-edit.guest-preferences.availability') }}
      </div>

      <div class="panel-body">
        <BFormSelect
          id="availability-input"
          v-model="availability"
          :options="availabilityOptions"
          @input="onAvailabilityChange"
          @change="handleProfileUpdate"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import { storeKey } from '@/store'
import { GuestAvailabilityStatus, type InputOption, type Profile, SiteRole } from '@/types'

export default defineComponent({
  name: 'GuestPreferenceView',
  props: {
    profile: {
      type: Object as () => Profile,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const guestRole = computed(() => {
      return props.profile.siteRoles.includes(SiteRole.GUEST)
    })

    const availability = computed(() => {
      if (!props.profile.guestProfile) { return }
      return [
        GuestAvailabilityStatus.UNAVAILABLE_THIS_WEEK,
        GuestAvailabilityStatus.UNAVAILABLE
      ].includes(props.profile.guestProfile.status)
        ? GuestAvailabilityStatus.UNAVAILABLE
        : GuestAvailabilityStatus.AVAILABLE
    })

    const availabilityOptions = computed((): InputOption[] => {
      return ([
        {
          value: null,
          text: t('profile-edit.guest-preferences.availability-null').toString()
        },
        {
          value: GuestAvailabilityStatus.AVAILABLE,
          text: t('profile-edit.guest-preferences.availability-available').toString()
        },
        {
          value: GuestAvailabilityStatus.UNAVAILABLE,
          text: t('profile-edit.guest-preferences.availability-unavailable').toString()
        }
      ])
    })

    const handleGuestRoleChange = (value: boolean) => {
      const params = {
        profileId: props.profile.id,
        siteRole: SiteRole.GUEST
      }
      if (value === false) {
        store.dispatch('profile/deleteSiteRole', params)
      } else {
        store.dispatch('profile/addSiteRole', params)
      }
    }

    const onAvailabilityChange = (newStatus: GuestAvailabilityStatus) => {
      const { guestProfile } = props.profile
      if (guestProfile) {
        guestProfile.status = newStatus
      }
    }

    const handleProfileUpdate = async () => {
      if (availability.value) {
        const payload = {
          profileId: props.profile.id,
          status: availability.value
        }
        await store.dispatch('profile/updateGuestProfile', payload)
      }
    }

    return {
      availability,
      availabilityOptions,
      guestRole,
      handleGuestRoleChange,
      handleProfileUpdate,
      onAvailabilityChange,
    }
  }
})
</script>

<style lang="scss" scoped>
@import './style.module.scss';
</style>
