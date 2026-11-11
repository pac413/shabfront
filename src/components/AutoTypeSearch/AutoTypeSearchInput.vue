<template>
  <div class="form-group auto-type-search-input pull-if-rtl-label">
    <FaIcon
      class="auto-type-search-input__search-icon"
      :icon="['fal', 'search']"
    />
    <VueGoogleAutocomplete
      v-if="showLocationSearch"
      id="autoTypeSearch"
      ref="locationRef"
      class="form-control"
      :class="{ 'form-control--opened': opened }"
      :placeholder="placeholderText"
      types="geocode"
      @focus="$emit('open-popup')"
      @input-change="onPlaceInputChange"
      @placechanged="onPlaceChange"
    />
    <input
      v-else
      ref="inputRef"
      v-model="keyword"
      class="form-control"
      :class="{ 'form-control--opened': opened }"
      type="text"
      :placeholder="placeholderText"
      @mousedown="$emit('open-popup')"
    >
    <FaIcon
      v-if="keyword || placeInput"
      class="auto-type-search-input__close-icon"
      :icon="['fa', 'times']"
      @click="onReset"
    />
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, type Ref, ref, watch } from 'vue'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { SearchBy } from '@/types'
import { DEFAULT_LOCATION_PROXIMITY } from '@/utils'

export default defineComponent({
  name: 'AutoTypeSearchInput',
  components: {
    VueGoogleAutocomplete
  },
  props: {
    modelValue: {
      type: String,
      required: true,
    },
    opened: {
      type: Boolean,
      required: true,
      default: false
    },
    searchBy: {
      type: String as () => SearchBy,
      required: true
    },
    placeholder: {
      type: String,
      required: false,
      default: null,
    }
  },
  emits: ['open-popup', 'update:modelValue', 'close-popup'],
  setup(props, { emit }) {
    const router = useRouter()
    const { t } = useI18n()

    const inputRef: Ref<HTMLInputElement | null> = ref(null)
    const locationRef: Ref<InstanceType<typeof VueGoogleAutocomplete> | null> = ref(null)
    const placeInput: Ref<string> = ref('')
    const keyword = computed({
      get: () => props.modelValue,
      set: (val: string) => {
        emit('update:modelValue', val)
        if (val) {
          placeInput.value = ''
          if (locationRef.value) {
            locationRef.value.clear()
          }
        }
      }
    })
    const placeholderText = computed(() => props.placeholder || t('outer-search.find-guests-and-hosts'))
    
    watch(() => props.searchBy, () => {
      nextTick(() => {
        setFocus()
      })
    })

    const showLocationSearch = computed(() => props.searchBy === SearchBy.LOCATIONS)
    const setFocus = () => {
      if (showLocationSearch.value) {
        locationRef.value?.focus()
      } else {
        inputRef.value?.focus()
      }
    }

    const onPlaceChange = (addressData: any, placeResultData: any) => {
      onReset()
      const formattedAddress = placeResultData.formatted_address
      const routeOrArea = addressData.route || addressData.administrative_area_level_1 || ''
      const localityOrCountry = addressData.locality || addressData.country || ''
      const backupLocationString = `${routeOrArea ? routeOrArea + ', ' : ''}${localityOrCountry}`

      router.push({
        name: 'Search',
        query: {
          type: 'all',
          coordinates: `${addressData.latitude},${addressData.longitude}`,
          location: formattedAddress || backupLocationString,
          locationPlace: 'true',
          proxRadius: `${DEFAULT_LOCATION_PROXIMITY}`,
        }
      })
      emit('close-popup')
    }

    const onPlaceInputChange = (input: string) => {
      placeInput.value = input
    }

    const onReset = () => {
      keyword.value = ''
      placeInput.value = ''
      nextTick(() => {
        locationRef.value?.clear()
      })
      emit('close-popup')
    }

    return {
      inputRef,
      locationRef,
      placeInput,
      placeholderText,
      keyword,
      showLocationSearch,
      setFocus,
      onPlaceChange,
      onPlaceInputChange,
      onReset
    }
  }
})
</script>

<style scoped lang="scss">
.auto-type-search-input {
  position: relative;
  margin-bottom: 0;
}

.form-control {
  padding-left: 2.375rem;
  padding-right: 2rem;
  border: 1px solid #8e8e8e;
  border-radius: 25px;
  transition: all 200ms linear 0s;

  &:focus {
    box-shadow: 0 0 0 0 transparent;
  }
}

.form-control--opened {
  border-radius: 12px 12px 0 0;
  border-bottom: 0;
  border-color: rgb(235, 235, 235);
}

.auto-type-search-input__search-icon {
  position: absolute;
  text-align: center;
  pointer-events: none;
  color: #8e8e8e;
  top: 50%;
  bottom: 50%;
  left: 13px;
  margin: auto;
  pointer-events: auto;
  cursor: pointer;
}

.auto-type-search-input__close-icon {
  position: absolute;
  text-align: center;
  pointer-events: none;
  color: #8e8e8e;
  top: 50%;
  right: 13px;
  bottom: 50%;
  left: auto;
  margin: auto;
  pointer-events: auto;
  cursor: pointer;
}

.rtl-at-root {
  .form-control {
    padding-left: 2rem;
    padding-right: 2.375rem;
  }

  .auto-type-search-input__search-icon {
    left: auto;
    right: 13px;
  }
  .auto-type-search-input__close-icon {
    right: auto;
    left: 13px;
  }

  .pull-if-rtl-label {
    float: none !important;
  }
}
</style>

<style lang="scss">
.pac-container {
  z-index: 100000;
}
</style>
