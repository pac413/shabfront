<template>
  <ProfileCard
    v-if="!loading && connections.length"
    :icon="['fal', 'users']"
    :title="title"
    @title-clicked="swapContent"
  >
    <picture-grid
      id="intro-friends"
      :items="friends"
      :total="totalConnections"
      :loading="loading"
      :max="maxItemsToShow"
      @view-all="swapContent"
    >
      <template #item="{ item }">
        <ProfileAvatar
          :profile="item"
          :square="true"
          size="100%"
          style="font-size: 5rem"
          thumbnail="medium"
          class="img-responsive"
          linkable
        />
        <span class="name link-unstyled">{{ item.displayName }}</span>
      </template>
    </picture-grid>
  </ProfileCard>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { toRefs } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import PictureGrid from '@/components/Common/PictureGrid.vue'
import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { useConnections } from '@/composables/useConnections'
import { storeKey } from '@/store'

const maxItemsToShow = 5

export default defineComponent({
  name: 'ConnectionsCard',
  components: { PictureGrid, ProfileCard, ProfileAvatar },
  props: {
    profileId: {
      type: String,
      required: true
    }
  },
  emits: ['view-all'],
  setup(props, context) {
    const { profileId } = toRefs(props)
    const { t } = useI18n()
    const store = useStore(storeKey)
    const totalConnections = computed(() => store.state.profile.currentProfile?.totals.connections)
    const viewingSelf = computed<boolean>(() => store.getters['profile/viewingSelf'])
    const {
      loading,
      connections,
      friends,
      mutualFriendsCount,
    } = useConnections(profileId, maxItemsToShow)
    const title = computed(() => {
      let title = t('profile-view.general.connections').toString()

      if (!viewingSelf.value && mutualFriendsCount.value > 0) {
        title += ` (${t('profile-view.general.n-mutual-friend', { n: mutualFriendsCount.value })})`
      }
      return title
    })

    const swapContent = () => {
      context.emit('view-all')
    }

    return {
      connections,
      friends,
      loading,
      maxItemsToShow,
      swapContent,
      title,
      totalConnections,
      viewingSelf,
    }
  }
})
</script>
