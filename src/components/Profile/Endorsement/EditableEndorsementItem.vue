<template>
  <div class="endorsement-wrapper">
    <EndorsementItem
      :endorsement="endorsement"
      :site-role="siteRole"
    />
    <div class="endorsement-menu">
      <div :id="menuBtnId" class="endorsement-menu__trigger">
        <FaIcon :icon="['fas', 'caret-down']" />
      </div>
    </div>
    <EndorsementMenu
      :trigger-id="menuBtnId"
      :endorsement="endorsement"
      @edit="$emit('edit', $event)"
      @flag="$emit('flag', $event)"
      @remove="$emit('remove', $event)"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import { useStore } from 'vuex'

import EndorsementItem from '@/components/Profile/Endorsement/EndorsementItem.vue'
import { type IEndorsementFragmentFragment, type IEndorsementSiteRole } from '@/composables/graphql/generated'
import { storeKey } from '@/store'

import EndorsementMenu from './EndorsementMenu.vue'

export default defineComponent({
  name: 'EditableEndorsementItem',
  components: {
    EndorsementItem,
    EndorsementMenu,
  },
  props: {
    endorsement: {
      type: Object as () => IEndorsementFragmentFragment,
      required: true,
    },
    siteRole: {
      type: String as () => IEndorsementSiteRole,
      required: true,
    },
  },
  emits: ['remove', 'flag', 'edit'],
  setup(props) {
    const store = useStore(storeKey)
    const profile = computed(() => store.state.profile.activeProfile)
    const currentProfile = computed(() => store.state.profile.currentProfile)
    const isAdmin = computed(() => store.state.auth.isAdmin)
    const currentUserId = computed(() => store.state.auth.profileId)
    const menuBtnId = computed(() => `endorsement-menu-trigger-${props.endorsement.id}`)

    return {
      menuBtnId,
      currentProfile,
      currentUserId,
      isAdmin,
      profile,
    }
  }
})
</script>

<style lang="scss" scoped>
.endorsement-wrapper {
  display: flex;
  padding: 5px 2px;
  position: relative;
  border-bottom: solid 1px #eee;

  &:last-of-type {
    border-bottom: none;
  }
}

.endorsement-menu__trigger {
  cursor: pointer;
}
</style>
