<template>
  <div
    v-if="rawZmanim"
    class="candlelighting"
  >
    <div class="icon pe-3">
      <CandlelightingIcon />
    </div>
    <div
      v-if="hasGeoLocation"
      class="candlelighting-text"
    >
      <span class="desc-italic">
        <i>{{ $t(`zmanim.shabbat-start-time`) }}:</i>
      </span>
      <span
        v-b-tooltip.bottom="$t(`zmanim.before-sunset`, { min: rawZmanim.candlelightingSunsetOffset })"
        class="candlelighting-time"
      >
        {{ zmanim.candlelighting }}
      </span>
      <span class="timezone-text">
        {{ locationText }}
      </span>
    </div>
    <div
      v-else
      class="text-secondary fw-bold p-2"
    >
      {{ $t('planner.zmanim-add-location') }}
      <BLink :to="{ name: 'edit.contact-info'}">
        {{ $t('planner.edit-profile-link-text') }}
      </BLink>
    </div>
  </div>
  <Spinner
    v-else
    class="p-3"
  />
</template>

<script lang="ts">
import _ from 'lodash'
import { computed, defineComponent, ref, watch } from 'vue'
import { useStore } from 'vuex'

import { useAxios } from '@/composables'
import { storeKey } from '@/store'
import type { Location } from '@/types'
import { Country, ZmanimKeys } from '@/utils'

import CandlelightingIcon from './candlelighting-icon.svg?component'

export default defineComponent({
  name: 'Candlelighting',
  components: {
    CandlelightingIcon,
  },
  props: {
    tooltips: {
      type: Array as () => ZmanimKeys[],
      default: () => [],
    },
  },
  setup() {
    const store = useStore(storeKey)
    const axios = useAxios()
    const date = computed<string>(() => store.getters['planner/selectedDate'])
    const location = computed<Location | undefined>(() =>
      store.getters['profile/location']
    )
    const locationText = computed<string | undefined>(() =>
      store.getters['profile/locationText']
    )
    const rawZmanim = ref<{ [zman: string]: string } | null>(null)
    const hasGeoLocation = computed(() => {
      if (location.value?.geoLocation?.coordinates &&
        (location.value.geoLocation.coordinates[0] !== 0 || location.value.geoLocation.coordinates[1] !== 0)) {
        return true
      }
      return false
    })
    const zmanim = computed(() => _.pick(rawZmanim.value, Object.keys(ZmanimKeys)))

    const getZmanim = async () => {
      if (!date.value || !location.value?.geoLocation || !import.meta.env.VITE_APP_ZMANIM_API) {return}
      const response = await axios.post(import.meta.env.VITE_APP_ZMANIM_API, {
        date: date.value,
        lat: location.value.geoLocation.coordinates[1],
        lon: location.value.geoLocation.coordinates[0],
        isLocationIsrael: location.value.country === Country.ISRAEL
      })
      rawZmanim.value = response.data
    }

    watch(date, () => getZmanim(), { immediate: true })
    watch(location, () => getZmanim(), { immediate: true })

    return {
      date,
      hasGeoLocation,
      location,
      locationText,
      rawZmanim,
      zmanim,
    }
  }
})
</script>
<style lang="scss" scoped>
.candlelighting {
  display: flex;
  align-items: center;

  .candlelighting-text {
    display: flex;
    flex-direction: column;

    .candlelighting-time {
      font-weight: bold;
      font-size: 36px;
      line-height: 42px;
      text-transform: lowercase;

    }
    .timezone-text {
      font-size: 12px;
      text-transform: uppercase;
      color: $colorSecondary;
    }
  }
}
</style>
