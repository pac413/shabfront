<template>
  <div class="profile__wrapper layout--two-column">
    <template v-if="profile">
      <div
        v-if="!mq.mobile"
        class="two-column__left"
      >
        <VueAffix
          relative-element-selector="#feed-list"
          :offset="{ top: 90, bottom: 20 }"
          :scroll-affix="true"
        >
          <div class="profile__cards__content">
            <StatsCard />
            <HostCard
              v-if="isHost"
              @view-all="navigateRoute('Endorsements')"
              @view-hostings="navigateRoute('Hosting Guest', $event)"
            />
            <GuestCard
              v-if="isGuest"
              @view-all="navigateRoute('Endorsements')"
            />
            <DatingCard
              v-if="shouldShowDating"
              @view-all="navigateRoute('Endorsements')"
              @open-edit="navigateRoute('Edit Dating Profile')"
            />
            <PicturesCard
              v-if="!hideAllMedia"
              @view-all="navigateRoute('All Pictures')"
            />
            <ConnectionsCard
              :profile-id="profileId"
              @view-all="navigateRoute('All Connections')"
            />
            <ViewersCard
              @view-all="navigateRoute('All Viewers')"
            />
            <ProfileCard
              v-if="isAdmin"
              :icon="['fal', 'key']"
              :title="$t('profile-view.admin.title')"
            >
              <AdminNotes />
              <AdminData />
            </ProfileCard>
          </div>
        </VueAffix>
      </div>
      <div
        id="feed-list"
        class="profile__feed two-column__right"
      >
        <profile-feed-list />
      </div>
    </template>
    <Spinner v-else />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMq } from 'vue3-mq'
import { useStore } from 'vuex'

import VueAffix from '@/components/Common/VueAffix/VueAffix.vue'
import ProfileFeedList from '@/components/Feed/FeedList/ProfileFeedList.vue'
import AdminData from '@/components/Profile/AdminData.vue'
import AdminNotes from '@/components/Profile/AdminNotes.vue'
import ConnectionsCard from '@/components/Profile/ConnectionsCard/ConnectionsCard.vue'
import DatingCard from '@/components/Profile/DatingCard.vue'
import GuestCard from '@/components/Profile/GuestCard.vue'
import HostCard from '@/components/Profile/HostCard.vue'
import PicturesCard from '@/components/Profile/PicturesCard/PicturesCard.vue'
import ProfileCard from '@/components/Profile/ProfileCard.vue'
import StatsCard from '@/components/Profile/StatsCard.vue'
import ViewersCard from '@/components/Profile/ViewersCard/ViewersCard.vue'
import { storeKey } from '@/store'
import { getSingleIdFromRouteParam } from '@/utils'

export default defineComponent({
  name: 'ProfilePage',
  components: {
    AdminData,
    VueAffix,
    ConnectionsCard,
    StatsCard,
    GuestCard,
    HostCard,
    DatingCard,
    PicturesCard,
    ProfileCard,
    ViewersCard,
    AdminNotes,
    ProfileFeedList
  },
  setup() {
    const store = useStore(storeKey)
    const route = useRoute()
    const router = useRouter()
    const mq = useMq()
    const profile = computed(() => store.state.profile.currentProfile)
    const isAdmin = computed(() => store.state.auth.isAdmin)
    const isGuest = computed<boolean>(() => store.getters['profile/isGuest'])
    const isHost = computed<boolean>(() => store.getters['profile/isHost'])
    const isDating = computed<boolean>(() => store.getters['profile/isDating'])
    const hideAllMedia = computed<boolean>(() => store.getters['profileSettings/hideAllMedia'])
    const shouldShowDating = computed(() => {
      return isDating.value && !profile.value?.isMarried
    })
    const handle = computed(() => getSingleIdFromRouteParam(route.params.handle))
    const profileId = computed(() => profile.value!.id)

    const navigateRoute = (routeName: string, props?: any) => {
      if (route.name === routeName) { return }
      router.push({ name: routeName, params: { handle: handle.value, ...props } })
    }

    return {
      hideAllMedia,
      isAdmin,
      isDating,
      isGuest,
      isHost,
      mq,
      navigateRoute,
      profile,
      profileId,
      shouldShowDating,
    }
  }
})
</script>

<style lang="scss" scoped>
.profile__wrapper {
  width: 100%;
  display: flex;
  align-items: flex-start;
}

.profile__cards {
  position: relative;
}

:deep(.icon-item) {
  padding: 3px 0;
  svg {
    color: #aaa;
  }
  a {
    color: inherit;
  }
}

:deep(.card-header) svg {
  right: -1px;

  &.fa-user-edit {
    right: -4px;
  }
}

.profile__feed {
  height: 100%;
  display: flex;
  flex-direction: column;
  will-change: height;

  :deep(.card) {
    box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.05);
    border: 1px solid #e4e4e4;
    border-radius: 12px;
    margin-bottom: 1.5rem;
    padding: 18px 20px;
  }
}

@media (max-width: $mobileMaxWidth) {
  .profile__wrapper {
    flex-wrap: wrap;
    margin: 0 auto
  }

  .profile__cards {
    margin: 0 auto;
  }

  .profile__feed {
    flex: 3 0 300px;
    overflow: hidden;

    :deep(.card) {
      padding: 0;
    }
  }
}

.rtl-at-root {
  :deep(.card-header) svg {
    left: -1px;
    right: unset;

    &.fa-user-edit {
      left: -4px;
      right: unset;
    }
  }
}
</style>
