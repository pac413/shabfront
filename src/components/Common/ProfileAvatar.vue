<template>
  <RouterLink v-if="linkable && linkAttrs" v-bind="linkAttrs">
    <Avatar
      v-bind="propValues"
    />
  </RouterLink>
  <Avatar
    v-else
    v-bind="propValues"
    @click="$emit('click')"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import Avatar from '@/components/Common/Avatar.vue'
import type { ISimpleProfileFragmentFragment } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import type { Avatar as AvatarPayload, SimpleProfile } from '@/types'
import { getAvatarVariant } from '@/utils'

const thumbnailValidator = (val: string) => ['small', 'medium', 'large', 'original'].includes(val)

// Define default size of thumbnails in case of no `size` prop is defined
const THUMBNAIL_SIZES = {
  small: '30px',
  medium: '90px',
  large: '150px',
  original: '150px'
}

/**
 * Common component to display avatar or initials of profile
 *
 * @param profile Profile object whose avatar to be displayed
 * @param thumbnail Size of the avatar supported by Profile object
 *
 * This component also benefits from bootstrap avatar component
 * and make it available for all the props required by b-avatar component.
 *
 * Here is the reference to bootstrap avatar component
 * https://bootstrap-vue.org/docs/components/avatar
 */
export default defineComponent({
  name: 'ProfileAvatar',
  components: { Avatar },
  props: {
    profile: {
      type: Object as () => Pick<
        SimpleProfile | ISimpleProfileFragmentFragment,
        'id' | 'avatar' | 'firstName' | 'lastName' | 'handle'
      >,
      required: true,
    },
    thumbnail: {
      type: String as () => keyof typeof THUMBNAIL_SIZES,
      default: 'small',
      validator: thumbnailValidator
    },
    linkable: {
      type: Boolean,
      default: false
    },
    linkableTarget: {
      type: String,
      default: null
    }
  },
  emits: ['click'],
  setup(props, context) {
    const store = useStore(storeKey)
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const hideAllMedia = computed<boolean>(() => store.getters['profileSettings/hideAllMedia'])
    const avatarUrl = computed(() => {
      const { avatar } = props.profile
      if (avatar) {
        return avatar[props.thumbnail as keyof AvatarPayload] || avatar.original
      }
      return null
    })

    const shouldHideAvatar = computed(() => {
      return props.profile.id !== activeProfile.value?.id && hideAllMedia.value
    })
    const linkAttrs = computed(() => ({
      to: `/profile/${props.profile.handle}/`,
      ...(props.linkableTarget ? { target: props.linkableTarget } : {}),
    }))

    const propValues = computed(() => {
      if (!props.profile) {return}
      return {
        ...context.attrs,
        ...(!shouldHideAvatar.value && { src: avatarUrl.value }),
        text: `${props.profile.firstName} ${props.profile.lastName}`,
        size: context.attrs['size'] || THUMBNAIL_SIZES[props.thumbnail],
        variant: getAvatarVariant(props.profile),
      }
    })

    return {
      activeProfile,
      avatarUrl,
      hideAllMedia,
      linkAttrs,
      propValues,
    }
  }
})
</script>
