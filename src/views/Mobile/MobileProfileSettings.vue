<template>
  <BListGroup class="mobile-profile-settings">
    <BListGroupItem
      v-if="isAdmin && !viewingSelf"
      class="profile-settings__admin text-center py-2"
    >
      ADMIN AFFECTING - {{ profileFullName }}
    </BListGroupItem>
    <BListGroupItem
      v-for="group in groups"
      :key="group.id"
    >
      <AccordionMenu
        :id="group.id"
        accordion-id="details-accordion"
        :icon="group.icon"
        :title="$t(`profile-settings.groups.${group.id}`)"
      >
        <p v-if="group.desc">
          {{ $t(`profile-settings.descriptions.${group.desc}`) }}
        </p>
        <template v-for="item in group.items">
          <li
            v-if="shouldShowItem(item.id)"
            :key="item.id"
            class="settings-item"
          >
            <div v-if="item.type === 'switch'">
              <profile-settings-checkbox
                :value="settings[item.id]"
                :item="item"
                @change="onChange"
              />
            </div>
            <div v-if="item.type === 'radio-group'">
              <profile-settings-radio-group
                :value="settings[item.id]"
                :item="item"
                @change="onChange"
              />
            </div>
            <div v-if="item.type == 'button'">
              <BButton
                :id="item.id"
                size="sm"
                variant="text-link"
                @click="handleClick(item.id)"
              >
                <span class="text">{{ $t(`profile-settings.buttons.${item.id}`) }}</span>
                <span class="icon">
                  <FaIcon :icon="['far', 'angle-right']" />
                </span>
              </BButton>
            </div>
            <p
              v-if="item.desc"
              class="text-secondary description"
            >
              {{ $t(`profile-settings.descriptions.${item.desc}`) }}
            </p>
            <RouterLink
              v-if="item.link"
              :to="item.link.route"
            >
              <FaIcon
                v-if="item.link.icon"
                :icon="item.link.icon"
                class="me-3"
              />
              {{ $t(`profile-settings.links.${item.link.text}`) }}
            </RouterLink>
          </li>
        </template>
        <BListGroupItem
          v-for="subGroup in group.groups"
          :key="subGroup.id"
        >
          <AccordionMenu
            :id="subGroup.id"
            accordion-id="notification-accordion"
            :title="$t(`profile-settings.sub-groups.${subGroup.id}`)"
            :show-arrow="false"
          >
            <p class="accordion-title">
              {{ $t(`profile-settings.${subGroup.id}.title`) }}
            </p>
            <li
              v-for="item in subGroup.items"
              :key="item.id"
              class="settings-item"
            >
              <div v-if="item.type === 'switch'">
                <profile-settings-checkbox
                  :value="settings[item.id]"
                  :item="item"
                  @change="onChange"
                />
              </div>
              <div v-if="item.type === 'radio-group'">
                <profile-settings-radio-group
                  :value="settings[item.id]"
                  :item="item"
                  @change="onChange"
                />
              </div>
              <p
                v-if="item.desc"
                class="text-secondary description"
              >
                {{ $t(`profile-settings.descriptions.${item.desc}`) }}
              </p>
            </li>
          </AccordionMenu>
        </BListGroupItem>

        <RouterLink
          v-if="group.link"
          class="mb-4"
          :to="group.link.route"
        >
          {{ $t(`profile-settings.links.${group.link.text}`) }}
        </RouterLink>
      </AccordionMenu>
    </BListGroupItem>
  </BListGroup>
</template>

