<template>
  <ProfileCard
    :icon="['fal', 'user-edit']"
    :title="$t('profile-edit.title')"
    class="edit-ProfileCard__container"
  >
    <template #menu>
      <BButton
        v-if="mq.mobile"
        pill
        size="sm"
        variant="secondary"
      >
        <FaIcon
          :icon="['fas', 'bars']"
          @click="showMobileMenu = !showMobileMenu"
        />
      </BButton>
    </template>
    <div class="row">
      <div class="col-xs-12 col-md-3 col-lg-3 menu-container">
        <transition
          name="slide-up"
          mode="out-in"
        >
          <BListGroup
            v-if="!mq.mobile || showMobileMenu"
            class="edit-profile-menu"
          >
            <BListGroupItem
              v-for="item in categories"
              :key="item"
              button
            >
              <RouterLink
                class="edit-profile-category-btn"
                :to="{ name: item, params: { handle: $route.params.handle }}"
              >
                {{ $t(`profile-${item}.title`) }}
              </RouterLink>
            </BListGroupItem>
          </BListGroup>
        </transition>
      </div>

      <div class="col-xs-12 col-md-9 col-lg-9">
        <RouterView v-slot="{ Component }" :profile="profile">
          <transition
            :name="mq.mobile ? '' : 'slide'"
            mode="out-in"
          >
            <component :is="Component" />
          </transition>
        </RouterView>
      </div>
    </div>
  </ProfileCard>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { RouterView } from 'vue-router'
import { useMq } from 'vue3-mq'
import { useStore } from 'vuex'

import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { storeKey } from '@/store'

export default defineComponent({
  name: 'ProfileEditCard',
  components: {
    ProfileCard,
    RouterView
  },
  setup() {
    const store = useStore(storeKey)
    const mq = useMq()
    const profile = computed(() => store.state.profile.currentProfile)
    const isAdmin = computed(() => store.state.auth.isAdmin)
    const viewingSelf = computed<boolean>(() => store.getters['profile/viewingSelf'])
    const showMobileMenu = ref<boolean>(false)
    const categories = computed((): string[] => {
      const tabs: string[] = [
        'edit.contact-info',
        'edit.about-me',
        'edit.guest-preferences',
        'edit.host-preferences',
        'edit.relationship',
        'edit.personal-info',
        'edit.references'
      ]

      if (viewingSelf.value || isAdmin.value) {
        tabs.push('edit.account-settings')
      }

      // check if dating preference is neeeded
      if (!profile.value?.isMarried) {
        tabs.splice(4, 0, 'edit.dating-preferences')
      }

      return tabs
    })

    return {
      categories,
      isAdmin,
      mq,
      profile,
      showMobileMenu,
      viewingSelf,
    }
  },
})
</script>

<style lang="scss" scoped>

.edit-profile-menu .list-group-item {
  padding: 0;
}

a.edit-profile-category-btn {
  display: block;
  color: inherit;
  font-weight: bold;
  padding: 0.75rem 1.25rem;

  &:focus {
    outline: none;
  }

  &:hover {
    text-decoration: none;
  }

  &.router-link-exact-active {
    background-color: #f5f5f5;
    color: #495057;
  }
}

@media (max-width: $mobileMaxWidth) {

  .menu-container {
    display: flex;
    flex-direction: column;
    padding-bottom: 20px;
  }

  .edit-profile-menu {
    flex: 1;
  }
}
</style>
