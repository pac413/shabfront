<template>
  <div class="avatar">
    <img
      v-if="profile.avatar && !shouldHideAvatar"
      :src="profile.avatar.large || profile.avatar.original"
      onerror="this.style.display='none'"
    >
    <div :class="['text-avatar',['bg-' + variant]]">
      <span class="text"> {{ initials }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import type { ISimpleProfile } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { getAvatarVariant,getInitials } from '@/utils'

export default defineComponent({
  name: 'ProfileImage',
  props: {
    profile: {
      type: Object as () => ISimpleProfile,
      required: true,
    }
  },
  setup(props, context) {
    const store = useStore(storeKey)
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const hideAllMedia = computed<boolean>(() => store.getters['profileSettings/hideAllMedia'])
    const variant = computed(() => getAvatarVariant(props.profile))
    const initials = computed(() => getInitials(`${props.profile.firstName} ${props.profile.lastName}`))
    const propsValues = computed(() => ({
      ...context.attrs,
      src: props.profile.avatar && props.profile.avatar.large,
      text: initials.value,
    }))
    const shouldHideAvatar = computed(() =>
      props.profile.id !== activeProfile.value?.id && hideAllMedia.value
    )

    return {
      activeProfile,
      hideAllMedia,
      initials,
      props: propsValues,
      shouldHideAvatar,
      variant,
    }
  }
})
</script>

<style scoped lang="scss">
.avatar {
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;

  div {
    object-fit: cover;
    border-radius: inherit;
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
  }
}
.text-avatar {
  width: 100%;
  height: 100%;

  .text {
    color: white;
    font-size: 60px;
    border-radius: inherit;
    width: 100%;
    height: 100%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
  }
}
</style>
