<template>
  <!-- TODO <BSidebar
    id="shabbat-sidebar"
    no-header
    backdrop
    shadow
  > -->
  <div id="shabbat-sidebar">
    <!-- <template #default="{ hide }"> -->
    <div class="p-4">
      <!-- <div
          class="header mb-3"
          @click="hide"
        > -->
      <div class="header mb-3" @click="() => console.info('hide sidebar')">
        <FaIcon :icon="['fas', 'arrow-left']" class="icon-back me-2" />
        <img src="@/assets/img/shabbat-logo-crimson.png" alt="Logo" class="logo" />
      </div>
      <BListGroup flush>
        <BListGroupItem @click="toggleMyShabbatMenu">
          {{ $t('main-header.my-shabbat.title') }}
          <FaIcon class="float-end" :icon="isMyShabbatCollapsed ? ['fas', 'chevron-down'] : ['fas', 'chevron-right']" />
        </BListGroupItem>
        <BCollapse v-model="isMyShabbatCollapsed">
          <BListGroupItem class="child-item" href="/planner">
            {{ $t('main-header.my-shabbat.shabbat-planner') }}
          </BListGroupItem>
          <BListGroupItem class="child-item" href="/shabbat-suggestions">
            {{ $t('main-header.my-shabbat.shabbat-suggestions') }}
          </BListGroupItem>
        </BCollapse>

        <BListGroupItem href="/feed">
          {{ $t('main-header.profile.feed') }}
        </BListGroupItem>
        <BListGroupItem href="/dating">
          {{ $t('main-header.dating-menu.title') }}
        </BListGroupItem>
        <BListGroupItem href="/notifications" class="indicator-content">
          {{ $t('main-header.alerts.title') }}
          <span v-if="unviewedAlertsTotal > 0" class="green-dot" />
        </BListGroupItem>
        <BListGroupItem href="/messages" class="indicator-content border-bottom">
          {{ $t('main-header.profile.messages') }}
          <span v-if="unviewedMessagesTotal > 0" class="green-dot" />
        </BListGroupItem>

        <BListGroupItem @click="toggleMyAccountMenu">
          {{ $t('main-header.profile.my-account') }}
          <FaIcon class="float-end" :icon="isMyAccountCollapsed ? ['fas', 'chevron-down'] : ['fas', 'chevron-right']" />
        </BListGroupItem>
        <BCollapse v-model="isMyAccountCollapsed">
          <BListGroupItem class="child-item" href="/profile">
            {{ $t('main-header.profile.view-profile') }}
          </BListGroupItem>
          <BListGroupItem class="child-item" href="#">
            {{ $t('main-header.profile.settings-privacy') }}
          </BListGroupItem>
          <BListGroupItem class="child-item" href="/profile/edit">
            {{ $t('main-header.profile.edit-profile') }}
          </BListGroupItem>
        </BCollapse>

        <BListGroupItem href="/contact" class="border-top">
          {{ $t('main-header.profile.contact-us') }}
        </BListGroupItem>
        <BListGroupItem href="/faq">
          {{ $t('main-header.profile.faq') }}
        </BListGroupItem>
        <BListGroupItem @click="logout">
          {{ $t('main-header.profile.log-out') }}
        </BListGroupItem>
      </BListGroup>
    </div>
    <!-- </template> -->

    <!-- <template #footer>
      <div class="p-4">
        <SelectLanguage />
      </div>
    </template> -->
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

// import SelectLanguage from '@/components/Layout/Common/SelectLanguage.vue'
import { storeKey } from '@/store'

export default defineComponent({
  name: 'Sidebar',
  components: {
    // SelectLanguage
  },
  setup() {
    const store = useStore(storeKey)
    const router = useRouter()
    const unviewedAlertsTotal = computed(() => store.state.notification.nonMessageNotificationsUnviewedTotal)
    const unviewedMessagesTotal = computed(() => store.state.notification.messageNotificationsUnviewedTotal)
    const isMyAccountCollapsed = ref<boolean>(false)
    const isMyShabbatCollapsed = ref<boolean>(false)

    const toggleMyShabbatMenu = () => {
      isMyShabbatCollapsed.value = !isMyShabbatCollapsed.value
    }

    const toggleMyAccountMenu = () => {
      isMyAccountCollapsed.value = !isMyAccountCollapsed.value
    }

    const logout = () => store.dispatch('auth/logout', { router })

    return {
      isMyAccountCollapsed,
      isMyShabbatCollapsed,
      logout,
      toggleMyAccountMenu,
      toggleMyShabbatMenu,
      unviewedAlertsTotal,
      unviewedMessagesTotal,
    }
  },
})
</script>

<style lang="scss" scoped>
:deep(.b-sidebar-body),
:deep(.b-sidebar-footer) {
  background: $white;
}

.header {
  display: flex;
  align-items: center;

  &:active {
    opacity: 0.5;
  }

  .icon-back {
    margin-top: 12px;
    color: $colorRed;
  }

  .logo {
    width: 100px;
    height: 30px;
    object-fit: contain;
  }
}

:deep(.list-group-item) {
  font-size: 0.8rem;
  padding: 0.75rem 0px;
  border: none;

  &:hover,
  &:active {
    background: transparent;
  }

  &.child-item {
    padding: 0.75rem 1rem;
  }

  &.indicator-content {
    display: flex;
  }
}
</style>
