<template>
  <div id="sticky-header" ref="mainHeader" class="sticky-top main-header-wrapper">
    <AdminNotice v-if="authenticated && isAdmin" @dismissed="onAdminNoticeDismissed" />

    <div ref="mainHeaderContent" class="navbar header-container">
      <!-- mobile -->
      <div v-if="mq.laptop" class="container h-100 px-0">
        <!-- left sidebar with toggle -->
        <Toggle :show-badge="false" />
        <Sidebar />
        <!-- right side of the menu for mobile -->
        <div class="navbar-right-container">
          <BButton class="nav-item nav-round-button" variant="light" href="/mobile-search">
            <FaIcon :icon="['fas', 'search']" class="toggle-icon" />
          </BButton>
          <BButton class="nav-item nav-round-button" variant="light" href="/profile">
            <ProfileAvatar v-if="profile" size="36px" thumbnail="medium" :profile="profile" />
          </BButton>
        </div>
      </div>

      <!-- desktop -->
      <div v-else class="main-header">
        <div class="main-header__logo-search">
          <Logo theme="crimson" />
          <AutoTypeSearch />
        </div>
        <div class="main-header__nav-buttons">
          <BButton id="nav-home" to="/feed" class="nav-item nav-button" variant="light">
            <FaIcon :icon="['far', 'home']" />
          </BButton>

          <BButton
            id="nav-my-shabbat"
            to="/planner"
            class="nav-item nav-button split"
            variant="light"
            @click="toggleMyShabbat"
          >
            {{ $t('main-header.my-shabbat.title') }}
            <FaIcon :icon="['fas', 'chevron-down']" @click.prevent />
          </BButton>

          <BButton
            id="nav-dating-menu"
            to="/dating"
            class="nav-item nav-button split"
            variant="light"
            @click="toggleDatingMenu"
          >
            {{ $t('main-header.dating-menu.title') }}
            <FaIcon :icon="['fas', 'chevron-down']" @click.prevent />
          </BButton>

          <NonMessageNotificationMenu>
            <template #target="{ id, showBadge, hideMenu }">
              <BButton
                :id="id"
                class="nav-item nav-round-button"
                variant="light"
                to="/notifications"
                @click="hideMenu"
              >
                <FaIcon :icon="['far', 'bell']" />
                <span v-if="showBadge" class="green-dot" />
              </BButton>
            </template>
          </NonMessageNotificationMenu>

          <MessageNotificationMenu>
            <template #target="{ id, showBadge, hideMenu }">
              <BButton
                :id="id"
                class="nav-item nav-round-button"
                variant="light"
                to="/messages"
                @click="hideMenu"
              >
                <FaIcon :icon="['fal', 'comment-plus']" />
                <span v-if="showBadge" class="green-dot" />
              </BButton>
            </template>
          </MessageNotificationMenu>

          <BButton
            id="nav-profile-settings"
            class="nav-item nav-round-button"
            variant="light"
            @click="toggleProfileSettingsMenu"
          >
            <FaIcon :icon="['fal', 'cog']" />
          </BButton>

          <BButton
            id="nav-profile"
            class="nav-item nav-round-button overflow-hidden"
            variant="light"
            to="/profile"
            @click="toggleProfileMenu"
          >
            <ProfileAvatar v-if="profile" size="45px" thumbnail="medium" :profile="profile" />
          </BButton>

          <SelectLanguage class="nav-dropdown" variant="light" />
        </div>

        <!-- POPOVER MENUS -->
        <MyShabbat ref="myShabbatRef" target="nav-my-shabbat" />
        <DatingMenu ref="datingMenuRef" target="nav-dating-menu" />
        <ProfileMenu ref="profileMenuRef" target="nav-profile" />
        <ProfileSettingsMenu ref="profileSettingsMenuRef" target="nav-profile-settings" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useMq } from 'vue3-mq'
import { useStore } from 'vuex'

import AutoTypeSearch from '@/components/AutoTypeSearch/AutoTypeSearch.vue'
import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import Logo from '@/components/Layout/Common/Logo.vue'
import SelectLanguage from '@/components/Layout/Common/SelectLanguage.vue'
import Toggle from '@/components/Layout/Common/Toggle.vue'
import AdminNotice from '@/components/Layout/MainLayout/MainHeader/components/AdminNotice.vue'
import NonMessageNotificationMenu from '@/components/Layout/MainLayout/MainHeader/components/AlertsMenu/NonMessageNotificationMenu.vue'
import DatingMenu from '@/components/Layout/MainLayout/MainHeader/components/DatingMenu.vue'
import MessageNotificationMenu from '@/components/Layout/MainLayout/MainHeader/components/MessageMenu/MessageNotificationMenu.vue'
import MyShabbat from '@/components/Layout/MainLayout/MainHeader/components/MyShabbat.vue'
import ProfileMenu from '@/components/Layout/MainLayout/MainHeader/components/ProfileMenu.vue'
import ProfileSettingsMenu from '@/components/Layout/MainLayout/MainHeader/components/ProfileSettingsMenu/ProfileSettingsMenu.vue'
import Sidebar from '@/components/Layout/MainLayout/MainHeader/components/Sidebar.vue'
import { storeKey } from '@/store'
import { useGlobalStore } from '@/stores/global'

