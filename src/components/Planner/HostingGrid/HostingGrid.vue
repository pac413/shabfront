<template>
  <PlannerCard :title="$t(`planner.${selectedRole}-grid-title`)">
    <template
      v-if="hostings.length"
      #menu
    >
      <BNav>
        <BNavItem
          :active="sortByStatus"
          @click="toggleSort"
        >
          {{ $t('planner.sort-status') }}
        </BNavItem>
        <BNavItem
          :active="!sortByStatus"
          @click="toggleSort"
        >
          {{ $t('planner.sort-meal') }}
        </BNavItem>
        <BNavItem
          v-if="hasAnySelected"
          class="nav-item-primary"
          @click="maybeAddEndorsement"
        >
          {{ $t('planner.endorse-selected') }}
        </BNavItem>
        <BNavItem
          v-if="hasAnySelected"
          class="nav-item-primary"
          @click="maybeSendMessage"
        >
          {{ $t('planner.message-selected') }}
        </BNavItem>
      </BNav>
    </template>
    <Spinner v-if="loading" />
    <div
      v-else-if="hostings.length"
      class="hosting-grid-wrapper py-3"
    >
      <div
        v-if="hasAnySelected"
        class="d-flex align-items-center px-2"
      >
        <BFormCheckbox
          name="toggleAll"
          class="checkbox-red"
          button-variant="secondary"
          :model-value="allSelected"
          @change="toggleAll"
        />
        <label
          for="toggleAll"
          class="m-0"
        >
          {{ allSelected ? $t('profile-view.friends.deselect-all') : $t('profile-view.friends.select-all') }}
        </label>
      </div>
      <HostingGridRow
        v-for="(items, category) in sorted"
        :key="category"
        class="mx-3"
        :category="category"
        :items="items"
        :role="selectedRole"
        :selectable="selectable"
        :selected-status="selectedStatus"
        :sort-by-status="sortByStatus"
        @view="$emit('view', $event)"
        @select="onItemsSelected"
      />
    </div>
    <div
      v-else
      class="pb-4 text-center text-secondary"
    >
      {{ $t(`planner.${selectedRole}-no-items`) }}
    </div>

    <SendMessageToGuestsModal
      v-model:visible="sendMessageToGuestsModalVisible"
      :invitations="selectedHostings"
    />
  </PlannerCard>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue'
import { watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

import HostingGridRow from '@/components/Planner/HostingGrid/HostingGridRow.vue'
import PlannerCard from '@/components/Planner/PlannerCard.vue'
import SendMessageToGuestsModal from '@/components/Planner/SendMessageToGuestsModal/SendMessageToGuestsModal.vue'
import { IEndorsementSiteRole, IHostingRole, type ISimpleProfile, useHostingsLazyQuery } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { type EndorsementModalProps, Modal, useModalStore } from '@/stores/modal'
import { type InviteDetail } from '@/types'
import { sortedHostings } from '@/utils'

export default defineComponent({
  name: 'HostingGrid',
  components: {
    HostingGridRow,
    PlannerCard,
    SendMessageToGuestsModal
  },
  emits: ['view'],
  setup() {
    const store = useStore(storeKey)
    const { showModal } = useModalStore()
    const route = useRoute()
    const router = useRouter()
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const selectedRole = computed(() => store.state.planner.selectedRole)
    const selectedDate = computed(() => store.state.planner.selectedDate)
    const sortByStatus = ref<boolean>(true)
    const sendMessageToGuestsModalVisible = ref<boolean>(false)
    const selectedStatus = ref<{ [key: string]: boolean }>({})
    const { load, result, loading } = useHostingsLazyQuery({
      input: {
        date: selectedDate.value,
        role: selectedRole.value || IHostingRole.Host,
      }
    })
    const hostings = computed(() => loading.value ? [] : result.value?.Hostings.hostings || [])

    const sorted = computed(() => sortedHostings(sortByStatus.value, hostings.value))
    const allSelected = computed((): boolean =>
      hostings.value.every(item => selectedStatus.value[item.id])
    )
    const hasAnySelected = computed((): boolean =>
      Object.keys(selectedStatus.value).some(id => selectedStatus.value[id])
    )
    const selectedHostings = computed(() =>
      hostings.value.filter(item => selectedStatus.value[item.id])
    )
    const selectable = computed((): boolean => selectedRole.value === IHostingRole.Host)
    const toggleSort = (): void => {
      sortByStatus.value = !sortByStatus.value
    }
    const toggleAll = (): void => {
      if (allSelected.value) {
        selectedStatus.value = {}
      } else {
        selectedStatus.value = {}
        hostings.value.forEach((item) => {
          selectedStatus.value[item.id] = true
        })
      }
    }
    const cancelSelections = (): void => {
      selectedStatus.value = {}
    }
    const onItemsSelected = (params: { items: InviteDetail[], isSelected: boolean }): void => {
      const updatedSelectedStatus = {
        ...selectedStatus.value,
      }
      params.items.forEach((item) => {
        updatedSelectedStatus[item.id] = params.isSelected
      })
      selectedStatus.value = updatedSelectedStatus
    }
    const maybeAddEndorsement = (): void => {
      const modalProps: EndorsementModalProps = {
        endorser: activeProfile.value! as any as ISimpleProfile,
        endorseesInvitations: selectedHostings.value as any,
        type: IEndorsementSiteRole.Guest,
        onSubmitted: () => {
          const { handle } = route.params
          router.push({
            name: 'Profile',
            params: {
              handle,
            },
          })
        }
      }
      showModal({
        modal: Modal.ENDORSEMENT,
        props: modalProps,
      })
    }
    const maybeSendMessage = (): void => {
      sendMessageToGuestsModalVisible.value = true
    }
    
    const reload = () => {
      if (!selectedRole.value) {
        return
      }
      load(undefined, {
        input: {
          date: selectedDate.value,
          role: selectedRole.value,
        }
      }, { fetchPolicy: 'network-only' })
    }

    watch(selectedDate, () => reload(), { immediate: true })
    watch(selectedRole, () => reload(), { immediate: true })

    return {
      allSelected,
      cancelSelections,
      hasAnySelected,
      hostings,
      maybeSendMessage,
      maybeAddEndorsement,
      onItemsSelected,
      selectable,
      selectedHostings,
      selectedStatus,
      selectedRole,
      sendMessageToGuestsModalVisible,
      sortByStatus,
      sorted,
      toggleSort,
      toggleAll,
      loading
    }
  }
})
</script>

<style lang="scss" scoped>
.hosting-grid-wrapper {
  display: flex;
  flex-direction: column;
}

:deep(.nav-link) {
  color: $colorText;
  padding: .5em;
  margin-left: .5em;

  &:hover:not(.active) {
    background-color: #EFEFEF;
    border-radius: 5px;
  }
}
:deep(.nav-link).active {
  font-weight: bold;
}

.b-checkbox {
  cursor: pointer;
}

.rtl-at-root {
  margin-left: 0;
  margin-right: .5em;
}
</style>
