<template>
  <div class="overlay-menu">
    <div :id="id" class="overlay-menu__trigger" @click.prevent>
      <slot v-if="$slots.icon" name="icon" />
      <FaIcon v-else :icon="['fas', 'ellipsis-h']" />
    </div>
    <BPopover
      ref="popoverRef"
      placement="auto-start"
      click
      :target="id"
      container="body"
      @shown="onShowMenu"
    >
      <div v-click-outside="hide" class="overlay-menu__content">
        <slot :hide="hide" />
      </div>
    </BPopover>
  </div>
</template>

<script lang="ts">
/**
 * Common component for overlay menu
 *
 * <OverlayMenu>
 *   <OverlayMenuSection title="Author (or admin) Only:">
 *     <OverlayMenuItem
 *       :icon="['fal', 'user-plus']"
 *       :label="$t('profile-view.friends.add-friend')"
 *       @click="addFriend"
 *     />
 *   </OverlayMenuSection>
 *   <OverlayMenuSection>
 *     <OverlayMenuItem
 *       :icon="['fal', 'user-plus']"
 *       :label="$t('profile-view.friends.add-friend')"
 *       @click="addFriend"
 *     />
 *   </OverlayMenuSection>
 * </OverlayMenu>
 *
 * OverlayMenuSection component is a wrapper for menu items and serve as a section.
 * If it has title, it renders header part. If not, it hides header.
 *
 * OverlayMenuItem component is just a item wrapper with icon and title.
 */
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'OverlayMenu',
  props: {
    id: {
      type: String,
      required: true,
    },
  },
  emits: ['on-show'],
  setup(props, context) {
    const popoverRef = ref<any | null>(null)
    const hide = () => {
      popoverRef.value?.toggle()
    }
    const onShowMenu = () => {
      context.emit('on-show')
    }
    context.expose({ hide })
    return {
      hide,
      onShowMenu,
      popoverRef,
    }
  },
})
</script>

<style lang="scss" scoped>
.overlay-menu {
  cursor: pointer;

  svg {
    outline: none;
  }
}

.overlay-menu__trigger {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
