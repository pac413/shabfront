<template>
  <div
    class="filters-background"
    :class="{'hidden': !visible}"
  >
    <aside
      class="filters-container"
      :class="{'hidden': !visible}"
      @click="onClickInside"
    >
      <div class="content">
        <FaIcon
          :icon="['fas', 'times']"
          class="close-icon"
          @click="$emit('close')"
        />
        <h4 class="filters-title pull-if-rtl-label">
          {{ $t('filter.title') }}
        </h4>
        <span class="scroll-to-view-all pull-if-rtl-label">
          {{ $t('filter.scroll-to-view') }}
        </span>

        <hr>

        <div
          v-if="type === SearchTypes.DATING"
          class="d-flex flex-column pull-if-rtl"
        >
          <h4 class="filters-subtitle pull-if-rtl-label">
            {{ $t('filter.location') }}
          </h4>
          <BFormCheckbox
            class="check-button pull-if-rtl-label"
            :model-value="searchOptions.locationAll"
            @update:model-value="onChangeFilter({ locationAll: $event })"
          >
            {{ $t('filter.all-locations') }}
          </BFormCheckbox>
          <BFormCheckbox
            class="check-button pull-if-rtl-label"
            :model-value="searchOptions.locationMe"
            @update:model-value="onChangeFilter({ locationMe: $event })"
          >
            {{ $t('filter.proximity-to-me') }}
          </BFormCheckbox>
          <div
            v-if="searchOptions.locationMe"
            class="col"
          >
            <BFormInput
              type="range"
              :min="MIN_PROXIMITY"
              :max="MAX_PROXIMITY"
              :model-value="searchOptions.proxRadius"
              @update:model-value="debouncedOnChangeFilter({ proxRadius: parseFloat($event) })"
            />
            <label class="range-label">
              {{ $t('filter.within') }}
              <b>{{ searchOptions.proxRadius }}</b>
              {{ $t('filter.miles-radius') }}
            </label>
          </div>
          <BFormCheckbox
            :model-value="searchOptions.locationPlace"
            class="check-button pull-if-rtl-label"
            @update:model-value="onChangeFilter({ locationPlace: $event })"
          >
            {{ $t('filter.proximity-to-place') }}
          </BFormCheckbox>
          <div
            v-if="searchOptions.locationPlace"
            class="col"
          >
            <GoogleAddressAutocomplete
              :value="searchLocation"
              :api-key="GOOGLE_API_KEY"
              class="form-control form-control-sm"
              @callback="onChangeLocation"
            />
            <BFormInput
              :model-value="searchOptions.proxRadius"
              class="mt-2"
              type="range"
              :min="MIN_PROXIMITY"
              :max="MAX_PROXIMITY"
              @update:model-value="debouncedOnChangeFilter({ proxRadius: parseFloat($event) })"
            />
            <label class="range-label">
              {{ $t('filter.within') }}
              <b>{{ searchOptions.proxRadius }}</b>
              {{ $t('filter.miles-radius') }}
            </label>
          </div>
        </div>

        <div
          v-else
          class="d-flex flex-column pull-if-rtl"
        >
          <h4 class="filters-subtitle pull-if-rtl-label">
            {{ $t('filter.location') }}
          </h4>
          <BFormCheckbox
            :model-value="searchOptions.locationMe"
            class="check-button pull-if-rtl-label"
            @update:model-value="onChangeFilter({ locationMe: $event })"
          >
            {{ $t('filter.proximity-to-me') }}
          </BFormCheckbox>
          <div
            v-if="searchOptions.locationMe"
            class="col"
          >
            <BFormInput
              :model-value="searchOptions.proxRadius"
              type="range"
              :min="MIN_PROXIMITY"
              :max="MAX_PROXIMITY"
              @update:model-value="debouncedOnChangeFilter({ proxRadius: $event })"
            />
            <label class="range-label">
              {{ $t('filter.within') }}
              <b>{{ searchOptions.proxRadius }}</b>
              {{ $t('filter.miles-radius') }}
            </label>
          </div>
          <BFormCheckbox
            :model-value="searchOptions.locationPlace"
            class="check-button pull-if-rtl-label"
            @update:model-value="onChangeFilter({ locationPlace: $event })"
          >
            {{ $t('filter.proximity-to-place') }}
          </BFormCheckbox>
          <div
            v-if="searchOptions.locationPlace"
            class="col"
          >
            <GoogleAddressAutocomplete
              :value="searchLocation"
              :api-key="GOOGLE_API_KEY"
              class="form-control form-control-sm"
              @callback="onChangeLocation"
            />
            <BFormInput
              :model-value="searchOptions.proxRadius"
              class="mt-2"
              type="range"
              :min="MIN_PROXIMITY"
              :max="MAX_PROXIMITY"
              @update:model-value="debouncedOnChangeFilter({ proxRadius: parseFloat($event) })"
            />
            <label class="range-label">
              {{ $t('filter.within') }}
              <b>{{ searchOptions.proxRadius }}</b>
              {{ $t('filter.miles-radius') }}
            </label>
          </div>
        </div>

        <hr>

        <div
          v-if="type === SearchTypes.SEARCH"
          class="d-flex flex-column pull-if-rtl"
        >
          <h4 class="filters-subtitle pull-if-rtl-label">
            {{ $t('filter.people') }}
          </h4>
          <BFormGroup>
            <BFormRadio
              v-for="(option, index) in peopleOptions"
              :key="index"
              :model-value="searchOptions.peopleFilterType"
              class="check-button pull-if-rtl-label"
              :value="option.value"
              name="people"
              @update:model-value="onChangeFilter({ peopleFilterType: $event })"
            >
              {{ option.text }}
            </BFormRadio>
          </BFormGroup>
        </div>

        <hr v-if="type === SearchTypes.SEARCH">

        <div
          v-if="type === SearchTypes.SEARCH"
          class="d-flex flex-column pull-if-rtl"
        >
          <h4 class="filters-subtitle pull-if-rtl-label">
            {{ $t('filter.invite') }}
          </h4>
          <BFormCheckbox
            :model-value="searchOptions.availableToHost"
            class="check-button pull-if-rtl-label"
            @update:model-value="onChangeFilter({ availableToHost: $event })"
          >
            {{ $t('filter.available-to-host') }}
          </BFormCheckbox>
          <BFormCheckbox
            :model-value="searchOptions.availableForInvites"
            class="check-button pull-if-rtl-label"
            @update:model-value="onChangeFilter({ availableForInvites: $event })"
          >
            {{ $t('filter.available-for-invites') }}
          </BFormCheckbox>
        </div>

        <hr v-if="type === SearchTypes.SEARCH">

        <div class="d-flex flex-column pull-if-rtl">
          <h4 class="filters-subtitle pull-if-rtl-label">
            {{ $t('filter.options') }}
          </h4>
          <BFormCheckbox
            :model-value="searchOptions.activeProfilesOnly"
            class="check-button pull-if-rtl-label"
            @update:model-value="onChangeFilter({ activeProfilesOnly: $event })"
          >
            {{ $t('filter.recently-active') }}
          </BFormCheckbox>
          <BFormCheckbox
            :model-value="searchOptions.picturesOnly"
            class="check-button pull-if-rtl-label"
            @update:model-value="onChangeFilter({ picturesOnly: $event })"
          >
            {{ $t('filter.with-pictures-only') }}
          </BFormCheckbox>
          <!--          <BFormCheckbox-->
          <!--            :model-value="searchOptions.popular"-->
          <!--            class="check-button pull-if-rtl-label"-->
          <!--            @update:model-value="onChangeFilter({ popular: $event })"-->
          <!--          >-->
          <!--            {{ $t('filter.popular') }}-->
          <!--          </BFormCheckbox>-->
          <BFormCheckbox
            :model-value="searchOptions.recentMembership"
            class="check-button pull-if-rtl-label"
            @update:model-value="onChangeFilter({ recentMembership: $event })"
          >
            {{ $t('filter.recent-signups') }}
          </BFormCheckbox>
          <BFormCheckbox
            :model-value="searchOptions.menOnly"
            class="check-button pull-if-rtl-label"
            @update:model-value="onChangeFilter({ menOnly: $event })"
          >
            {{ $t('filter.men-only') }}
          </BFormCheckbox>
          <BFormCheckbox
            :model-value="searchOptions.womenOnly"
            class="check-button pull-if-rtl-label"
            @update:model-value="onChangeFilter({ womenOnly: $event })"
          >
            {{ $t('filter.women-only') }}
          </BFormCheckbox>
          <BFormCheckbox
            :model-value="searchOptions.hasEndorsements"
            class="check-button pull-if-rtl-label"
            @update:model-value="onChangeFilter({ hasEndorsements: $event })"
          >
            {{ $t('filter.with-endorsements') }}
          </BFormCheckbox>
        </div>

        <hr>

        <div class="d-flex flex-column pull-if-rtl">
          <h4 class="filters-subtitle pull-if-rtl-label">
            {{ $t('filter.ages') }}
          </h4>
          <div class="container p-0">
            <div class="row">
              <div class="col-md-5">
                <BFormGroup>
                  <BFormRadio
                    :model-value="searchOptions.ageAll"
                    name="age"
                    :value="true"
                    class="check-button pull-if-rtl-label"
                    @update:model-value="onChangeFilter({ ageAll: $event })"
                  >
                    {{ $t('filter.all-ages') }}
                  </BFormRadio>
                  <BFormRadio
                    :model-value="searchOptions.ageRange"
                    name="age"
                    :value="true"
                    class="check-button pull-if-rtl-label"
                    @update:model-value="onChangeFilter({ ageRange: $event })"
                  >
                    {{ $t('filter.age-range') }}
                  </BFormRadio>
                </BFormGroup>
              </div>
              <div
                v-if="searchOptions.ageRange"
                class="col-md-7"
              >
                <label class="range-label pull-if-rtl-label">
                  {{ $t('filter.from') }}:
                  <b>{{ searchOptions.filterAgeFrom }}</b>
                </label>
                <BFormInput
                  :model-value="searchOptions.filterAgeFrom"
                  type="range"
                  :min="MIN_AGE"
                  :max="MAX_AGE"
                  @update:model-value="debouncedOnChangeFilter({ filterAgeFrom: $event })"
                />
                <label class="range-label pull-if-rtl-label">
                  {{ $t('filter.to') }}:
                  <b>{{ searchOptions.filterAgeTo }}</b>
                </label>
                <BFormInput
                  :model-value="searchOptions.filterAgeTo"
                  type="range"
                  :min="MIN_AGE"
                  :max="MAX_AGE"
                  @update:model-value="debouncedOnChangeFilter({ filterAgeTo: $event })"
                />
              </div>
            </div>
          </div>
        </div>

        <hr>

        <div class="d-flex flex-column pull-if-rtl">
          <h4
            class="filters-subtitle pull-if-rtl-label"
          >
            {{ $t('filter.religious-affiliation') }}
          </h4>
          <BFormGroup>
            <BFormRadio
              v-for="(option, index) in religiousOptions"
              :key="index"
              :model-value="searchOptions.religionFilterType"
              class="check-button pull-if-rtl-label"
              :value="option.value"
              name="religious-affiliation"
              @update:model-value="onChangeFilter({ religionFilterType: ($event ? option.value : undefined) as any })"
            >
              {{ option.text }}
            </BFormRadio>
          </BFormGroup>
        </div>

        <div class="clear-preference-section">
          <BButton
            variant="secondary"
            class="w-100 d-flex justify-content-center"
            @click="$emit('clear')"
          >
            {{ $t('filter.clear-preferences') }}
          </BButton>

          <BButton 
            v-if="type === SearchTypes.DATING"
            variant="secondary"
            class="w-100 d-flex justify-content-center mt-3"
            @click="$emit('reset')"
          >
            {{ $t('filter.apply-defaults') }}
          </BButton>
        </div>
      </div>
    </aside>
  </div>
