<template>
  <div
    ref="stickyHeader"
    class="sticky-subheader pt-sm-3"
    :style="{ top: `${mainHeaderHeight}px` }"
  >
    <div class="sticky-subheader__title-container py-2 px-5">
      <div class="sticky-subheader__title">
        <h5 class="statistics pull-if-rtl-label d-none d-sm-block">
          {{ searchTitle }}
        </h5>
      </div>
      <div class="w-auto mt-3 mt-md-0">
        <div class="sticky-subheader__actions mx-0">
          <div class="me-2">
            <span class="me-2">{{ $t('sticky-subheader.view-as') }}</span>
            <button
              class="btn toggle-btn me-1"
              :class="{ active: !paginatedSearchResult }"
              @click="setPaginatedSearchResult(false)"
            >
              <fa-icon
                :icon="['fal', 'grid']"
                class="ml-1"
              />
            </button>
            <button
              class="btn toggle-btn me-1"
              :class="{ active: paginatedSearchResult}"
              @click="setPaginatedSearchResult(true)"
            >
              <fa-icon
                :icon="['fal', 'bars']"
                class="ml-1"
              />
            </button>
          </div>
          <BButton
            variant="primary"
            class="filter-button"
            @click="onClickFilters"
          >
            {{ $t('sticky-subheader.narrow-your-search') }}
            <FaIcon
              :icon="['fal', 'sliders-h']"
              class="ms-1"
            />
          </BButton>
        </div>
      </div>
    </div>
    <div
      v-if="selectedParams.length > 0"
      class="px-5 selected-params"
    >
      <ul>
        <li
          v-for="(selectedParam, idx) of selectedParams"
          :key="`${idx}-${selectedParam.title}`"
          class="badge d-inline-flex align-items-center"
        >
          <span class="flex-grow-1 text-truncate">{{ selectedParam.title }}</span>
          <button
            type="button"
            class="param-remove"
            @click="removeSelectedParam(selectedParam)"
          >
            ×
          </button>
        </li>
      </ul>
    </div>
    <div
      class="px-5 py-2 search-toolbar d-flex align-items-center"
    >
      <BFormCheckbox
        :model-value="allSelected"
        :indeterminate="partiallySelected"
        name="toggleAll"
        button-variant="secondary"
        @change="toggleAll"
      >
        {{ allSelected ? $t('sticky-subheader.unselect-all') : $t('sticky-subheader.select-all') }}
      </BFormCheckbox>
      <BButton
        v-if="hasAnySelected"
        class="ms-2 me-2"
        variant="primary"
        size="sm"
        @click="showBulkInvite"
      >
        {{ $t('sticky-subheader.invite-selected') }}
      </BButton>
      <BButton
        v-if="shouldShowMessageButton"
        class="me-2"
        variant="primary"
        size="sm"
        @click="showBroadcastMessage"
      >
        {{ $t('sticky-subheader.message-selected') }}
      </BButton>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted } from 'vue'
import { useStore } from 'vuex'

import { useFeatureEnabled } from '@/composables'
import type { ISimpleProfile } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { useGlobalStore } from '@/stores/global'
import { type BulkInviteProps, type CreateBroadcastConversationModalProps, Modal, useModalStore } from '@/stores/modal'
import type { Profile, SearchSelectedParam } from '@/types'

