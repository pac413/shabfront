<template>
  <div class="viewer-item">
    <ProfileOverlayMenu
      :profile="viewer"
      class="more-menu viewer-item__more"
    />
    <RouterLink
      target="_blank"
      :to="`/profile/${viewer.handle}`"
    >
      <ProfileAvatar
        :profile="viewer"
        class="thumb-responsive"
        rounded="xl"
        thumbnail="large"
      />
      <span class="viewer-item__details">{{ `${viewer.firstName} ${viewer.lastName}` }}</span>
      <span class="viewer-item__last_viewed">{{ getAgoString(data.lastVisited) }}</span>
    </RouterLink>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import ProfileAvatar from '@/components/Common/ProfileAvatar.vue'
import ProfileOverlayMenu from '@/components/Common/ProfileOverlayMenu/ProfileOverlayMenu.vue'
import type { IProfileViewFragmentFragment } from '@/composables/graphql/generated'
import { getAgoString } from '@/utils'

export default defineComponent({
  name: 'ViewerItem',
  components: {
    ProfileOverlayMenu,
    ProfileAvatar
  },
  props: {
    data: {
      type: Object as () => IProfileViewFragmentFragment,
      required: true,
    },
    selecting: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const viewer = computed(() => {
      return (props.data && props.data.viewer) || {}
    })

    return {
      getAgoString,
      viewer,
    }
  }
})
</script>

<style lang="scss" scoped>
.viewer-item {
  width: calc(100% / 6);
  max-height: 235px;

  text-align: center;
  padding: 10px;
  padding-bottom: 80px;
  position: relative;
  cursor: pointer;

  a:hover {
    color: inherit;
    text-decoration: none;

    .viewer-item__details {
      text-decoration: underline;
    }
  }

  @media (max-width: $mobileMaxWidth) {
    width: calc(100% / 3);
    .viewer-item__more {
      display: block;
    }
  }
}

.link {
  color: #6B6B6B;
}

.viewer-item__details,
.viewer-item__last_viewed {
  color: #6B6B6B;
  font-weight: 500;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.viewer-item__details {
  margin-top: 10px;
}

.viewer-item__last_viewed {
  font-size: 12px;
  margin-top: -3px;

  &:hover {
    font-size: 12px;
  }
}

img.thumb-responsive {
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
}

.viewer-item__more {
  position: absolute;
  top: 12px;
  right: 12px;
}
</style>
