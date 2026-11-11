<template>
  <div
    v-if="!hasGeoLocation"
    class="text-secondary fw-bold p-2"
  >
    {{ $t('planner.zmanim-add-location') }}
    <BLink :to="{ name: 'edit.contact-info'}">
      {{ $t('planner.edit-profile-link-text') }}
    </BLink>
  </div>
  <div
    v-else-if="rawZmanim"
    class="zmanim-wrapper p-2"
  >
    <div
      v-for="(item, key) in zmanim"
      :key="key"
      class="zmanim-item py-2"
    >
      <div class="key">
        {{ $t(`zmanim.${key}`) }}:
        <FaIcon
          v-if="tooltips.includes(key)"
          v-b-tooltip.bottom="$t(`zmanim.tooltip-${key}`, { value: tooltipValue(key) })"
          :icon="['fas', 'info-circle']"
        />
      </div>
      <div class="data">
        {{ item }}
      </div>
    </div>
  </div>
  <Spinner
    v-else
    class="p-3"
  />
</template>

<script lang="ts">
import { pick } from 'lodash'
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'

import { useAxios } from '@/composables'
import { storeKey } from '@/store'
import type { Location } from '@/types'
import { Country, ZmanimKeys } from '@/utils'
import { upcomingShabbatOrYomTov } from '@/utils/date'

export default defineComponent({
  name: 'Zmanim',
  props: {
    date: {
      type: String,
      default: () => upcomingShabbatOrYomTov(),
    },
    tooltips: {
      type: Array as () => ZmanimKeys[],
      default: () => [],
    },
  },
  setup(props) {
    const http = useAxios()
    const store = useStore(storeKey)
    const location = computed<Location | null>(() => store.getters['profile/location'] || null)
    const rawZmanim = ref<{[zman: string]: string} | null>(null)
    const hasGeoLocation = computed<boolean>(() => !!location.value?.geoLocation)
    const zmanim = computed(() => pick(rawZmanim.value, Object.keys(ZmanimKeys)))

    const getZmanim = () => {
      if (!props.date || !location.value || !location.value.geoLocation || !import.meta.env.VITE_APP_ZMANIM_API) {
        return
      }

      http
        .post(import.meta.env.VITE_APP_ZMANIM_API, {
          date: props.date,
          lat: location.value.geoLocation.coordinates[1],
          lon: location.value.geoLocation.coordinates[0],
          isLocationIsrael: location.value.country === Country.ISRAEL
        })
        .then((response) => {
          rawZmanim.value = response.data
        })
    }

    const tooltipValue = (key: string) => {
      if (key === ZmanimKeys.candlelighting) {
        return rawZmanim.value?.candlelightingSunsetOffset
      }
    }

    watch(() => props.date, () => getZmanim(), { immediate: true })
    watch(() => location.value, () => getZmanim(), { immediate: true })

    return {
      getZmanim,
      hasGeoLocation,
      location,
      rawZmanim,
      tooltipValue,
      zmanim,
    }
  }
})
</script>
<style lang="scss" scoped>
.zmanim-wrapper {
  max-width: 250px;
}

.zmanim-item {
  display: flex;
  justify-content: space-between;
  .data {
    font-weight: bold;
  }
}

.key svg.fa-info-circle {
  color: $colorGrey;
}
</style>
