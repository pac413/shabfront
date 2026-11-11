<template>
  <div>
    <div
      v-if="!date"
      class="panel"
    >
      <div class="panel-header">
        {{ $t('profile-edit.host-preferences.host-role') }}
      </div>

      <div class="panel-body d-flex align-items-center">
        <label
          for="host-role"
          class="input-label flex-grow-1"
        >
          {{ $t('profile-edit.host-preferences.host-role-label') }}
        </label>
        <BFormCheckbox
          id="host-role"
          :model-value="hostRole"
          name="host-role-button"
          switch
          @change="handleHostRoleChange"
        />
      </div>
    </div>

    <template v-if="hostRole">
      <div
        v-if="hostProfile"
        class="panel"
      >
        <div class="panel-header">
          {{ $t('profile-edit.host-preferences.availability') }}
        </div>

        <div class="panel-body">
          <BFormSelect
            id="availability-input"
            v-model="hostAvailability"
            :options="availabilityOptions"
            @input="hostProfile.status = $event"
            @change="handleProfileUpdate('status')"
          />
        </div>
      </div>

      <div
        v-if="hostProfile"
        class="panel"
      >
        <div class="panel-header">
          <FaIcon
            :icon="['fal', 'home']"
            class="me-1"
          />
          {{ $t('profile-edit.host-preferences.preference') }}
        </div>

        <div class="panel-body">
          <BFormGroup
            id="reserve-by"
            class="form-group"
            :label="$t('profile-edit.host-preferences.reserve-by')"
            label-for="reserve-by-select"
            label-class="input-label"
          >
            <BFormSelect
              id="reserve-by-select"
              v-model="reserveBy"
              :options="reserveByOptions"
              @change="handleProfileUpdate('reserveBy')"
            />
          </BFormGroup>
          <BFormGroup
            id="meals-amount"
            class="form-group"
            :label="$t('profile-edit.host-preferences.meals-amount')"
            label-for="meals-amount-select"
            label-class="input-label"
          >
            <BFormSelect
              id="meals-amount-select"
              v-model="mealAmount"
              :options="mealsAmountOptions"
              @change="handleProfileUpdate('mealAmount')"
            />
          </BFormGroup>
          <BFormGroup
            id="sleep-amount"
            class="form-group"
            :label="$t('profile-edit.host-preferences.sleep-amount')"
            label-for="sleep-amount-select"
            label-class="input-label"
          >
            <BFormSelect
              id="sleep-amount-select"
              v-model="sleepAmount"
              :options="sleepAmountOptions"
              @change="handleProfileUpdate('sleepAmount')"
            />
          </BFormGroup>
          <BFormGroup class="form-group">
            <BFormCheckbox
              id="host-men-checkbox"
              v-model="hostMen"
              name="host-men-checkbox"
              :value="true"
              :unchecked-value="false"
              @change="(checked: boolean) => handleProfileUpdate('hostMen', checked)"
            >
              {{ $t('profile-edit.host-preferences.available-to-host-men') }}
            </BFormCheckbox>
          </BFormGroup>
          <BFormGroup class="form-group">
            <BFormCheckbox
              id="host-women-checkbox"
              v-model="hostWomen"
              name="host-women-checkbox"
              :value="true"
              :unchecked-value="false"
              @change="(checked: boolean) => handleProfileUpdate('hostWomen', checked)"
            >
              {{ $t('profile-edit.host-preferences.available-to-host-women') }}
            </BFormCheckbox>
          </BFormGroup>
          <BFormGroup class="form-group">
            <BFormCheckbox
              id="host-families-checkbox"
              v-model="hostFamiliesWithChildren"
              name="host-families-checkbox"
              :value="true"
              :unchecked-value="false"
              @change="(checked: boolean) => handleProfileUpdate('hostFamiliesWithChildren', checked)"
            >
              {{ $t('profile-edit.host-preferences.available-to-host-families') }}
            </BFormCheckbox>
          </BFormGroup>
          <BFormGroup class="form-group">
            <BFormCheckbox
              id="host-afilliated-jews-checkbox"
              v-model="hostAffiliatedJews"
              name="host-afilliated-jews-checkbox"
              :value="true"
              :unchecked-value="false"
              @change="(checked: boolean) => handleProfileUpdate('hostAffiliatedJews', checked)"
            >
              {{ $t('profile-edit.host-preferences.available-to-host-afilliated-jews') }}
            </BFormCheckbox>
          </BFormGroup>
          <BFormGroup class="form-group">
            <BFormCheckbox
              id="host-unafilliated-jews-checkbox"
              v-model="hostUnAffiliatedJews"
              name="host-unafilliated-jews-checkbox"
              :value="true"
              :unchecked-value="false"
              @change="(checked: boolean) => handleProfileUpdate('hostUnAffiliatedJews', checked)"
            >
              {{ $t('profile-edit.host-preferences.available-to-host-unafilliated-jews') }}
            </BFormCheckbox>
          </BFormGroup>
        </div>
      </div>
      <div
        v-if="hostProfile && !disableUnavailableGuests"
        class="panel"
      >
        <div class="panel-header">
          {{ $t('profile-edit.host-preferences.unavailable-to-host-guests.title') }}
        </div>

        <div class="panel-body">
          <div class="mb-2">
            {{ $t('profile-edit.host-preferences.unavailable-to-host-guests.description') }}
          </div>
          <div
            v-click-outside="() => toggleSearchPopup(false)"
            class="search-wrapper"
          >
            <search-input
              ref="inputRef"
              v-model="keyword"
              :placeholder="$t('profile-edit.host-preferences.unavailable-to-host-guests.search-placeholder')"
              :opened="popupVisible"
              :search-by="IAutoTypeSearchBy.Profiles"
              @open-popup="toggleSearchPopup(true)"
              @close-popup="toggleSearchPopup(false)"
            />
            <transition name="search-fade">
              <div
                v-if="popupVisible"
                class="search-popup"
                tabindex="0"
              >
                <search-popup
                  :keyword="keyword"
                  :loading="loading"
                  typeahead-mode
                  :search-by="IAutoTypeSearchBy.Profiles"
                  :profiles="autoTypeSearchProfiles"
                  @close-popup="toggleSearchPopup(false)"
                  @selected="onGuestSelected"
                />
              </div>
            </transition>
          </div>
          <div
            v-if="unavailableGuests.length > 0"
            class="guests-wrapper my-2"
          >
            <ul>
              <li
                v-for="guest in unavailableGuests"
                :key="guest.id"
                class="badge d-inline-flex align-items-center"
              >
                <span class="flex-grow-1 text-truncate">{{ `${guest.firstName} ${guest.lastName}` }}</span>
                <button
                  type="button"
                  class="guest-remove-btn"
                  @click="onGuestRemoved(guest)"
                >
                  ×
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div
        class="panel"
      >
        <div class="panel-header">
          {{ $t('profile-edit.host-preferences.guest-list-privacy') }}
        </div>

        <div class="panel-body d-flex align-items-center">
          <label
            for="show-guest-list"
            class="input-label flex-grow-1"
          >
            {{ $t('profile-edit.host-preferences.guest-list-privacy-label') }}
          </label>
          <BFormCheckbox
            id="show-guest-list"
            :model-value="showGuestList"
            name="show-guest-list-button"
            switch
            @change="(checked: boolean) => handleProfileUpdate('showGuestList', checked)"
          />
        </div>
      </div>
      <div
        class="panel"
      >
        <div class="panel-header">
          {{ $t('profile-edit.host-preferences.private-invites.title') }}
        </div>

        <div class="panel-body">
          <div class="d-flex align-items-center">
            <label
              for="show-guest-list"
              class="input-label flex-grow-1"
            >
              {{ $t('profile-edit.host-preferences.private-invites.label') }}
            </label>
            <BFormCheckbox
              id="show-guest-list"
              :model-value="privateInviteEnabled"
              name="private-invite-switch"
              switch
              @change="(checked: boolean) => handleProfileUpdate('privateInviteEnabled', checked)"
            />
          </div>
          <div v-if="privateInviteEnabled" class="d-flex align-items-center mt-2">
            <div class="flex-grow-1">
              <span class="me-2">
                {{ $t('profile-edit.host-preferences.private-invites.passcode') }}
              </span>
              <span class="private-invite-code">
                {{ privateInviteCode }}
              </span>
            </div>
            <BButton
              variant="link"
              size="sm"
              class="passcode-regenerate-btn d-flex align-items-center"
              @click="handleProfileUpdate('privateInviteCode')"
            >
              {{ $t('profile-edit.host-preferences.private-invites.regenerate') }}
              <FaIcon
                :icon="['fa', 'rotate']"
                class="ms-1"
                @click="handleProfileUpdate('privateInviteCode')"
              />
            </BButton>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, type Ref, ref, toRefs,watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import AutoTypeSearchInput from '@/components/AutoTypeSearch/AutoTypeSearchInput.vue'