export default defineComponent({
  name: 'MainHeader',
  components: {
    AutoTypeSearch,
    Logo,
    Toggle,
    MyShabbat,
    DatingMenu,
    SelectLanguage,
    ProfileMenu,
    Sidebar,
    ProfileAvatar,
    MessageNotificationMenu,
    NonMessageNotificationMenu,
    ProfileSettingsMenu,
    AdminNotice,
  },
  setup() {
    const store = useStore(storeKey)
    const globalStore = useGlobalStore()
    const mq = useMq()
    const authenticated = computed(() => store.state.auth.authenticated)
    const profile = computed(() => store.state.profile.activeProfile)
    const currentProfile = computed(() => store.state.profile.currentProfile)
    const isAdmin = computed(() => store.state.auth.isAdmin)
    const viewingSelf = computed<boolean>(() => store.getters['profile/viewingSelf'])
    const mainHeader = ref<HTMLDivElement | null>(null)
    const mainHeaderContent = ref<HTMLDivElement | null>(null)
    const myShabbatRef = ref<any | null>(null)
    const datingMenuRef = ref<any | null>(null)
    const profileMenuRef = ref<any | null>(null)
    const profileSettingsMenuRef = ref<any | null>(null)

    const loadProfileSettings = async () => {
      if (currentProfile.value && isAdmin.value && !viewingSelf.value) {
        await store.dispatch('profileSettings/getCurrentProfileSettings', { profileId: currentProfile.value.id })
      } else {
        await store.dispatch('profileSettings/getActiveProfileSettings')
      }
    }

    const onAdminNoticeDismissed = () => {
      if (mainHeaderContent.value) {
        globalStore.mainHeaderHeight = mainHeaderContent.value.clientHeight
      }
    }

    const toggleMyShabbat = () => {
      if (document.contains(document.getElementsByClassName('my-shabbat-popover')[0])) {
        myShabbatRef.value?.popoverRef.toggle()
      }
    }

    const toggleDatingMenu = () => {
      if (document.contains(document.getElementsByClassName('dating-menu-popover')[0])) {
        datingMenuRef.value?.popoverRef.toggle()
      }
    }

    const toggleProfileMenu = () => {
      if (document.contains(document.getElementsByClassName('profile-menu-popover')[0])) {
        profileMenuRef.value?.popoverRef.toggle()
      }
    }

    const toggleProfileSettingsMenu = () => {
      if (document.contains(document.getElementsByClassName('profile-settings-popover')[0])) {
        profileSettingsMenuRef.value?.popoverRef.toggle()
      }
    }

    watch(
      currentProfile,
      () => {
        loadProfileSettings()
      },
      { immediate: true },
    )

    onMounted(() => {
      loadProfileSettings()

      if (mainHeader.value) {
        globalStore.mainHeaderHeight = mainHeader.value.clientHeight
      }
    })

    return {
      authenticated,
      currentProfile,
      isAdmin,
      loadProfileSettings,
      mainHeader,
      mainHeaderContent,
      mq,
      onAdminNoticeDismissed,
      profile,
      viewingSelf,
      myShabbatRef,
      datingMenuRef,
      profileMenuRef,
      profileSettingsMenuRef,
      toggleMyShabbat,
      toggleDatingMenu,
      toggleProfileMenu,
      toggleProfileSettingsMenu,
    }
  },
})
</script>

<style scoped lang="scss">
@import '../../header.scss';

.navbar {
  padding: 0.5rem 1rem;
}

.main-header-wrapper {
  z-index: 1021;
}

:deep(.nav-round-button) {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  margin: 0px 1px;
  padding: 0px;
  position: relative;
  background-color: #ededed;
  border: none;
  color: $colorRed;

  &:focus,
  &:active {
    color: $colorRed;
    border-color: transparent;
    background-color: #dae0e5;
  }
}

#nav-profile {
  overflow: hidden;
}

.green-dot {
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.8rem;
  min-width: 16px;
  height: 16px;
  top: -2px;
  left: calc(100% - 13px);
  background-color: $colorGreen;
  color: white;
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
  position: absolute;
  padding-left: 4px;
  padding-right: 4px;

  &:after {
    content: '';
    width: 6px;
    height: 6px;
    background: white;
    border-radius: 50%;
  }
}

.main-header {
  flex: 1;
  display: flex;

  @media only screen and (min-width: 1200px) {
    max-width: 1600px;
    margin: 0 auto;
  }
}

.btn {
  font-size: 1rem;
}

.main-header__logo-search {
  flex: 1;
  display: flex;
  align-items: center;

  :deep(.navbar-brand) {
    margin-bottom: 0.75rem;
  }

  :deep(.search-input) .form-control {
    font-size: 0.9rem;
  }
}
.main-header__nav-buttons {
  display: flex;
  align-items: center;
}

@media only screen and (min-width: 1200px) {
  :deep(.navbar-brand) {
    padding: 0;
    height: 42px;
  }

  :deep(.nav-button) {
    margin: 0 5px;
    text-decoration: none;

    &.split svg {
      margin-left: 5px;

      &:focus,
      &:hover {
        outline: 0px transparent;
      }
    }
  }

  :deep(.nav-round-button) {
    width: 42px;
    height: 42px;
    min-width: 42px;
    min-height: 42px;
    margin: 0 7px;
  }

  :deep(.search-wrapper) {
    flex-grow: 0.8;
    margin-left: 2rem;
    margin-right: 2rem;
  }
}

:deep(.search-wrapper) {
  flex-grow: 1;
  margin-left: 1rem;
  margin-right: 1rem;
}

.navbar-right-container {
  display: flex;
  align-items: center;
}

.rtl-at-root {
  .main-header {
    @media only screen and (min-width: 1200px) {
      :deep(.nav-button) {
        &.split svg {
          margin-left: 0;
          margin-right: 5px;
        }
      }
    }
  }
}
</style>
