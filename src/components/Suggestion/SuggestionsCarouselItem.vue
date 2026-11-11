<template>
  <div class="suggestion-item">
    <BCard>
      <RouterLink
        :to="{ name: 'Profile', params: { handle: item.handle } }"
        class="card-top-link"
      >
        <ProfileImage :profile="item" />
      </RouterLink>
      <div class="card-content">
        <div class="card-title">
          <ProfileLinkableName :profile="item" />
        </div>
        <div class="slot-content">
          <slot />
        </div>
      </div>
    </BCard>
    <ProfileOverlayMenu
      :profile="item"
      class="more-menu"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

import ProfileImage from '@/components/Common/ProfileImage.vue'
import ProfileLinkableName from '@/components/Common/ProfileLinkableName.vue'
import ProfileOverlayMenu from '@/components/Common/ProfileOverlayMenu/ProfileOverlayMenu.vue'
import type { IProfileFragmentFragment } from '@/composables/graphql/generated'

export default defineComponent({
  name: 'SuggestionsCarouselItem',
  components: {
    ProfileOverlayMenu,
    ProfileLinkableName,
    ProfileImage
  },
  props: {
    item: {
      type: Object as () => IProfileFragmentFragment,
      required: true,
    }
  }
})
</script>

<style lang="scss" scoped>
.suggestion-item {
  position: relative;
  width: 100%;

  .card {
    margin: 0 5px;
    padding: 0;
    border: 0;

    a.card-top-link:hover {
      text-decoration: none;
    }

    :deep(.avatar) {
      border-bottom-left-radius: 0px;
      border-bottom-right-radius: 0px;
      height: 140px;
    }
  }
}
.more-menu {
  :deep(.overlay-menu) {
    position: absolute;
    top: 10px;
    right: 10px;
  }
}
.card-title {
  font-size: 1rem;
  font-weight: 600;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin: 0;
  padding: .5rem;
  a {
    color: $colorText;
  }
}
:deep(.card-body) {
  padding: 0 0 1rem 0;
  text-align: center;
}
.slot-content {
  color: $colorSecondary;
  font-size: .9em;
}

.rtl-at-root {
  .more-menu {
    :deep(.overlay-menu) {
      right: unset;
      left: 10px;
    }
  }
}
</style>
