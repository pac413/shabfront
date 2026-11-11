<template>
  <div
    class="filters-wrapper"
    :class="{'hidden': !visible}"
  >
    <aside
      class="filters-container"
      :class="{
        'left': type === MatchmakingType.Guys,
        'left-hidden': !visible && type === MatchmakingType.Guys,
        'right-hidden': !visible && type === MatchmakingType.Girls,
      }"
      @click="onClickBack"
    >
      <div class="content">
        <FaIcon
          :icon="['fas', 'times']"
          class="close-icon"
          @click="onClose"
        />
        <h4 class="filters-title pull-if-rtl-label">
          {{ $t(type === MatchmakingType.Guys ? 'filter.guys-title' : 'filter.girls-title') }}
        </h4>
        <span class="scroll-to-view-all pull-if-rtl-label">
          {{ $t('filter.scroll-to-view') }}
        </span>

        <hr>

        <div class="d-flex flex-column pull-if-rtl">
          <h4 class="filters-subtitle pull-if-rtl-label">
            {{ $t('filter.ages') }}
          </h4>
          <div class="container p-0">
            <div class="row">
              <div class="col-md-5">
                <BFormCheckbox
                  v-model="filterOptions.ageAll"
                  class="check-button pull-if-rtl-label"
                  @change="onChangeFilter('ageAll')"
                >
                  {{ $t('filter.all-ages') }}
                </BFormCheckbox>
                <BFormCheckbox
                  v-model="filterOptions.ageRange"
                  class="check-button pull-if-rtl-label"
                  @change="onChangeFilter('ageRange')"
                >
                  {{ $t('filter.age-range') }}
                </BFormCheckbox>
              </div>
              <div
                v-if="filterOptions.ageRange"
                class="col-md-7"
              >
                <label class="range-label pull-if-rtl-label">
                  {{ $t('filter.from') }}:
                  <b>{{ filterOptions.filterAgeFrom }}</b>
                </label>
                <BFormInput
                  v-model="filterOptions.filterAgeFrom"
                  type="range"
                  :min="MIN_AGE"
                  :max="MAX_AGE"
                  @update:model-value="debouncedOnChangeFilter('filterAgeFrom', $event)"
                />
                <label class="range-label pull-if-rtl-label">
                  {{ $t('filter.to') }}:
                  <b>{{ filterOptions.filterAgeTo }}</b>
                </label>
                <BFormInput
                  v-model="filterOptions.filterAgeTo"
                  type="range"
                  :min="MIN_AGE"
                  :max="MAX_AGE"
                  @update:model-value="debouncedOnChangeFilter('filterAgeTo', $event)"
                />
              </div>
            </div>
          </div>
        </div>

        <hr>

        <div class="d-flex flex-column pull-if-rtl">
          <h4 class="filters-subtitle pull-if-rtl-label">
            {{ $t('filter.options') }}
          </h4>
          <BFormCheckbox
            v-model="filterOptions.activeProfilesOnly"
            class="check-button pull-if-rtl-label"
            @change="onChangeFilter('activeProfilesOnly')"
          >
            {{ $t('filter.recently-active') }}
          </BFormCheckbox>
          <BFormCheckbox
            v-model="filterOptions.picturesOnly"
            class="check-button pull-if-rtl-label"
            @change="onChangeFilter('picturesOnly')"
          >
            {{ $t('filter.with-pictures-only') }}
          </BFormCheckbox>
        </div>
        <hr>

        <div class="d-flex flex-column pull-if-rtl">
          <h4
            class="filters-subtitle pull-if-rtl-label"
          >
            {{ $t('filter.religious-affiliation') }}
          </h4>
          <BFormCheckbox
            v-for="(option, index) in religiousOptionsMap"
            :key="index"
            v-model="filterOptions.religionFilterType"
            class="check-button pull-if-rtl-label"
            :value="option.value"
            unchecked-value=""
            @change="onChangeFilter('religionFilterType')"
          >
            {{ option.text }}
          </BFormCheckbox>
        </div>

        <hr>

        <div class="d-flex flex-column pull-if-rtl">
          <h4 class="filters-subtitle pull-if-rtl-label">
            {{ $t('filter.location') }}
          </h4>
          <BFormCheckbox
            v-model="filterOptions.locationAll"
            class="check-button pull-if-rtl-label"
            @change="onChangeFilter('locationAll')"
          >
            {{ $t('filter.all-locations') }}
          </BFormCheckbox>
          <BFormCheckbox
            v-model="filterOptions.locationMe"
            class="check-button pull-if-rtl-label"
            @change="onChangeFilter('locationMe')"
          >
            {{ $t('filter.proximity-to-me') }}
          </BFormCheckbox>
          <div
            v-if="filterOptions.locationMe"
            class="col"
          >
            <BFormInput
              v-model="filterOptions.proxRadius"
              type="range"
              min="1"
              max="50"
              @update:model-value="debouncedOnChangeFilter('proxRadius', $event)"
            />
            <label class="range-label">
              {{ $t('filter.within') }}
              <b>{{ filterOptions.proxRadius }}</b>
              {{ $t('filter.miles-radius') }}
            </label>
          </div>
          <BFormCheckbox
            v-model="filterOptions.locationPlace"
            class="check-button pull-if-rtl-label"
            @change="onChangeFilter('locationPlace')"
          >
            {{ $t('filter.proximity-to-place') }}
          </BFormCheckbox>
          <div
            v-if="filterOptions.locationPlace"
            class="col"
          >
            <GoogleAddressAutocomplete
              :api-key="GOOGLE_API_KEY"
              class="form-control form-control-sm my-1"
              @callback="onChangeLocation"
            />
            <BFormInput
              v-model="filterOptions.proxRadius"
              type="range"
              :min="MIN_PROXIMITY"
              :max="MAX_PROXIMITY"
              @update:model-value="debouncedOnChangeFilter('proxRadius', $event)"
            />
            <label class="range-label">
              {{ $t('filter.within') }}
              <b>{{ filterOptions.proxRadius }}</b>
              {{ $t('filter.miles-radius') }}
            </label>
          </div>
        </div>

        <hr>

        <BButton
          variant="secondary"
          class="clear-preferences-btn"
          @click="$emit('clear')"
        >
          {{ $t('filter.clear-preferences') }}
        </BButton>
      </div>
    </aside>
  </div>