<script lang="ts">
import { computed, defineComponent, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import AccordionMenu from '@/components/Layout/MainLayout/MainHeader/components/ProfileSettingsMenu/AccordionMenu.vue'
import ProfileSettingsCheckbox from '@/components/Layout/MainLayout/MainHeader/components/ProfileSettingsMenu/ProfileSettingsCheckbox.vue'
import ProfileSettingsRadioGroup from '@/components/Layout/MainLayout/MainHeader/components/ProfileSettingsMenu/ProfileSettingsRadioGroup.vue'
import {
  datingGroup,
  notificationsGroup as notificationsGroupSettings,
  privacyGroup,
  shabbatGroup
} from '@/components/Layout/MainLayout/MainHeader/components/ProfileSettingsMenu/settings'
import { storeKey } from '@/store'
import { Modal, useModalStore } from '@/stores/modal'
import {
  type ProfileAvailbilitySettings,
  type ProfileSettingsItem,
  type ProfileSettingsValueType,
  SiteRole,
} from '@/types'
import { getSingleIdFromRouteParam } from '@/utils'

export default defineComponent({
  name: 'MobileProfileSettingsMenu',
  components: {
    AccordionMenu,
    ProfileSettingsRadioGroup,
    ProfileSettingsCheckbox
  },
  setup() {
    const store = useStore(storeKey)
    const route = useRoute()
    const { showModal } = useModalStore()

    const isAdmin = computed(() => store.state.auth.isAdmin)
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const currentSettings = computed(() => store.state.profileSettings.currentSettings)
    const currentAvailbilitySettings = computed<ProfileAvailbilitySettings>(
      () => store.getters['profileSettings/currentAvailbilitySettings']
    )
    const settings = computed(() => ({
      ...currentSettings.value,
      ...currentAvailbilitySettings.value,
    }))
    const viewingSelf = computed<boolean>(() => store.getters['profile/viewingSelf'])
    const siteRoles = computed(() => {
      if (activeProfile.value) {
        return activeProfile.value.siteRoles
      }
      return []
    })
    const routeProfileHandle = computed(() => getSingleIdFromRouteParam(route.params.handle))
    const profileFullName = computed(() => {
      if (!activeProfile.value) {
        return ''
      }
      const { firstName, lastName } = activeProfile.value
      return `${firstName} ${lastName}`
    })
    const datingProfile = computed(() => activeProfile.value!.datingProfile)
    const notificationsGroup = computed(() => ({
      ...notificationsGroupSettings,
      groups: notificationsGroupSettings.groups.map(group => {
        return {
          ...group,
          items: group.items?.filter(item => {
            return !item.id.endsWith('ByPush') || activeProfile.value?.isPushSupported
          })
        }
      })
    }))
    const groups = computed(() => ([
      ...(siteRoles.value.includes(SiteRole.GUEST) || siteRoles.value.includes(SiteRole.HOST) ? [shabbatGroup] : []),
      ...(siteRoles.value.includes(SiteRole.DATING) ? [datingGroup] : []),
      privacyGroup,
      notificationsGroup.value
    ]))
    
    onBeforeMount(() => {
      loadProfileSettings()
    })

    const loadProfileSettings = async () => {
      await store.dispatch('profileSettings/getActiveProfileSettings')
    }

    const shouldShowItem = (itemId: string) => {
      if (itemId === 'availableAsGuest' && !siteRoles.value.includes(SiteRole.GUEST)) {
        return false
      }
      if (itemId === 'availableAsHost' && !siteRoles.value.includes(SiteRole.HOST)) {
        return false
      }
      // Hide `Hide All Medias` setting in the mobile specific page
      if (itemId === 'hideAllMedia') {
        return false
      }
      return true
    }

    const onChange = async (item: ProfileSettingsItem, value: ProfileSettingsValueType) => {
      const profileId = activeProfile.value!.id

      switch (item.id) {
      case 'availableAsGuest':
        await store.dispatch('profile/updateGuestProfile', {
          profileId,
          status: value ? 'AVAILABLE' : 'UNAVAILABLE'
        })
        break
      case 'availableAsHost':
        await store.dispatch('profile/updateHostProfile', {
          profileId,
          status: value ? 'AVAILABLE' : 'UNAVAILABLE'
        })
        break
      case 'availableForDating':
        if (value) {
          await store.dispatch('profile/addSiteRole', {
            profileId,
            siteRole: SiteRole.DATING
          })
        } else {
          await store.dispatch('profile/deleteSiteRole', {
            profileId,
            siteRole: SiteRole.DATING
          })
        }
        break
      case 'privateDatingProfile':
        await store.dispatch('profile/updateDatingProfile', {
          profileId,
          id: datingProfile.value?.id,
          isPrivate: value
        })
        break
      default:
        await store.dispatch(
          'profileSettings/updateProfileSettings',
          { profileId, setting: item.id, value }
        )
      }
    }

    const handleClick = (id: string) => {
      switch (id) {
      case 'view-blocking':
        showModal({
          modal: Modal.VIEW_BLOCKING,
          props: {},
        })
        break

      default:
        break
      }
    }

    return {
      isAdmin,
      activeProfile,
      settings,
      viewingSelf,
      siteRoles,
      routeProfileHandle,
      profileFullName,
      datingProfile,
      groups,
      notificationsGroup,
      shouldShowItem,
      onChange,
      handleClick,
    }
  }
})
</script>

<style lang="scss">
.mobile-profile-settings {
  padding: .8rem 0;
  overflow: auto;
  display: flex;
  flex-direction: column;
  margin-bottom: 0;
  border-radius: 0.25rem;

  fieldset {
    margin-bottom: 0;
    font-size: .85rem;
  }

  /* switches should be green when on: */
  .custom-switch .custom-control-input {
    &:checked ~ .custom-control-label::before {
      background-color: $colorActiveGreen;
      border-color: $colorActiveGreen;
    }

    &:focus ~ .custom-control-label::before {
      box-shadow: 0 0 0 0.2rem rgba(103, 194, 58, .25);
    }

    &:focus:not(:checked) ~ .custom-control-label::before {
      border-color: lighten($colorActiveGreen, 30%);
    }

    &:active ~ .custom-control-label::before {
      background-color: lighten($colorActiveGreen, 40%);
      border-color: lighten($colorActiveGreen, 40%);
    }
  }

  /* radio buttons should be black */
  .custom-radio {
    display: flex;
    align-items: center;
    padding-right: 10px;

    .custom-control-label {
      line-height: 1.5rem;
    }

    .custom-control-input {
      &:checked ~ .custom-control-label::before {
        background-color: #000;
        border-color: #000;
      }
      &:focus ~ .custom-control-label::before {
        box-shadow: 0 0 0 0.2rem rgba(0, 0, 0, .15);
      }

      &:active ~ .custom-control-label::before {
        background-color: lighten(black, 85%);
        border-color: lighten(black, 75%);
      }
    }
  }

  .form-row {
    align-items: center;
    justify-content: space-between;

    > div.col {
      flex: 0 0 0%;
      padding: 0 5px 0 0;
    }
  }

  .col-form-label {
    font-weight: bold;
    padding-top: .25rem;
    padding-bottom: .25rem;
  }

  .btn-text-link {
    display: inline-flex;
    justify-content: space-between;
    width: 100%;
  }

  .list-group-item {
    font-size: 0.75rem;
    padding: .8rem 1.5rem;
    border: none;

    .list-group-item {
      .title {
        width: auto;
      }
    }
  }

  .profile-settings__admin {
    font-size: 0.75rem;
  }

  .accordion-item.show {
    overflow-y: auto;
    border-bottom: solid 1px $colorBorder;

    &.collapsing {
      // Hide scrollbar while expanding/collapsing
      overflow-y: hidden;
    }
  }

  .settings-item {
    display: block;
  }

  .settings-item:not(:last-of-type) {
    margin-bottom: 1.5rem;
  }

  .settings-item:only-of-type .col-form-label .span {
    font-weight: normal;
  }

  .accordion-title {
    font-size: 13px;
    color: #606770;
  }
  .accordion-subtitle {
    font-size: 14px;
    line-height: 18px;
    font-weight: 600;
  }

  .description {
    font-style: italic;
    padding: 0 10px 0 0;
    font-size: .85rem;
  }

  .footer {
    display: flex;
    align-items: center;
    padding: 0 0.5rem;
    background-color: #e6e6e6;

    button {
      width: 200px;
      font-size: 0.75rem;
      text-decoration: none;

      &:hover, &:active {
        font-weight: bold;
      }
    }

    .divider {
      width: 1px;
      height: 24px;
      background-color: $gray-500;
    }
  }

  #notifications {
    .list-group-item {
      padding: 0.8rem 1rem 0;
    }

    .list-group-item:last-of-type .accordion-item {
      border-bottom: none;
    }

    h2 {
      padding: .8rem .5rem;
      font-size: .9rem;

      &.not-collapsed {
        background: transparent;
        box-shadow: none;
      }
    }

    .accordion-card {
      margin: 0;
      border: none;
      border-radius: 0;
      border-bottom: solid 1px #DDD;
    }

    .accordion-item-wrapper {
      padding: 0 .5rem;
      margin-bottom: 1rem;
    }
  }

  // Hide Edit Dating Profile, More links
  #dating,
  #shabbat-settings {
    .accordion-item-wrapper {
      a {
        display: none;
      }
    }
  }
  
  .accordion-item-wrapper {
    padding: 1.5rem 0.5rem 0.5rem 1rem;
  }
}

.rtl-at-root {
  .mobile-profile-settings {
    .custom-radio {
      padding-right: unset;
      padding-left: 10px;
    }
    .form-row {
      > div.col {
        padding: 0 0 0 5px;
      }
    }
    .description {
      padding: 0 0 0 10px;
    }
    #notifications {
      .accordion-card {
        margin: 0 3rem 0 1.5rem;
      }
    }
  }
}
</style>
