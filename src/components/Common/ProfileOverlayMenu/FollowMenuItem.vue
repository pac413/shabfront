<template>
  <OverlayMenuItem
    :disabled="loading"
    :icon="icon"
    :label="label"
    :hint="hint"
    @hide-menu="$emit('hide-menu')"
    @click="toggleFollowingStatus"
  />
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import OverlayMenuItem from '@/components/Common/OverlayMenu/OverlayMenuItem.vue'
import { storeKey } from '@/store'
import type { Profile } from '@/types'

export default defineComponent({
  name: 'FollowMenuItem',
  components: { OverlayMenuItem },
  props: {
    profile: {
      type: Object as () => Profile,
      required: true,
    },
  },
  emits: ['hide-menu'],
  setup(props) {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const loading = ref<boolean>(false)
    const isFollowing = computed(() => props.profile.isFollowing)
    const icon = computed(() => {
      return isFollowing.value ? ['fal', 'user-minus'] : ['fal', 'plus-square']
    })
    const label = computed(() => {
      return isFollowing.value
        ? t('menu-items.profile.unfollow', { firstName: props.profile.firstName })
        : t('menu-items.profile.follow', { firstName: props.profile.firstName })
    })
    const hint = computed(() => {
      return isFollowing.value
        ? t('menu-items.profile.unfollow-hint')
        : t('menu-items.profile.follow-hint')
    })
    const toggleFollowingStatus = async () => {
      loading.value = true
      if (isFollowing.value) {
        await store.dispatch('connections/unfollowProfile', { profile: props.profile })
      } else {
        await store.dispatch('connections/followProfile', { profile: props.profile })
      }
      loading.value = false
    }

    return {
      icon,
      isFollowing,
      label,
      hint,
      loading,
      toggleFollowingStatus
    }
  }
})
</script>