import AutoTypeSearchPopup from '@/components/AutoTypeSearch/AutoTypeSearchPopup.vue'
import { IAutoTypeSearchBy, ISearchFor, useAutoTypeSearchQuery } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { useGlobalStore } from '@/stores/global'
import {
  type HostProfile,
  HostProfileStatus,
  type InputOption,
  type Profile,
  ReserveHostingOptions,
  type SimpleProfile,
  SiteRole
} from '@/types'
import { generatePasscode } from '@/utils'


export default defineComponent({
  name: 'HostPreferenceView',
  components: {
    SearchInput: AutoTypeSearchInput,
    SearchPopup: AutoTypeSearchPopup,
  },
  props: {
    profile: {
      type: Object as () => Profile,
      required: true,
    },
    date: {
      type: String,
      required: false,
      default: null,
    },
    hostProfileForDate: {
      type: Object as () => HostProfile,
      required: false,
      default: null,
    }
  },
  setup(props) {
    const { t } = useI18n()
    const { profile } = toRefs(props)
    const store = useStore(storeKey)
    const globalStore = useGlobalStore()
    const route = useRoute()
    
    const reserveBy = ref<string | null>(null)
    const mealAmount = ref<number>(0)
    const sleepAmount = ref<number>(0)
    const hostMen = ref<boolean>(false)
    const hostWomen = ref<boolean>(false)
    const hostFamiliesWithChildren = ref<boolean>(false)
    const hostAffiliatedJews = ref<boolean>(false)
    const hostUnAffiliatedJews = ref<boolean>(false)
    const unavailableGuests = ref<SimpleProfile[]>([])
    const showGuestList = ref<boolean>(false)
    const privateInviteEnabled = ref<boolean>(false)
    const privateInviteCode = ref<string>('')

    const keyword: Ref<string> = ref('')
    const popupVisible: Ref<boolean> = ref(false)
    const inputRef: Ref<InstanceType<typeof AutoTypeSearchInput> | null> = ref(null)
    
    const hostRole = computed(() => {
      return profile.value && profile.value.siteRoles.includes(SiteRole.HOST)
    })

    const hostProfile = computed(() => {
      return props.hostProfileForDate || profile.value.hostProfile
    })

    const hostAvailability = computed(() => {
      if (!hostProfile.value) {return}
      return [
        HostProfileStatus.UNAVAILABLE_THIS_WEEK,
        HostProfileStatus.UNAVAILABLE
      ].includes(hostProfile.value?.status) ? HostProfileStatus.UNAVAILABLE : HostProfileStatus.AVAILABLE
    })

    const availabilityOptions = computed((): InputOption[] => {
      return ([
        {
          value: null,
          text: t('profile-edit.host-preferences.availability-null').toString()
        },
        {
          value: HostProfileStatus.AVAILABLE,
          text: t('profile-edit.host-preferences.availability-available').toString()
        },
        {
          value: HostProfileStatus.UNAVAILABLE,
          text: t('profile-edit.host-preferences.availability-unavailable').toString()
        }
      ])
    })

    const reserveByOptions = computed(() => {
      return ReserveHostingOptions.map(item => {
        return { value: item, text: t(`profile-edit.host-preferences.reserve-by-${item}`).toString() }
      })
    })

    const mealsAmountOptions = computed(() => {
      let options = [
        { value: '0', text: t('profile-edit.host-preferences.meals-amount-no-meal').toString() }
      ]
      for (let i = 1; i < 9; i++) {
        options.push({ value: `${i}`, text: `${i}` })
      }
      options.push({ value: '20', text: '20' })
      options.push({ value: '1000', text: t('profile-edit.host-preferences.option-unlimited').toString() })

      return options
    })

    const sleepAmountOptions = computed(() => {
      let options = [
        { value: '0', text: t('profile-edit.host-preferences.sleep-amount-no-sleeping').toString() }
      ]
      for (let i = 1; i < 9; i++) {
        options.push({ value: `${i}`, text: `${i}` })
      }
      options.push({ value: '20', text: '20' })
      options.push({ value: '1000', text: t('profile-edit.host-preferences.option-unlimited').toString() })
      return options
    })

    const disableUnavailableGuests = computed(() => {
      return route.name === 'ShabbatPlanner'
    })

    const variables = computed(() => ({
      keyword: keyword.value,
      searchBy: IAutoTypeSearchBy.Profiles,
      searchFor: ISearchFor.Guests,
      language: globalStore.language.locale as any,
      limit: 5
    }))
    const { result, loading } = useAutoTypeSearchQuery(variables, () => ({
      debounce: 300,
      enabled: !!keyword.value
    }))
    const autoTypeSearchProfiles = computed(() => result.value?.autoTypeSearch?.profiles || [])

    const toggleSearchPopup = (visible: boolean): void => {
      popupVisible.value = visible
    }

    const onGuestSelected = (profile: SimpleProfile) => {
      const index = unavailableGuests.value.findIndex(guest => guest.id === profile.id)
      if (index === -1) {
        unavailableGuests.value = [...unavailableGuests.value, profile]
        handleProfileUpdate('unavailableGuests')
      }
      keyword.value = ''
    }

    const onGuestRemoved = (profile: SimpleProfile) => {
      unavailableGuests.value = unavailableGuests.value.filter(guest => guest.id !== profile.id)
      handleProfileUpdate('unavailableGuests')
    }

    const handleHostRoleChange = (value: boolean) => {
      const params = {
        profileId: profile.value.id,
        siteRole: SiteRole.HOST
      }
      if (value === false) {
        store.dispatch('profile/deleteSiteRole', params)
      } else {
        store.dispatch('profile/addSiteRole', params)
      }
    }

    const handleProfileUpdate = async (fieldName: keyof HostProfile, checked?: boolean) => {
      if (!hostProfile.value) {
        return
      }
      const payload: any = {
        profileId: profile.value.id,
        hostingDate: props.date
      }
      switch (fieldName) {
      case 'status':
        if (!hostProfile.value.status) {
          return
        }
        payload[fieldName] = hostProfile.value[fieldName]
        break

      case 'mealAmount':
        payload.mealAmount= parseInt(mealAmount.value.toString(), 10)
        break
      case 'sleepAmount':
        payload.sleepAmount = parseInt(sleepAmount.value.toString(), 10)
        break

      case 'hostMen':
      case 'hostWomen':
      case 'hostAffiliatedJews':
      case 'hostUnAffiliatedJews':
      case 'hostFamiliesWithChildren':
      case 'showGuestList':
      case 'privateInviteEnabled': {
        payload[fieldName] = checked
        if (checked) {
          payload.privateInviteCode = generatePasscode(4)
        }
        break
      }
      case 'reserveBy':
        payload.reserveBy = reserveBy.value
        break
      case 'unavailableGuests':
        payload.unavailableGuests = unavailableGuests.value.map(guest => guest.id)
        break
      case 'privateInviteCode':
        payload.privateInviteCode = generatePasscode(4)
        break
      default:
        break
      }
      await store.dispatch('profile/updateHostProfile', payload)
    }

    watch(hostProfile, () => {
      if (!hostProfile.value) {
        return
      }

      reserveBy.value = hostProfile.value.reserveBy
      mealAmount.value = hostProfile.value.mealAmount
      sleepAmount.value = hostProfile.value.sleepAmount
      hostMen.value = hostProfile.value.hostMen
      hostWomen.value = hostProfile.value.hostWomen
      hostFamiliesWithChildren.value = hostProfile.value.hostFamiliesWithChildren
      hostAffiliatedJews.value = hostProfile.value.hostAffiliatedJews
      hostUnAffiliatedJews.value = hostProfile.value.hostUnAffiliatedJews
      unavailableGuests.value = hostProfile.value.unavailableGuests || []
      showGuestList.value = hostProfile.value.showGuestList
      privateInviteEnabled.value = hostProfile.value.privateInviteEnabled
      privateInviteCode.value = hostProfile.value.privateInviteCode
    }, { immediate: true })

    return {
      availabilityOptions,
      handleHostRoleChange,
      handleProfileUpdate,
      hostAffiliatedJews,
      hostAvailability,
      hostFamiliesWithChildren,
      hostMen,
      hostProfile,
      hostRole,
      hostUnAffiliatedJews,
      hostWomen,
      mealAmount,
      mealsAmountOptions,
      reserveBy,
      reserveByOptions,
      sleepAmount,
      sleepAmountOptions,
      disableUnavailableGuests,
      unavailableGuests,
      IAutoTypeSearchBy,
      keyword,
      popupVisible,
      inputRef,
      autoTypeSearchProfiles,
      loading,
      toggleSearchPopup,
      onGuestSelected,
      onGuestRemoved,
      showGuestList,
      privateInviteEnabled,
      privateInviteCode
    }
  }
})
</script>