export default defineComponent({
  name: 'SearchStickyHeader',
  props: {
    searchTitle: {
      required: true,
      type: String,
      default: ''
    },
    selectedParams: {
      required: true,
      type: Array as () => SearchSelectedParam[],
      default: () => []
    },
    profiles: {
      required: true,
      type: Array as () => Profile[],
      default: () => []
    },
  },
  emits: ['toggle-filters', 'remove-selected-param'],
  setup(props, context) {
    const store = useStore(storeKey)
    const { isFeatureEnabled } = useFeatureEnabled()
    const globalStore = useGlobalStore()
    const { showModal } = useModalStore()
    
    const isAdmin = computed<boolean>(() => store.state.auth.isAdmin)
    const activeProfileId = computed(() => store.state.auth.profileId)
    const paginatedSearchResult = computed<boolean>(() => store.getters['profileSettings/paginatedSearchResult'])
    const mainHeaderHeight = computed<number>(() => globalStore.mainHeaderHeight)
    const profilesSelection = computed<{[key:string]: boolean}>(() => store.state.search.profilesSelection)
    const hasAnySelected = computed(() => Object.values(profilesSelection.value).some(item => item))
    const allSelected = computed(() => (
      hasAnySelected.value && 
      Object.values(profilesSelection.value).filter(item => item).length === props.profiles.length
    ))
    const partiallySelected = computed(() => (
      hasAnySelected.value && 
      Object.values(profilesSelection.value).filter(item => item).length !== props.profiles.length
    ))
    const shouldShowMessageButton = computed(() =>
      hasAnySelected.value && isFeatureEnabled('broadcastMessaingEnabled')
    )

    const onClickFilters = (evt: Event) => context.emit('toggle-filters', evt)
    const removeSelectedParam = (param: SearchSelectedParam) => context.emit('remove-selected-param', param)

    const toggleAll = () => {
      const profileSelectionPayload: {[key:string]: boolean} = {}
      props.profiles.forEach(profile => {
        profileSelectionPayload[profile.id] = !allSelected.value
      })
      store.commit('search/SET_PROFILE_SELECTION', profileSelectionPayload)
    }
    
    const showBulkInvite = () => {
      const recipients = props.profiles.filter(profile => profilesSelection.value[profile.id])
      const bulkInviteProps: BulkInviteProps = {
        recipients
      }
      showModal({
        modal: Modal.BULK_INVITE,
        props: bulkInviteProps
      })
    }

    const showBroadcastMessage = () => {
      const participants = props.profiles.filter(profile => profilesSelection.value[profile.id])
      const broadcastProps: CreateBroadcastConversationModalProps = {
        participants: participants as any as ISimpleProfile[]
      }
      showModal({
        modal: Modal.CREATE_BROADCAST_CONVERSATION,
        props: broadcastProps
      })
    }
    
    const setPaginatedSearchResult = (value: boolean) => {
      store.dispatch('profileSettings/updateProfileSettings', {
        profileId: activeProfileId.value,
        setting: 'paginatedSearchResult',
        value
      })
    }

    onMounted(() => {
      store.commit('search/CLEAR_PROFILE_SELECTION')
    })

    return {
      isAdmin,
      paginatedSearchResult,
      mainHeaderHeight,
      hasAnySelected,
      allSelected,
      partiallySelected,
      shouldShowMessageButton,
      onClickFilters,
      removeSelectedParam,
      toggleAll,
      showBulkInvite,
      showBroadcastMessage,
      setPaginatedSearchResult
    }
  }
})
</script>

<style scoped lang="scss">
.sticky-subheader {
  position: sticky;
  z-index: 10;
  background-color: #f8fafd;
}

.sticky-subheader__title-container {
  display: flex;
  align-items: center;
}

.sticky-subheader__actions {
  display: flex;
  align-items: center;
}

.sticky-subheader__title {
  flex: 1;
}

.toggle-btn {
  padding: 4px;
  width: 32px;
  height: 32px;

  &.active {
    color: $colorRed;
    border-color: transparent;
  }
}

.filter-button {
  display: flex;
  align-items: center;

  @media (max-width: $mobileMaxWidth) {
    padding: 5px 10px;
    margin-bottom: 8px;
  }
}

.rtl-at-root {
  .filter-button {
    &:first-child {
      margin-left: 8px;
    }
    &:last-child {
      margin-left: 0px;
    }
  }
}

ul {
  padding-left: 0;
  margin-bottom: 0;
}

.badge {
  border-radius: 25px;
  padding: 6px 12px;
  background: white;
  color: $colorRed;
  border: 1px solid $colorRed;
  margin-right: 8px;
  margin-bottom: 8px;
}

.param-remove {
  font-size: 125%;
  margin-left: 0.25rem;
  padding: 0;
  border: 0;
  color: inherit;
  background-color: rgba(255, 0, 0, 15%);
  border-radius: 30px;
  width: 15px;
  height: 15px;
  transition: 0.3s background-color;

  &:hover {
    background-color: rgba(255, 0, 0, 30%);
  }
}
</style>
