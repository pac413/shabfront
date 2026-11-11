<template>
  <div class="pull-if-rtl advanced-search indent vw-100">
    <div id="search-wrapper">
      <h1>{{ $t('advances-search-view.title') }}</h1>
      
      <form
        id="search-form"
        novalidate
        role="form"
        @submit.prevent="search"
      >
        <div class="form-group row row-title">
          <div class="search-group-title col-sm">
            {{ $t('advances-search-view.people') }}
          </div>
        </div>
        <div class="form-group row">
          <label
            for="role"
            class="col-sm col-form-label"
          >{{ $t('advances-search-view.role') }}</label>
          <div class="col-sm-9">
            <BFormSelect
              id="role"
              v-model="form.role"
              :options="roleOptions"
            />
          </div>
        </div>
        <div class="form-group row">
          <label
            for="firstName"
            class="col-sm col-form-label"
          >{{ $t('advances-search-view.firstName') }}</label>
          <div class="col-sm-9">
            <input
              id="firstName"
              v-model="form.firstName"
              type="text"
              class="form-control"
              name="firstName"
            >
          </div>
        </div>
        <div class="form-group row">
          <label
            for="lastName"
            class="col-sm col-form-label"
          >{{ $t('advances-search-view.lastName') }}</label>
          <div class="col-sm-9">
            <input
              id="lastName"
              v-model="form.lastName"
              type="text"
              class="form-control"
              name="lastName"
            >
          </div>
        </div>

        <div class="form-group row">
          <label
            for="organization"
            class="col-sm col-form-label"
          >{{ $t('advances-search-view.organization') }}</label>
          <div class="col-sm-9">
            <input
              id="organization"
              v-model="form.organization"
              type="text"
              class="form-control"
              name="organization"
            >
          </div>
        </div>

        <div class="form-group row">
          <label
            for="occupation"
            class="col-sm col-form-label"
          >{{ $t('advances-search-view.occupation') }}</label>
          <div class="col-sm-9">
            <BFormSelect
              id="occupation"
              v-model="form.occupationId"
              :options="occupationOptions"
            />
          </div>
        </div>

        <div class="form-group row row-title">
          <div class="search-group-title col-sm">
            {{ $t('advances-search-view.places') }}
          </div>
        </div>

        <div class="form-group row">
          <label class="col-sm col-form-label">{{ $t('advances-search-view.nearThisLocation') }}</label>
          <div class="col-sm-9">
            <VueGoogleAutocomplete
              id="nearThisLocation"
              :key="locationSearchType"
              class="form-control"
              :types="locationSearchType"
              :placeholder="$t('advances-search-view.startTyping')"
              @placechanged="getAddressData"
            />
          </div>
        </div>

        <div class="form-group row">
          <label
            for="locationSearchType"
            class="col-sm col-form-label"
          >{{ $t('advances-search-view.locationType') }}</label>
          <div class="col-sm-9">
            <BFormSelect
              id="locationSearchType"
              v-model="locationSearchType"
              :options="locationOptions"
            />
          </div>
        </div>

        <div class="form-group row">
          <div class="mt-3 offset-md-8 col-sm-4">
            <BButton
              variant="primary"
              type="submit"
            >
              {{ $t('advances-search-view.search') }}
            </BButton>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { cloneDeep, omitBy } from 'lodash'
import { computed, defineComponent, type Ref, ref } from 'vue'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

import { type IOccupation, useOccupationsQuery } from '@/composables/graphql/generated'
import { useGlobalStore } from '@/stores/global'

export default defineComponent({
  name: 'AdvancedSearch',
  components: {
    VueGoogleAutocomplete,
  },
  setup() {
    const { t } = useI18n()
    const globalStore = useGlobalStore()
    const router = useRouter()
    const locationSearchType: Ref<string> = ref('')
    const form: Ref<{
      role: string
      firstName: string
      lastName: string
      organization: string
      occupationId: string
      coordinates?: string
    }> = ref({
      role: '',
      firstName: '',
      lastName: '',
      organization: '',
      occupationId: ''
    })
    const roleOptions = [
      { value: '', text: t('advances-search-view.all').toString() },
      { value: 'hosts', text: t('advances-search-view.hosts').toString() },
      { value: 'guests', text: t('advances-search-view.guests').toString() },
      { value: 'singles', text: t('advances-search-view.singles').toString() },
    ]
    const { result: occupationsResult } = useOccupationsQuery({
      language: globalStore.language.locale as any
    })
    
    const occupationOptions = computed(() => {
      const occupations = (cloneDeep(occupationsResult.value?.occupations) || []) as IOccupation[]
      const options = occupations.sort((a, b) => a!.name!.localeCompare(b!.name!, globalStore.language.locale, {
        ignorePunctuation: true
      }))
      return [
        { value: '', text: t('advances-search-view.all') },
        ...options.map((occupation) => ({
          value: occupation.id,
          text: occupation.name
        })),
      ]
    })
    const locationOptions = [
      { value: 'geocode', text: t('advances-search-view.geocode') },
      { value: 'establishment', text: t('advances-search-view.establishment') },
    ]

    const getAddressData = (addressData: any): void => {
      form.value.coordinates = `${addressData.latitude},${addressData.longitude}`
    }

    const search = (): void => {
      router.push({
        name: 'Search',
        query: {
          type: 'all',
          ...omitBy(form.value, (value) => !value),
        }
      })
    }

    return {
      form,
      getAddressData,
      locationOptions,
      locationSearchType,
      occupationOptions,
      roleOptions,
      search,
    }
  }
})
</script>

<style lang="scss" scoped>
.advanced-search {
  display: flex;
  justify-content: center;
}

#search-wrapper {
  padding: 3rem 0;
  width: 60%;

  h1 {
    text-align: center;
  }
}

#search-form {
  padding-top: 1rem;

  .row-title {
    &:not(:first-child) {
      margin-top: 40px
    }

    .search-group-title {
      font-size: 17px;
      font-weight: 600;
    }
  }
}

button[type='submit'] {
  margin-top: 10px;
  float: right;
}
</style>