<style lang="scss" scoped>
@import './style.module.scss';

.search-popup {
  margin-top: 10px;
}
.search-fade-enter-active,
.search-fade-leave-active {
  transition: all 200ms linear 0s;
}
.search-fade-enter-from,
.search-fade-leave-to {
  opacity: 0;
  filter: blur(2px);
}
.search-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0,0,0, 0.5);
}

:deep(.auto-type-search-input) {
  .form-control {
    padding-left: 2.375rem;
    padding-right: 2rem;
    border: 1px solid #ced4da;
    border-radius: 0.25rem;
    transition: all 200ms linear 0s;

    &:focus {
      box-shadow: 0 0 0 0 transparent;
    }
  }

  .form-control--opened {
    border-color: rgb(235, 235, 235);
  }
}
:deep(.search-popup) {
  .search-options, .search-group-title, .search-items__footer {
    display: none;
  }
}

ul {
  padding: 0;
  margin-bottom: 0;
}

.badge {
  border-radius: 25px;
  padding: 6px 12px;
  background: white;
  color: $colorRed;
  border: 1px solid $colorRed;
  margin-right: 8px;
  margin-bottom: 8px;
}

.guest-remove-btn {
  font-size: 125%;
  margin-left: 0.25rem;
  padding: 0;
  border: 0;
  color: inherit;
  background-color: rgba(255, 0, 0, 15%);
  border-radius: 30px;
  width: 15px;
  height: 15px;
  transition: 0.3s background-color;

  &:hover {
    background-color: rgba(255, 0, 0, 30%);
  }
}

.private-invite-code {
  font-size: 1.5rem;
  letter-spacing: 0.2rem;
}

.passcode-regenerate-btn {
  text-decoration: none !important;
  color: $colorActiveGreen !important;

  svg {
    margin-bottom: 2px;
  }
}

</style>
