<template>
  <div
    v-if="member.primaryLocation && member.primaryLocation.address"
    class="member__item__prop"
  >
    <b>Address:</b> {{ member.primaryLocation.address }}
  </div>
  <div class="member__item__prop">
    <b>Location:</b> {{ location }}
  </div>
  <div class="member__item__prop">
    <b>City:</b> {{ city }}
  </div>
  <div
    v-if="isUSorCanada"
    class="member__item__prop"
  >
    <b>State:</b> {{ state }}
  </div>
  <div class="member__item__prop">
    <b>Country:</b> {{ country }}
  </div>
  <div class="member__item__prop">
    <b>Phone:</b> {{ phone }}
  </div>
  <div class="member__item__prop">
    <b>Age:</b> {{ age }}
  </div>
  <div
    v-if="displayName"
    class="member__item__prop"
  >
    <b>Display Name:</b> {{ displayName }}
  </div>
  <div class="member__item__prop">
    <b>Geo Location:</b> {{ geoLocation }}
  </div>
  <div class="member__item__prop">
    <b>Primary Language:</b>&nbsp;
    <language-flag-icon :locale="member.primaryLocale || 'en'" />
    {{ langText }}
  </div>
  <div class="member__item__prop">
    <b>Affiliation:</b> {{ member.religiousAffiliation }}
  </div>
  <div class="member__item__prop">
    <b>Occupation:</b> {{ member.occupation }}
  </div>
  <div class="member__item__prop">
    <b>Role:</b> {{ role }}
  </div>
  <div class="member__item__prop">
    <b>Date Registered:</b> {{ dateRegistered }}
  </div>
  <div class="member__item__prop">
    <b>Date Active:</b> {{ dateActive }}
  </div>
  <div class="member__item__prop">
    <b>Hide All Media:</b> {{ hideAllMedia }}
  </div>
  <div class="member__item__prop">
    <b>Profile Id:</b> {{ member.id }}
  </div>
  <div class="member__item__prop">
    <b>Profile Url:</b>
    <RouterLink
      target="_blank"
      :to="{ name: 'Profile', params: { handle: member.handle } }"
    >
      <b> view</b>
    </RouterLink>
  </div>
  <div class="member__item__prop">
    <b>Email:</b> {{ member.email }}
  </div>
  <div
    v-if="isDeleted"
    class="member__item__prop"
  >
    <b class="member__item__deleted">Member Deleted</b>
  </div>
  <div
    v-if="member.loginMethods && member.loginMethods.length"
    class="member__item__prop"
  >
    <b>Login Methods: </b>
    <ul class="login-methods">
      <li
        v-for="loginMethod of member.loginMethods"
        :key="loginMethod"
        class="login-method"
      >
        <FaIcon :icon="loginMethodIconMap[loginMethod]" />
        <span class="login-method__name">{{ loginMethod }}</span>
      </li>
    </ul>
  </div>
  <div class="member__item__prop">
    <b>Total Messages:</b> 
    <span
      class="member__item__message"
      @click="showMessagesModal"
    >{{ totalMessages }}</span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import languages from '@/assets/js/languages'
import LanguageFlagIcon from '@/components/Common/LanguageFlagIcon.vue'
import type { IAdminRecentMemberFragmentFragment } from '@/composables/graphql/generated'
import moment from '@/plugins/moment'
import { Modal, useModalStore } from '@/stores/modal'
import { AccountStatus } from '@/types'
import { calculateAge, Country, getLocationDisplay, isDateValid } from '@/utils'

export default defineComponent({
  name: 'RecentMemberData',
  components: { LanguageFlagIcon },
  props: {
    member: {
      required: true,
      type: Object as () => IAdminRecentMemberFragmentFragment
    },
    totalMessages: {
      type: Number,
      default: 0
    }
  },
  setup(props) {
    const { showModal } = useModalStore()
    const loginMethodIconMap = {
      'email': ['fal', 'envelope'],
      'facebook': ['fab', 'facebook-f'],
      'google': ['fab', 'google'],
      'apple': ['fab', 'apple']
    }
    const displayName = computed(() => {
      if (props.member.displayName) {
        return props.member.displayName
      }
      return null
    })
    const location = computed(() => {
      if (!props.member.primaryLocation) {
        return
      }
      return getLocationDisplay(props.member.primaryLocation)
    })
    const country = computed(() => {
      if (!props.member.primaryLocation) {
        return
      }
      return props.member.primaryLocation.country
    })
    const city = computed(() => {
      if (!props.member.primaryLocation) {
        return
      }
      return props.member.primaryLocation.city
    })
    const state = computed(() => {
      if (!props.member.primaryLocation) {
        return
      }
      return props.member.primaryLocation.state
    })
    const isUSorCanada = computed(() => {
      return country.value === Country.UNITED_STATES || country.value === Country.CANADA
    })
    const geoLocation = computed(() => {
      if (!props.member.primaryLocation?.geoLocation?.coordinates) {
        return ''
      }
      const { coordinates } = props.member.primaryLocation.geoLocation
      return `(lat: ${coordinates[1]}, lng: ${coordinates[0]})`
    })
    const langText = computed(() => {
      const lang = languages.find(lang => lang.locale === props.member.primaryLocale)
      return lang?.text || 'English'
    })
    const role = computed(() => {
      if (props.member.isAdmin) {
        return 'Admin'
      }
      if (props.member.siteRoles) {
        return props.member.siteRoles.join(', ')
      }
      return null
    })
    const isDeleted = computed(() =>{
      if (props.member.accountStatus) {
        return [
          AccountStatus.AdminSuspended,
          AccountStatus.Deleted
        ].includes(props.member.accountStatus as any)
      }
      return false
    })
    const dateRegistered = computed(() => moment(props.member.createdAt).format('MMM DD, YYYY hh:mm A'))
    const dateActive = computed(() => {
      if (props.member.dateActive) {
        return moment(props.member.dateActive).format('MMM DD, YYYY hh:mm A')
      }
      return null
    })
    const hideAllMedia = computed(() => !!props.member.profileSettings?.hideAllMedia)
    const phone = computed(() => {
      if (!props.member.phone) {
        return
      }
      return props.member.phone
    })
    const age = computed(() => {
      const {birthday} = props.member
      if (birthday && isDateValid(birthday)) {
        return calculateAge(birthday)
      }
      return null
    })

    const showMessagesModal = () => {
      showModal({
        modal: Modal.ADMIN_MEMBER_MESSAGES,
        props: {
          member: props.member
        }
      })
    }
    const getDateString = (date: string) => moment(date).format('LLL')

    return {
      loginMethodIconMap,
      displayName,
      location,
      country,
      city,
      age,
      phone,
      hideAllMedia,
      state,
      isUSorCanada,
      geoLocation,
      langText,
      role,
      isDeleted,
      dateRegistered,
      dateActive,
      showMessagesModal,
      getDateString
    }
  }
})
</script>

<style lang="scss" scoped>
.member__item__deleted {
  color: $colorRed
}

.login-methods {
  .login-method__name {
    margin-left: 4px;
  }
}

.member__item__message {
  color: $colorRed;
  cursor: pointer;
  text-decoration: underline;
  padding: 0 4px;
}

.rtl-at-root {
  .login-methods {
    .login-method__name {
      margin-left: 0;
      margin-right: 4px;
    }
  }
}
</style>