</template>

<script lang="ts">
import { debounce } from 'lodash'
import { computed, defineComponent,ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import GoogleAddressAutocomplete from 'vue3-google-address-autocomplete'

import { ReligiousAffiliation, type SearchResultFilters, SearchTypes } from '@/types'
import { GOOGLE_API_KEY,MAX_AGE, MAX_PROXIMITY, MIN_AGE, MIN_PROXIMITY } from '@/utils'

export default defineComponent({
  name: 'SearchFilters',
  components: {
    GoogleAddressAutocomplete
  },
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    type: {
      type: String as () => SearchTypes,
      required: true,
    },
    searchOptions: {
      type: Object as () => SearchResultFilters,
      required: true,
    },
  },
  emits: [
    'close',
    'clear',
    'reset',
    'change-filter',
    'change-address',
  ],
  setup(props, context) {
    const { t } = useI18n()
    const peopleOptions = computed(() => {
      const options: string[] = [
        'All',
        'Host',
        'Guest',
        'Single'
      ]

      return options.map(option => ({
        value: option,
        text: t(`filter.people-options.${option}`)
      }))
    })
    const religiousOptions = computed(() => {
      const options: string[] = [
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
      return options.map(option => ({
        value: option,
        text: t(`filter.religious-options.${option.toLowerCase()}`)
      }))
    })
    const searchLocation = ref(props.searchOptions.location)

    watch(() => props.searchOptions, () => {
      searchLocation.value = props.searchOptions.location
    }, { immediate: true })

    const onChangeFilter = (updates: Partial<SearchResultFilters>) => {
      context.emit('change-filter', updates)
    }

    const debouncedOnChangeFilter = debounce((updates: Partial<SearchResultFilters>) => onChangeFilter(updates), 300)

    const onClickInside = (event: Event) => {
      event.stopPropagation()
    }

    const onChangeLocation = (addressData: any) => {
      if (!props.searchOptions.locationPlace) {
        return
      }
      searchLocation.value = addressData.formatted_address
      const latitude = addressData.geometry.location.lat()
      const longitude = addressData.geometry.location.lng()

      if (props.type === SearchTypes.DATING) {
        context.emit('change-filter', { cityCoordinate: { latitude, longitude } })
        context.emit('change-filter', { cityRetrieved: searchLocation.value })
      } else {
        context.emit('change-filter', { coordinates: { latitude, longitude } })
        context.emit('change-filter', { location: searchLocation.value })
      }
    }

    return {
      SearchTypes,
      MAX_AGE,
      MIN_AGE,
      MIN_PROXIMITY,
      MAX_PROXIMITY,
      GOOGLE_API_KEY,
      peopleOptions,
      religiousOptions,
      searchLocation,
      onChangeFilter,
      debouncedOnChangeFilter,
      onClickInside,
      onChangeLocation,
    }
  }
})
</script>

<style scoped lang="scss">
.filters-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  opacity: 1;
  z-index: 1000;
  transition: all 0.5s;

  &.hidden {
    opacity: 0;
    z-index: -1;
  }
}

