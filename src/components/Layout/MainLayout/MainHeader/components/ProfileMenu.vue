<template>
  <BPopover
    ref="popoverRef"
    container="body"
    :target="target"
    custom-class="profile-menu-popover"
    placement="bottom"
  >
    <BListGroup class="profile-menu__items">
      <RouterLink
        class="list-group-item list-group-item-action"
        to="/profile"
        @click="hidePopover"
      >
        {{ $t('main-header.profile.view-profile') }}
      </RouterLink>
      <RouterLink
        class="list-group-item list-group-item-action"
        to="/profile/edit/contact-info"
        @click="hidePopover"
      >
        {{ $t('main-header.profile.edit-profile') }}
      </RouterLink>
      <RouterLink
        class="list-group-item list-group-item-action"
        to="/friends"
        @click="hidePopover"
      >
        {{ $t('main-header.profile.friends') }}
      </RouterLink>
      <RouterLink
        class="list-group-item list-group-item-action"
        to="/message-requests"
        @click="hidePopover"
      >
        {{ $t('main-header.profile.message-requests') }}
      </RouterLink>
      <RouterLink
        class="list-group-item list-group-item-action"
        to="/faq"
        @click="hidePopover"
      >
        {{ $t('main-header.profile.faq') }}
      </RouterLink>
      <RouterLink
        class="list-group-item list-group-item-action"
        to="/contact"
        @click="hidePopover"
      >
        {{ $t('main-header.profile.contact-us') }}
      </RouterLink>
      <a class="list-group-item list-group-item-action" :href="BLOG_SHABBAT_LINK">
        {{ $t('main-header.profile.blog') }}
      </a>
      <a class="list-group-item list-group-item-action divider" :href="DONATE_SHABBAT_LINK">
        {{ $t('main-header.profile.donate-to-shabbat-com') }}
      </a>
      <template v-if="isAdmin">
        <!-- Admin section -->
        <BListGroupItem class="list-group-item-header divider">
          {{ $t('main-header.profile.admin') }}
        </BListGroupItem>
        <RouterLink
          class="list-group-item list-group-item-action"
          :to="{ name: 'RecentMembers' }"
          @click="hidePopover"
        >
          {{ $t('main-header.profile.recent-members') }}
        </RouterLink>
        <RouterLink
          class="list-group-item list-group-item-action"
          :to="{ name: 'FlaggedContents' }"
          @click="hidePopover"
        >
          {{ $t('main-header.profile.flagged-contents') }}
        </RouterLink>
        <RouterLink
          class="list-group-item list-group-item-action"
          :to="{ name: 'ReportedMembers' }"
          @click="hidePopover"
        >
          {{ $t('main-header.profile.reported-members') }}
        </RouterLink>
        <RouterLink
          class="list-group-item list-group-item-action divider"
          :to="{ name: 'AdminTotals' }"
          @click="hidePopover"
        >
          {{ $t('main-header.profile.admin-totals') }}
        </RouterLink>
      </template>
      <BListGroupItem href="#" button class="group-item-header" @click="logout">
        {{ $t('main-header.profile.log-out') }}
      </BListGroupItem>
    </BListGroup>
  </BPopover>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

import { storeKey } from '@/store'
import { BLOG_SHABBAT_LINK, DONATE_SHABBAT_LINK } from '@/utils'

export default defineComponent({
  name: 'ProfileMenu',
  props: {
    target: {
      type: String,
      required: true,
    },
  },
  setup() {
    const store = useStore(storeKey)
    const router = useRouter()
    const popoverRef = ref<any | null>(null)
    const isAdmin = computed(() => store.state.auth.isAdmin)
    const logout = () => {
      store.dispatch('auth/logout', { router })
    }

    const hidePopover = () => {
      popoverRef.value?.toggle()
    }

    return {
      BLOG_SHABBAT_LINK,
      DONATE_SHABBAT_LINK,
      hidePopover,
      isAdmin,
      logout,
      popoverRef,
    }
  },
})
</script>

<style lang="scss">
.profile-menu-popover {
  .popover-body {
    padding: 0;
  }

  .list-group-item {
    font-size: 0.75rem;
    padding: 0.5rem 1rem;
    border: none;
  }

  .list-group-item-header {
    font-weight: 700;
    background: $gray-200;
  }

  .divider {
    border-bottom: 1px solid $gray-500;
  }

  .profile-menu__items {
    width: 200px;
    max-height: 70vh;
    overflow-y: auto;

    .list-group-item {
      font-size: 14px;
    }
  }
}
</style>
