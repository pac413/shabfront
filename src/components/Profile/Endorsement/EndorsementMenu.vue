<template>
  <BPopover
    ref="popoverRef"
    :target="triggerId"
    container="body"
    custom-class="endorsement-menu"
    placement="bottom"
  >
    <div class="btn-group">
      <button
        v-if="isAdmin || currentUserId === endorsement.endorser.id"
        v-b-tooltip.hover.bottom="$t('profile-view.host.delete-entry')"
        type="button"
        class="btn btn-sm"
        @click="onRemove"
      >
        <FaIcon :icon="['fal', 'trash']" />
      </button>
      <button
        v-if="currentUserId !== endorsement.endorser.id"
        v-b-tooltip.hover.bottom="$t('profile-view.host.flag-content')"
        type="button"
        class="btn btn-sm"
        @click="onFlag"
      >
        <FaIcon :icon="['far', 'flag']" />
      </button>
      <button
        v-if="profile && endorsement.endorser.id === profile.id"
        v-b-tooltip.hover.bottom="$t('profile-view.host.edit')"
        type="button"
        class="btn btn-sm"
        @click="onEdit"
      >
        <FaIcon :icon="['fal', 'pencil-alt']" />
      </button>
    </div>
  </BPopover>
</template>


<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { useStore } from 'vuex'

import { type IEndorsementFragmentFragment } from '@/composables/graphql/generated'
import { storeKey } from '@/store'

export default defineComponent({
  name: 'EndorsementMenu',
  props: {
    endorsement: {
      type: Object as () => IEndorsementFragmentFragment,
      required: true,
    },
    triggerId: {
      type: String,
      required: true,
    },
  },
  emits: ['remove', 'flag', 'edit'],
  setup(props, context) {
    const store = useStore(storeKey)
    const profile = computed(() => store.state.profile.activeProfile)
    const isAdmin = computed(() => store.state.auth.isAdmin)
    const currentUserId = computed(() => store.state.auth.profileId)
    const popoverRef = ref<any>(null)

    const hideMenu = () => {
      popoverRef.value?.toggle()
    }

    const onRemove = () =>{
      context.emit('remove', props.endorsement)
      hideMenu()
    }

    const onFlag = () =>{
      context.emit('flag', props.endorsement)
      hideMenu()
    }

    const onEdit = () =>{
      context.emit('edit', props.endorsement)
      hideMenu()
    }

    return {
      currentUserId,
      isAdmin,
      onEdit,
      onFlag,
      onRemove,
      popoverRef,
      profile,
    }
  }
})
</script>

<style lang="scss">
.endorsement-menu {
  border: none;
  box-shadow: none;

  .popover-body {
    padding: 0;
    background: $colorRed;
    display: flex;
    border-radius: 2px;
  }

  &.bs-popover-bottom {
    top: -4px !important;

    .popover-arrow {
      top: -7px !important;
    }
  }

  &.bs-popover-top {
    top: 4px !important;

    .popover-arrow {
      bottom: -7px !important;
    }
  } 

  .popover-arrow {
    &::after, &::before {
      border-bottom-color: $colorRed !important;
      border-top-color: $colorRed !important;
    }
  }

  .btn-group {
    display: flex;
    border-radius: 2px;
  }

  .btn {
    width: 32px;
    height: 32px;
    border: none;
    border-radius: 0;
    color: #FFFFFF;
    
    svg path {
      stroke-width: 2px; /*Between 1px and 2px*/
    }

    &:hover, &:active {
      color: #A9A9A9 !important;
    }
  }
}
</style>
