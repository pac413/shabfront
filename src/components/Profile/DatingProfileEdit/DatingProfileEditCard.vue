<template>
  <ProfileCard
    :icon="['fal', 'heart']"
    :title="title"
    class="edit-dating-ProfileCard__container"
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
            class="edit-dating-profile-menu"
          >
            <BListGroupItem
              v-for="item in categories"
              :key="item"
              button
            >
              <RouterLink
                :to="getLocation(item)"
                class="edit-dating-profile-category-btn"
              >
                {{ $t(`dating-profile-edit.${item}.title`) }}
              </RouterLink>
            </BListGroupItem>
          </BListGroup>
        </transition>
      </div>

      <div class="col-xs-12 col-md-9 col-lg-9">
        <RouterView
          v-slot="{ Component }" 
          :profile="profile"
          :dating-profile="datingProfile" 
        >
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
import { useI18n } from 'vue-i18n'
import { RouterView, useRoute } from 'vue-router'
import { useMq } from 'vue3-mq'
import { useStore } from 'vuex'

import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { storeKey } from '@/store'

export default defineComponent({
  name: 'DatingProfileEditCard',
  components: {
    ProfileCard,
    RouterView,
  },
  setup() {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const route = useRoute()
    const mq = useMq()

    const profile = computed(() => store.state.profile.currentProfile)
    const showMobileMenu = ref<boolean>(false)
    const categories = [
      'background',
      'personal-details',
      'education',
      'matchmaker',
      'personal-description',
      'looking-for',
      'privacy-settings'
    ]

    const title = computed(() => {
      if (!profile.value?.datingProfile) {
        return ''
      }
      return t('dating-profile-edit.title').toString()
    })

    const getLocation = (tab: string) => {
      const { handle } = route.params
      return { name: `edit-dating.${tab}`, params: { handle } }
    }

    const datingProfile = computed(() => {
      return profile.value?.datingProfile
    })

    return {
      categories,
      datingProfile,
      getLocation,
      mq,
      profile,
      showMobileMenu,
      title,
    }
  }
})
</script>

<style lang="scss" scoped>

.edit-dating-profile-menu .list-group-item {
  padding: 0;
}

a.edit-dating-profile-category-btn {
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

  .edit-dating-profile-menu {
    flex: 1;
  }
}
</style>
