<template>
  <BPopover
    ref="popoverRef"
    :target="target"
    custom-class="profile-settings-popover"
    placement="bottom-start"
    container="body"
    boundary="viewport"
  >
    <BListGroup class="profile-settings">
      <BListGroupItem
        v-if="isAdmin && !viewingSelf"
        class="profile-settings__admin text-center py-2"
      >
        ADMIN AFFECTING - {{ currentProfileFullName }}
      </BListGroupItem>
      <BAccordion flush>
        <BListGroupItem
          v-for="group in groups"
          :key="group.id"
        >
          <AccordionMenu
            :id="group.id"
            :icon="group.icon"
            :title="$t(`profile-settings.groups.${group.id}`)"
            class="accordion-menu"
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
                  <ProfileSettingsCheckbox
                    :value="settings[item.id]"
                    :item="item"
                    @change="onChange"
                  />
                </div>
                <div v-if="item.type === 'radio-group'">
                  <ProfileSettingsRadioGroup
                    :value="settings[item.id]"
                    :item="item"
                    @change="onChange"
                  />
                </div>
                <div v-if="item.type === 'button'">
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
                  @click="hidePopover"
                >
                  {{ $t(`profile-settings.links.${item.link.text}`) }}
                </RouterLink>
              </li>
            </template>
            <BAccordion flush>
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
                      <ProfileSettingsCheckbox
                        :value="settings[item.id]"
                        :item="item"
                        @change="onChange"
                      />
                    </div>
                    <div v-if="item.type === 'radio-group'">
                      <ProfileSettingsRadioGroup
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
            </BAccordion>

            <RouterLink
              v-if="group.link"
              class="mb-4"
              :to="group.link.route"
              @click="hidePopover"
            >
              {{ $t(`profile-settings.links.${group.link.text}`) }}
            </RouterLink>
          </AccordionMenu>
        </BListGroupItem>
      </BAccordion>
    </BListGroup>
  </BPopover>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'

import { storeKey } from '@/store'
import { Modal, useModalStore } from '@/stores/modal'
import {
  type ProfileAvailbilitySettings,
  type ProfileSettingsItem,
  type ProfileSettingsValueType,
  SiteRole,
} from '@/types'
import { getSingleIdFromRouteParam } from '@/utils'

import AccordionMenu from './AccordionMenu.vue'
import ProfileSettingsCheckbox from './ProfileSettingsCheckbox.vue'
import ProfileSettingsRadioGroup from './ProfileSettingsRadioGroup.vue'
import {
  adminFeedContentGroup,
  blockingGroup,
  datingGroup,
  feedContentGroup,
  notificationsGroup as notificationsGroupSettings,
  privacyGroup,
  searchingGroup,
  shabbatGroup,
} from './settings'

export default defineComponent({
  name: 'ProfileSettingsMenu',
  components: {
    AccordionMenu,
    ProfileSettingsRadioGroup,
    ProfileSettingsCheckbox
  },
  props: {
    target: {
      type: String,
      required: true,
    },
  },
  setup() {
    const store = useStore(storeKey)
    const route = useRoute()
    const { showModal } = useModalStore()
    const popoverRef = ref<any | null>(null)
    const isAdmin = computed(() => store.state.auth.isAdmin)
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const currentProfile = computed(() => store.state.profile.currentProfile)
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
      if (currentProfile.value) {
        return currentProfile.value.siteRoles
      }
      return activeProfile.value!.siteRoles
    })

    const routeProfileHandle = computed(() => getSingleIdFromRouteParam(route.params.handle))

    const currentProfileFullName = computed(() => {
      if (!currentProfile.value) {return ''}

      const { firstName, lastName } = currentProfile.value
      return `${firstName} ${lastName}`
    })

    const notificationsGroup = computed(() => {
      const profile = currentProfile.value || activeProfile.value

      return {
        ...notificationsGroupSettings,
        groups: notificationsGroupSettings.groups.map(group => {
          return {
            ...group,
            items: group.items?.filter(item => {
              return !item.id.endsWith('ByPush') || profile?.isPushSupported
            })
          }
        })
      }
    })

    const groups = computed(() => {
      return [
        ...(siteRoles.value.includes(SiteRole.GUEST) || siteRoles.value.includes(SiteRole.HOST) ? [shabbatGroup] : []),
        ...(siteRoles.value.includes(SiteRole.DATING) ? [datingGroup] : []),
        privacyGroup,
        blockingGroup,
        isAdmin.value ? adminFeedContentGroup : feedContentGroup,
        searchingGroup,
        notificationsGroup.value
      ]
    })

    const datingProfile = computed(() => {
      if (currentProfile.value) {
        return currentProfile.value.datingProfile
      }
      return activeProfile.value!.datingProfile
    })

    const hidePopover = () => {
      popoverRef.value?.toggle()
    }

    const shouldShowItem = (itemId: string) => {
      if (itemId === 'availableAsGuest' && !siteRoles.value.includes(SiteRole.GUEST)) {
        return false
      }
      if (itemId === 'availableAsHost' && !siteRoles.value.includes(SiteRole.HOST)) {
        return false
      }
      return true
    }

    const onChange = async (item: ProfileSettingsItem, value: ProfileSettingsValueType) => {
      const profileId = isAdmin.value && !viewingSelf.value && currentProfile.value
        ? currentProfile.value.id
        : activeProfile.value!.id

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
          id: datingProfile.value!.id,
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
      case 'view-blocking': {
        showModal({ modal: Modal.VIEW_BLOCKING, props: {} })
        break
      }

      default:
        break
      }
      hidePopover()
    }

    return {
      activeProfile,
      currentProfile,
      currentProfileFullName,
      datingProfile,
      groups,
      handleClick,
      hidePopover,
      isAdmin,
      notificationsGroup,
      onChange,
      popoverRef,
      settings,
      shouldShowItem,
      siteRoles,
      routeProfileHandle,
      viewingSelf,
    }
  }
})
</script>

<style lang="scss">
.profile-settings-popover {
  .popover-body {
    padding: 0;
    width: 400px;
    max-height: calc(85vh);
    overflow: auto;

    fieldset {
      margin-bottom: 0;
      font-size: .85rem;
    }
  }

  .list-group {
    padding: .8rem 0;
  }

  .card-header {
    padding: 0;
    background: unset;
    border: none;
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
      flex: 1;
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
    width: 100%;
    display: inline-flex;
    justify-content: space-between;
  }

  .list-group-item {
    font-size: 0.75rem;
    padding: 0px 0px;
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

  .accordion-menu.show {
    max-height: 50vh;
    overflow-y: auto;
    border-bottom: solid 1px $colorBorder;

    .form-switch {
      padding-left: 2em;
    }

    &.collapsing {
      // Hide scrollbar while expanding/collapsing
      overflow-y: hidden;
      .form-switch {
        padding-left: 2.5em;
      }
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
}

.profile-settings {
  #notifications {
    & > .accordion-body > .accordion-item-wrapper {
      padding: 1rem 1rem 1rem 3.4rem !important;
    }

    .accordion-button {
      padding: 0.8rem;
      border-bottom: solid 1px $colorBorder;

      &:not(.collapsed) {
        background-color: transparent;
        border-color: transparent;
        box-shadow: none;
      }
    }

    .list-group-item:last-child {
      .accordion-button {
        border-bottom: none;
      }
    }

    .accordion-card__title {
      font-size: .9rem;
    }

    .accordion-item-wrapper {
      padding: 0.8rem;
    }
  }
}

.rtl-at-root {
  .profile-settings {
    .custom-radio {
      padding-right: auto;
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