.filters-container {
  width: 380px;
  text-align: left;
  position: fixed;
  right: 0px;
  height: calc(100% - 70px);
  overflow-y: auto;
  background-color: #fff;
  box-shadow: -13px 0 20px rgba(119, 131, 143, 0.08);
  transition: all 0.5s;
  opacity: 1;
  z-index: 102;

  &.hidden {
    right: -380px;
    opacity: 0;
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
  display: flex;
  flex-direction: column;

  hr {
    width: 100%;
  }
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

:deep(.form-check) {
  font-size: 14px;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

:deep(.form-check-input) {
  width: 1rem;
  height: 1rem;
  min-width: 1rem;
  min-height: 1rem;
  margin-top: 0;
  cursor: pointer;
}

:deep(.form-check-label) {
  flex: 1;
  margin-left: 0.5rem;
  cursor: pointer;
}

.range-label {
  font-size: 11px;
  margin-bottom: 0.5rem;
}

.filters-select {
  width: 200px;
  color: $colorRed;
  background: #e9e9e9;
  border-color: transparent;
  font-size: 12px;
  line-height: 1.5;

  &:hover,
  &:focus,
  &:active {
    color: #fff;
    background: $colorRed;
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

.clear-preference-section {
  margin: 16px -25px -25px;
  padding: 25px;
  margin-bottom: 25px;
}

.rtl-at-root {
  .filters-container {
    right: unset;
    left: 0;

    &.hidden {
      right: unset;
      left: -380px;
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
