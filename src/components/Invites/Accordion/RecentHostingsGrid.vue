<template>
  <div class="hostings-grid-wrapper">
    <div
      v-if="!profiles.length && !loading"
      class="text-secondary text-center"
    >
      {{ $t('invites.modal.no-recent-hostings') }}
    </div>
    <div
      v-else
      class="hostings-grid"
    >
      <ProspectCard
        v-for="item in profiles"
        :key="item.id"
        :source="item"
      />
    </div>
    <Spinner v-if="loading" />
    <div
      v-if="profiles.length === defaultLimit && !loadedMax"
      class="view-all-link"
    >
      <BLink @click.prevent="viewAll">
        {{ $t('profile-view.host.view-all') }}
      </BLink>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'

import ProspectCard from '@/components/Common/ProspectCard.vue'
import {
  IHostingRole,
  type IRecentGuestsQuery,
  type IRecentHostsQuery,
  useRecentGuestsLazyQuery,
  useRecentHostsLazyQuery} from '@/composables/graphql/generated'
import type { Profile } from '@/types'

export default defineComponent({
  name: 'RecentHostingsGrid',
  components: {
    ProspectCard
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String as () => IHostingRole,
      required: true,
    },
    defaultLimit: {
      type: Number,
      default: undefined,
    },
    max: {
      type: Number,
      default: undefined
    }
  },
  setup(props) {
    const profiles = ref<Profile[]>([])
    const loadedMax = ref<boolean>(false)

    const useLazyQuery = (props.type === IHostingRole.Host) ? useRecentGuestsLazyQuery : useRecentHostsLazyQuery
    const { loading, load, onResult } = useLazyQuery({
      id: props.id,
      limit: 9
    })
    onResult((result) => {
      if (result.loading) {
        return
      }
      const newProfiles = (props.type === IHostingRole.Host) ? 
        (result.data as IRecentGuestsQuery).recentGuests?.profiles : 
        (result.data as IRecentHostsQuery).recentHosts?.profiles
      profiles.value = (newProfiles || []).concat() as any[]
    })

    const loadHostings = (limit?: number) => {
      load(undefined, {
        id: props.id,
        limit
      })
    }

    const viewAll = () => {
      loadedMax.value = true
      load(undefined, {
        id: props.id,
        limit: props.max
      })
    }

    onMounted(() => {
      load(undefined, {
        id: props.id,
        limit: props.defaultLimit
      })
    })

    return {
      loadedMax,
      loadHostings,
      loading,
      profiles,
      viewAll,
    }
  }
})
</script>

<style lang="scss" scoped>
.hostings-grid {
  display: flex;
  flex-wrap: wrap;

  .prospect-card {
    width: calc(33% - 1rem);
    margin: .5rem;
  }
}

.view-all-link a {
  color: $colorSecondary;
}

</style>
