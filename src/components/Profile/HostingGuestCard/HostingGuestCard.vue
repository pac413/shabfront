<template>
  <ProfileCard
    :icon="['fal', 'users']"
    :title="$t('profile-view.host.guest-list', { date: dateText })"
  >
    <template #menu>
      <div class="menu-buttons">
        <BButton
          v-if="guestsCsvDownloadLink"
          size="sm"
          variant="secondary"
          :href="guestsCsvDownloadLink"
        >
          <FaIcon :icon="['fal', 'download']" />
        </BButton>
        <ShabbatYomTovDatePicker
          :model-value="selectedDate"
          right
          @change="changeDate"
        />
      </div>
    </template>
    <Spinner v-if="total === 0 && loading" />
    <div
      v-else-if="total === 0"
      class="p-3 text-center text-secondary"
    >
      {{ $t('profile-view.host.no-guests') }}
    </div>
    <div
      v-else
      class="all-guests-grid pb-4 ms-1"
    >
      <BFormSelect
        v-model="sortByStatus"
        :options="sortOptions"
        class="sort-options"
      />

      <HostingGridRow
        v-for="([category, data]) in hostings"
        :key="category"
        :category="category"
        :items="data.hostings"
        :total="data.total"
        item-class="no-hover"
        hide-overlay
        sort-by-status
      />

      <InfiniteLoading @infinite="infiniteHandler">
        <template #spinner>
          <Spinner
            type="grow"
            variant="danger"
          />
        </template>
        <template #complete>
          <span></span>
        </template>
      </InfiniteLoading>
    </div>
  </ProfileCard>
</template>

<script lang="ts">
import 'v3-infinite-loading/lib/style.css'

import qs from 'qs'
import InfiniteLoading from 'v3-infinite-loading'
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import ShabbatYomTovDatePicker from '@/components/Common/Date/ShabbatYomTovDatePicker.vue'
import HostingGridRow from '@/components/Planner/HostingGrid/HostingGridRow.vue'
import ProfileCard from '@/components/Profile/ProfileCard.vue'
import { IHostingRole } from '@/composables/graphql/generated'
import { useLocalizedDateDisplayText } from '@/composables/useLocalizedDateDisplayText'
import { storeKey } from '@/store'
import { getToken,upcomingShabbatOrYomTov } from '@/utils'

import { type LoadSortedHostingsParams, useLoadSortedHostings } from './useLoadSortedHostings'

export default defineComponent({
  name: 'HostingGuestCard',
  components: {
    InfiniteLoading,
    HostingGridRow,
    ShabbatYomTovDatePicker,
    ProfileCard
  },
  props: {
    hostId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const { localizeDateDisplayText } = useLocalizedDateDisplayText()
    const activeProfile = computed(() => store.state.profile.activeProfile)
    const currentProfile = computed(() => store.state.profile.currentProfile)
    const isAdmin = computed(() => store.state.auth.isAdmin)
    const selectedDate = ref<string>(upcomingShabbatOrYomTov())
    const sortByStatus = ref<boolean>(true)
    const infiniteStageChanger = ref<any>(null)
    const dateText = computed(() => localizeDateDisplayText(selectedDate.value))
    const params = computed<LoadSortedHostingsParams>(() => ({
      hostId: props.hostId,
      selectedDate: selectedDate.value,
      role: IHostingRole.Host,
      limit: 24,
      sortBy: sortByStatus.value ? 'status' : 'meal',
    }))
    const { 
      hasAllLoaded,
      loading,
      loadMore,
      reset,
      sortedHostings,
      total,
    } = useLoadSortedHostings(params)
    const hostings = computed(() => Object.entries(sortedHostings.value))

    const sortOptions = computed(() => {
      return [
        { text: t('planner.sort-status'), value: true },
        { text: t('planner.sort-meal'), value: false }]
    })

    const guestsCsvDownloadLink = computed((): string | null => {
      if (!isAdmin.value) {
        return null
      }

      const accessToken = getToken()
      if (!accessToken) {
        return null
      }

      const query: { [key: string]: string } = { accessToken }
      if (currentProfile.value) {
        query.profileId = currentProfile.value.id
      }
      return `${import.meta.env.VITE_APP_REST_API}/hostings/${selectedDate.value}/guest-list/download?${qs.stringify(query)}`
    })

    const changeDate = (newDate: string) => {
      selectedDate.value = newDate
    }

    const updateScroller = () => {
      if (!infiniteStageChanger.value) {
        return
      }
      if (hasAllLoaded.value) {
        infiniteStageChanger.value.complete()
      } else {
        infiniteStageChanger.value.loaded()
      }
    }

    const infiniteHandler = ($state: any) => {
      infiniteStageChanger.value = $state
      loadMore()
    }

    onMounted(() => {
      reset()
      loadMore()
    })

    watch(infiniteStageChanger, () => updateScroller())
    watch(sortedHostings, () => updateScroller())

    return {
      activeProfile,
      changeDate,
      currentProfile,
      dateText,
      guestsCsvDownloadLink,
      hostings,
      infiniteHandler,
      isAdmin,
      loading,
      selectedDate,
      sortByStatus,
      sortOptions,
      total,
    }
  }
})
</script>

<style lang="scss" scoped>
.all-guests-grid {
  display: flex;
  flex-direction: column;

  .sort-options {
    font-size: .9rem;
    width: fit-content;
    align-self: flex-end
  }
}

:deep(.meals-text) {
  cursor: default;
  text-decoration: none;
}

.menu-buttons {
  display: flex;
  align-items: center;
}

.menu-buttons :deep(.date-picker-wrapper) .btn {
  padding: 0 .5rem;
}

.menu-buttons .btn {
  margin: 0 10px;
}
</style>
