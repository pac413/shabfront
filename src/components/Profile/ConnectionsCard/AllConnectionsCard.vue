<template>
  <div
    v-esc="cancelSelections"
    class="all-friends-wrapper full-width"
  >
    <ProfileCard>
      <!-- SC-6413 - Temporarily hiding the buttons, because functionality has not yet been implemented.

      <template #menu>
        <div v-if="title === $t('profile-view.general.friends')" class="menu-buttons">
          <template v-if="isSelecting">
            <BButton variant="link" @click="toggleAllSelection">
              {{ allSelected ? $t('profile-view.friends.deselect-all') : $t('profile-view.friends.select-all') }}
            </BButton>
            <BButton size="sm" variant="secondary" @click="cancelSelections">
              {{ $t('general.cancel') }}
            </BButton>
            <BButton v-if="groupMsgMode" size="sm" variant="primary" @click="sendGroupMessage">
              {{ $t('profile-view.friends.message') }}
            </BButton>
            <BButton v-else-if="inviteMode" size="sm" variant="primary" @click="inviteFriends">
              {{ $t('profile-view.friends.invite') }}
            </BButton>
          </template>

          <template v-else>
            <BButton size="sm" variant="secondary" @click="inviteMode = true">
              {{ $t('profile-view.friends.invite-friends') }}
            </BButton>
            <BButton v-if="viewingSelf" size="sm" variant="secondary" @click="groupMsgMode = true">
              {{ $t('profile-view.friends.group-message') }}
            </BButton>
          </template>
        </div>
      </template> -->
      <connections-toggle-grid />
    </ProfileCard>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'

import ConnectionsToggleGrid from '@/components/Profile/ConnectionsCard/ConnectionsToggleGrid.vue'
import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { type Profile } from '@/types'

export default defineComponent({
  name: 'AllConnectionsCard',
  components: { ProfileCard, ConnectionsToggleGrid },
  setup() {
    const profiles = ref<string[]>([])
    const selected = ref<string[]>([])
    const groupMsgMode = ref<boolean>(false)
    const inviteMode = ref<boolean>(false)
    const loading = ref<boolean>(false)

    const isSelecting = computed(() => {
      return groupMsgMode.value || inviteMode.value
    })

    const allSelected = computed(() => {
      return selected.value.length === profiles.value.length
    })

    const toggleAllSelection = () => {
      if (allSelected.value) {
        selected.value = []
      } else {
        selected.value = [...profiles.value]
      }
    }

    const cancelSelections = () => {
      groupMsgMode.value = false
      inviteMode.value = false
      selected.value = []
    }

    const sendGroupMessage = () => {
      // TODO: Dispatches store action to send group messages or navigate to messages screen
    }

    const inviteFriends = () => {
      // TODO: Dispatches store action to let the backend invite friends or navigate to invite screen
    }

    const onItemSelect = (item: Profile) => {
      const idx = selected.value.indexOf(item.id)
      if (idx === -1) {
        selected.value.push(item.id)
      } else {
        selected.value.splice(idx, 1)
      }
    }

    return {
      allSelected,
      cancelSelections,
      groupMsgMode,
      inviteFriends,
      inviteMode,
      isSelecting,
      loading,
      onItemSelect,
      profiles,
      selected,
      sendGroupMessage,
      toggleAllSelection,
    }
  }
})
</script>

<style lang="scss" scoped>
.all-friends-wrapper {
  display: flex;
  flex-direction: column;

  :deep(.card-content) {
    padding: 0;
  }
}

.menu-buttons {
  button {
    margin-left: 5px;
  }
}

a.link {
  cursor: pointer;
}

.rtl-at-root {
  .menu-buttons {
    button {
      margin-left: 0;
      margin-right: 5px;
    }
  }
}
</style>