</template>

<script lang="ts">
import { debounce } from 'lodash'
import { computed, defineComponent,ref } from 'vue'
import { useI18n } from 'vue-i18n'
import GoogleAddressAutocomplete from 'vue3-google-address-autocomplete'

import {
  InitialMatchmakingFilters,
  type MatchmakingFilterKey,
  type MatchmakingFilterOption,
  MatchmakingType,
  ReligiousAffiliation,
} from '@/types'
import { GOOGLE_API_KEY, MAX_AGE, MAX_PROXIMITY, MIN_AGE, MIN_PROXIMITY } from '@/utils'

export default defineComponent({
  name: 'MatchmakingFilters',
  components: {
    GoogleAddressAutocomplete
  },
  props: {
    visible: {
      required: true,
      type: Boolean
    },
    type: {
      required: true,
      type: String as () => MatchmakingType
    },
    modelValue: {
      required: true,
      type: Object as () => MatchmakingFilterOption
    }
  },
  emits: ['change', 'clear', 'close', 'update:modelValue'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const religiousOptionsMap = computed(() => {
      const religiousOptions: string[] = [
        'ALL',
        ReligiousAffiliation.Orthodox,
        'NON-ORTHODOX',
        ReligiousAffiliation.Conservative,
        ReligiousAffiliation.Conservadox,
        ReligiousAffiliation.Reform,
        ReligiousAffiliation.Renewal,
        ReligiousAffiliation.Reconstructionist,
        ReligiousAffiliation.Unaffiliated,
        ReligiousAffiliation.Conversion,
        ReligiousAffiliation.Gentile
      ]
      return religiousOptions.map(option => ({
        value: option,
        text: t(`filter.religious-options.${option.toLowerCase()}`)
      }))
    })

    const filterOptions = ref(props.modelValue)

    const onChangeFilter = (key: MatchmakingFilterKey, value?: string) => {
      if (filterOptions.value[key]) {
        switch (key) {
        case 'ageAll':
          filterOptions.value.ageRange = false
          delete filterOptions.value.filterAgeFrom
          delete filterOptions.value.filterAgeTo
          break

        case 'ageRange':
          filterOptions.value.ageAll = false
          filterOptions.value.filterAgeFrom = InitialMatchmakingFilters.filterAgeFrom
          filterOptions.value.filterAgeTo = InitialMatchmakingFilters.filterAgeTo
          break

        case 'locationAll':
          filterOptions.value.locationMe = false
          filterOptions.value.locationPlace = false
          break

        case 'locationMe':
          filterOptions.value.locationAll = false
          filterOptions.value.locationPlace = false
          delete filterOptions.value.proxRadius
          break

        case 'locationPlace':
          filterOptions.value.locationAll = false
          filterOptions.value.locationMe = false
          break

        case 'filterAgeFrom':
        case 'filterAgeTo':
        case 'proxRadius':
          filterOptions.value[key] = parseInt(value!, 10)
          break
        
        case 'religionFilterType':
          if (typeof filterOptions.value[key] === 'boolean') {
            delete filterOptions.value.religionFilterType
          }
          break

        default:
          break
        }
      }
      emit('change', { ...filterOptions.value })
    }

    const debouncedOnChangeFilter = debounce(
      (key: MatchmakingFilterKey, value: string) => onChangeFilter(key, value), 
      300
    )

    const onClose = (event: Event) => {
      emit('close')
      event.stopPropagation()
    }

    const onClickBack = (event: Event) => {
      event.stopPropagation()
    }

    const onChangeLocation = (addressData: any) => {
      const latitude = addressData.geometry.location.lat()
      const longitude = addressData.geometry.location.lng()

      filterOptions.value.cityRetrieved = addressData.formatted_address
      filterOptions.value.cityCoordinate = {
        latitude,
        longitude
      }

      emit('change', { ...filterOptions.value })
    }
    
    return {
      MIN_AGE,
      MAX_AGE,
      MIN_PROXIMITY,
      MAX_PROXIMITY,
      GOOGLE_API_KEY,
      MatchmakingType,
      filterOptions,
      religiousOptionsMap,
      onChangeFilter,
      debouncedOnChangeFilter,
      onClose,
      onClickBack,
      onChangeLocation
    }
  }
})
</script>

<style scoped lang="scss">
.filters-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 1;
  z-index: 1030;
  transition: opacity 0.5s;

  &.hidden {
    opacity: 0;
    z-index: -1;
  }
}

.filters-container {
  width: 380px;
  text-align: left;
  position: fixed;
  left: unset;
  right: 0px;
  top: 0;
  z-index: 102;
  height: 100%;
  background-color: #fff;
  box-shadow: -13px 0 20px rgba(119, 131, 143, 0.08);
  transition: all 0.5s;
  opacity: 1;

  &.left-hidden {
    left: -380px !important;
    right: unset !important;
    opacity: 0;
  }

  &.right-hidden {
    left: unset !important;
    right: -380px !important;
    opacity: 0;
  }

  &.left {
    right: unset;
    left: 0px;
  }

  @media (max-width: $mobileMaxWidth) {
    width: 100%;
    margin-top: 0;
  }
}

.content {
  padding: 25px;
  color: #77838f;
  position: relative;
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;

  hr {
    width: 100%;
  }

  @media (max-width: $mobileMaxWidth) {
    height: 100%;
  }

  .filters-title {
    font-weight: 600;
    font-size: 1.5rem;
    color: $colorStickyText;
    line-height: 1.5;
    margin: 0;
  }

  .scroll-to-view-all {
    font-size: 12.8px;
    font-weight: 400;
    color: $colorStickyText;
  }

  .filters-subtitle {
    font-size: 0.875rem;
    color: $colorStickyText;
    font-weight: 600;
    text-transform: uppercase;
    line-height: 1.5;
    margin-bottom: 1rem;

    &.small {
      font-size: 12px;
    }
  }

  .check-button {
    font-size: 14px;
    margin-bottom: 0.5rem;
  }

  .range-label {
    font-size: 11px;
    margin-bottom: 0.5rem;
  }

  .filters-select {
    width: 200px;
    color: $colorGrey;
    background: #e9e9e9;
    border-color: transparent;
    font-size: 12px;
    line-height: 1.5;

    &:hover,
    &:focus,
    &:active {
      color: #fff;
      background: $colorGrey;
      box-shadow: 0 4px 17px rgba(55, 125, 255, 0.35);
      outline: none;
    }
  }

  .close-icon {
    position: absolute;
    top: 20px;
    right: 20px;
    cursor: pointer;
  }

  .clear-preferences-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    @media (max-width: $mobileMaxWidth) {
      padding: 5px 10px;
    }
  }
}

.rtl-at-root {
  .filters-container {
    right: unset;
    left: 0;

    &.left-hidden {
      left: unset !important;
      right: -380px !important;
    }

    &.right-hidden {
      left: -380px !important;
      right: unset !important;
    }

    &.left {
      right: 0;
      left: unset;
    }
  }

  .content {
    .close-icon {
      right: unset;
      left: 20px;
    }
  }
}
</style>
