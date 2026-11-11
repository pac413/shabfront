<template>
  <div class="pull-if-rtl inner-container indent">
    <div
      v-if="!emailConfirmed"
      class="email-confirmation d-flex align-items-center"
    >
      <div
        class="alert alert-warning"
        role="alert"
        v-html="$t('register-complete-view.instruction')"
      />

      <span class="tips">
        {{ $t('register-complete-view.ifNotArrived') }} <a
          href="#"
          @click.prevent="resend"
        >{{ $t('register-complete-view.clickHere') }}</a> {{ $t('register-complete-view.toResent') }}
      </span>
    </div>
    <div
      v-else
      id="register-complete-wrapper"
    >
      <h1>{{ $t('register-complete-view.welcome', { firstName }) }}</h1>
      <h4 class="sub-title text-secondary">
        {{ $t('register-complete-view.sub-title') }}
      </h4>
      <form
        id="register-complete-form"
        novalidate
        role="form"
        @submit.prevent="complete"
      >
        <BAlert
          :model-value="!!errorMessage"
          variant="danger"
        >
          {{ errorMessage }}
        </BAlert>

        <div class="form-group">
          <BFormGroup
            class="form-group"
            :label="$t('register-complete-view.interestsInShabbat')"
            label-class="input-label text-start required"
          >
            <VSelect
              multiple
              :options="interestsOptions"
              :class="{ 'is-invalid': !!errors.interests }"
              :reduce="(item: any) => item.value"
              placeholder="Select Interests"
              label="text"
              :model-value="interests.modelValue"
              @update:model-value="interests['onUpdate:modelValue']"
            />
            <div v-if="errors.interests" class="error-details pull-if-rtl-label">
              {{ $t(errors.interests) }}
            </div>
          </BFormGroup>
        </div>

        <div class="form-group">
          <BFormGroup
            class="form-group"
            :label="$t('register-complete-view.city')"
            label-class="input-label text-start required"
          >
            <VueGoogleAutocomplete
              id="city"
              name="city"
              class="form-control"
              :placeholder="$t('register-complete-view.selectCity')"
              types="(cities)"
              @change="removeLocationIfNeeded"
              @placechanged="setLocation"
            />
            <div v-if="errors.city" class="error-details pull-if-rtl-label">
              {{ $t(errors.city) }}
            </div>
          </BFormGroup>
        </div>

        <div class="form-group">
          <BFormGroup
            class="form-group"
            :label="$t('register-complete-view.religiousAffiliation')"
            label-class="input-label text-start required"
          >
            <VSelect
              :options="getReligiousOptions"
              :class="{ 'is-invalid': !!errors.religiousAffiliation }"
              :reduce="(item: any) => item.value"
              :placeholder="$t('profile-edit.personal-info.religious-affiliation-null')"
              label="text"
              :model-value="religiousAffiliation.modelValue"
              @update:model-value="religiousAffiliation['onUpdate:modelValue']"
            />
            <div v-if="errors.religiousAffiliation" class="error-details pull-if-rtl-label">
              {{ $t(errors.religiousAffiliation) }}
            </div>
          </BFormGroup>
        </div>

        <div class="form-group">
          <BFormGroup
            class="form-group"
            :label="$t('register-complete-view.title')"
            label-class="input-label text-start required"
          >
            <VSelect
              :options="titleOptions"
              :class="{ 'is-invalid': !!errors.title }"
              :reduce="(item: any) => item.value"
              :placeholder="$t('register-complete-view.selectTitle')"
              label="text"
              :model-value="title.modelValue"
              @update:model-value="title['onUpdate:modelValue']"
            />
            <div v-if="errors.title" class="error-details pull-if-rtl-label">
              {{ $t(errors.title) }}
            </div>
          </BFormGroup>
        </div>

        <BFormGroup
          id="marital-status-group"
          class="form-group"
          :label="$t('register-complete-view.maritalStatus')"
          label-class="input-label text-start required"
        >
          <VSelect
            :options="maritalStatusOptions"
            :class="{ 'is-invalid': !!errors.maritalStatus }"
            :reduce="(item: any) => item.value"
            :placeholder="$t('profile-edit.relationship.marital-status-null')"
            label="text"
            :model-value="maritalStatus.modelValue"
            @update:model-value="onMaritalStatusChange"
          />
          <div v-if="errors.maritalStatus" class="error-details pull-if-rtl-label">
            {{ $t(errors.maritalStatus) }}
          </div>
        </BFormGroup>

        <BFormGroup
          class="form-group"
          :label="$t('register-complete-view.occupation')"
          label-class="input-label text-start required"
        >
          <VSelect
            :options="occupationOptions"
            :class="{ 'is-invalid': !!errors.occupation }"
            :reduce="(item: any) => item.value"
            :placeholder="$t('profile-edit.personal-info.occupation-null')"
            label="text"
            :model-value="occupation.modelValue"
            @update:model-value="occupation['onUpdate:modelValue']"
          />
          <div v-if="errors.occupation" class="error-details pull-if-rtl-label">
            {{ $t(errors.occupation) }}
          </div>
        </BFormGroup>

        <BFormGroup
          class="form-group"
          :label="$t('register-complete-view.birthday')"
          label-class="input-label text-start"
        >
          <BFormInput
            v-bind="birthday"
            type="date"
            :max="today"
            :class="{ 'is-invalid': errors.birthday }"
          />
          <div v-if="errors.birthday" class="error-details pull-if-rtl-label">
            {{ $t(errors.birthday) }}
          </div>
        </BFormGroup>

        <div
          v-if="isOrthodox"
          class="panel-body d-flex align-items-center my-1"
        >
          <div class="d-flex flex-column align-items-start me-3">
            <label
              for="hide-all-media"
              class="input-label mb-0"
            >
              {{ $t('register-complete-view.hide-all-media') }}
            </label>
            <span class="hide-all-media-desc">({{ $t('register-complete-view.hide-all-media-description') }})</span>
          </div>
          <BFormCheckbox
            id="hide-all-media"
            v-model="hideAllMedia"
            name="host-all-media"
            switch
          />
        </div>

        <div
          v-if="isNonOrthodox"
          class="panel-body d-flex align-items-center text-left mt-4 mb-1"
        >
          <label
            for="email-opt-in"
            class="email-opt-in-label sub-title font-weight-bold mb-0 mr-3 flex-grow-1"
          >
            {{ $t('register-complete-view.email-opt-in') }}
          </label>
          <BFormCheckbox
            id="email-opt-in" 
            v-model="emailOptIn"
            class="check-button pull-if-rtl-label"
            switch
          />
        </div>

        <BButton
          variant="primary"
          :disabled="!meta.valid"
          type="submit"
        >
          {{ $t('register-complete-view.complete') }}
        </BButton>
      </form>
      <div
        class="privacy small text-secondary"
        v-html="$t('register-complete-view.privacy-disclaimer')"
      />
    </div>
  </div>
</template>

<script lang="ts">
import 'vue-select/dist/vue-select.css'

import { useForm } from 'vee-validate'
import { computed, defineComponent, onMounted, ref } from 'vue'
import VueGoogleAutocomplete from 'vue-google-autocomplete'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import VSelect from 'vue-select'
import { useStore } from 'vuex'
import * as yup from 'yup'

import { useToast } from '@/composables'
import { storeKey } from '@/store'
import { useGlobalStore } from '@/stores/global'
import {
  type InputOption,
  type LocationInput,
  ProfileTitle,
  ReligiousAffiliation,
  SiteRole,
} from '@/types'

interface AddressData {
  // 3rd party naming
  administrative_area_level_1: string
  country: string
  locality: string
  latitude: number
  longitude: number
}

interface PlaceResultData {
  // 3rd party naming
  address_components: {
    long_name: string, short_name: string, types: string[]
  }[]
}

export default defineComponent({
  name: 'RegisterComplete',
  components: {
    VueGoogleAutocomplete,
    VSelect,
  },
  setup() {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const globalStore = useGlobalStore()
    const router = useRouter()
    const { showSuccessToast, showErrorToast } = useToast()
    
    const occupations = computed(() => store.state.profile.occupations)
    const profileId = computed(() => store.state.profile.activeProfile?.id!)
    const firstName = computed(() => store.state.profile.activeProfile?.firstName!)
    const emailConfirmed = computed(() => store.state.auth.emailConfirmed)
    const location = ref<LocationInput | null>(null)
    const { defineComponentBinds, errors, meta, setFieldValue, values } = useForm({
      validationSchema: yup.object({
        interests: yup.array().of(yup.string()).min(1).required(),
        city: yup.string().required(),
        religiousAffiliation: yup.string().required(),
        title: yup.string().required(),
        maritalStatus: yup.string().required(),
        birthday: yup.string().when('interests', {
          is: (interests: string[]) => interests?.includes(SiteRole.DATING.toString()),
          then: schema => schema.required(),
          otherwise: schema => schema,
        }),
        occupation: yup.string().required(),
      }),
    })
    const interests = defineComponentBinds('interests')
    const religiousAffiliation = defineComponentBinds('religiousAffiliation')
    const title = defineComponentBinds('title')
    const maritalStatus = defineComponentBinds('maritalStatus')
    const birthday = defineComponentBinds('birthday')
    const occupation = defineComponentBinds('occupation')

    const errorMessage = ref<string | null>(null)
    const loading = ref<boolean>(false)
    const today = ref<string>('')
    const hideAllMedia = ref<boolean>(false)
    const emailOptIn = ref<boolean>(false)

    const interestsOptions = computed((): InputOption[] => {
      const options: InputOption[] = [
        { value: 'NONE', text: t('register-complete-view.socialNetworking').toString() },
        { value: SiteRole.HOST.toString(), text: t('register-complete-view.shabbatHost').toString() }
      ]

      if (!values.maritalStatus || !values.maritalStatus.includes('married')) {
        options.push({ value: SiteRole.DATING.toString(), text: t('register-complete-view.dating').toString() })
      }

      return options
    })

    const titleOptions = computed((): InputOption[] => {
      const options: InputOption[] = []
      for (let item in ProfileTitle) {
        options.push({
          value: item.toUpperCase(),
          text: t(`profile-edit.contact-info.title-${item.toLowerCase()}`).toString()
        })
      }
      return options
    })

    const getReligiousOptions = computed(() => {
      const options: InputOption[] = []
      for (let item in ReligiousAffiliation) {
        options.push({
          value: item,
          text: t(`profile-edit.personal-info.${item.toLowerCase()}`).toString()
        })
      }
      return options
    })

    const maritalStatusOptions = computed((): InputOption[] => {
      const options = [
        {
          value: 'marital-status-single-without-children',
          text: t('profile-edit.relationship.marital-status-single-without-children').toString()
        },
        {
          value: 'marital-status-single-with-children',
          text: t('profile-edit.relationship.marital-status-single-with-children').toString()
        },
      ]
      if (!values.interests?.includes(SiteRole.DATING)) {
        options.push({
          value: 'marital-status-married-without-children',
          text: t('profile-edit.relationship.marital-status-married-without-children').toString()
        })
        options.push({
          value: 'marital-status-married-with-children',
          text: t('profile-edit.relationship.marital-status-married-with-children').toString()
        })      
      }
      return options
    })

    const occupationOptions = computed((): InputOption[] => {
      let options: InputOption[] = []
      const temp = [...occupations.value]
      temp.sort((a, b) => a.name > b.name ? 1 : -1).forEach(item => {
        options.push({ value: item.id, text: item.name })
      })
      return options
    })

    const isOrthodox = computed(() => {
      return (
        values.religiousAffiliation &&
        values.religiousAffiliation.toUpperCase() ===
          ReligiousAffiliation.Orthodox
      )
    })

    const isNonOrthodox = computed(() => {
      return (
        values.religiousAffiliation &&
        values.religiousAffiliation.toUpperCase() !==
          ReligiousAffiliation.Orthodox
      )
    })

    const removeDating = () => {
      // Remove Dating siteRole if maritalStatus is married
      if (values.maritalStatus?.includes('married')) {
        if (values.interests) {
          setFieldValue('interests', values.interests.filter(
            (item: string) => item !== SiteRole.DATING.toString())
          )
        }
      }
    }

    const setLocation = (address: AddressData, placeResult: PlaceResultData) => {
      // Sometimes address doesn't include city name, but placeResult does
      const { country, longitude, latitude } = address

      // Get the full name of the city and state
      const cityComponent = placeResult.address_components.find(
        comp => comp.types.includes('locality') || comp.types.includes('administrative_area_level_3')
      )
      const stateComponent = placeResult.address_components.find(comp =>
        comp.types.includes('administrative_area_level_1')
      )

      location.value = {
        address: '',
        city: cityComponent?.long_name || '',
        state: stateComponent?.long_name || '',
        country,
        zipcode: '',
        geoLocation: {
          coordinates: [longitude, latitude]
        }
      }
      setFieldValue('city', location.value.city)
    }

    const removeLocationIfNeeded = (value: string) => {
      if (!value) {
        location.value = null
        setFieldValue('city', null)
      }
    }

    const onMaritalStatusChange = (value: unknown) => {
      maritalStatus.value['onUpdate:modelValue'](value)
      removeDating()
    }

    const complete = async () => {
      loading.value = true

      try {
        const form = {
          siteRoles: values.interests?.filter((item: string) => item !== 'NONE'),
          location: location.value,
          religiousAffiliation: values.religiousAffiliation?.toString().toUpperCase(),
          title: values.title,
          isMarried: values.maritalStatus && values.maritalStatus.includes('married'),
          birthday: values.birthday ? new Date(values.birthday) : null,
          occupationId: values.occupation ? +values.occupation : null,
          primaryLocale: globalStore.language.locale,
          emailOptIn: isNonOrthodox.value && emailOptIn.value
        }
        await store.dispatch('profile/completeRegister', form)
        if (isOrthodox.value) {
          await store.dispatch('profileSettings/updateProfileSettings', {
            profileId: profileId.value,
            setting: 'hideAllMedia',
            value: hideAllMedia.value,
          })
        }
        await store.dispatch('profile/getActiveProfile')
        await router.replace('/profile')
      } catch (error) {
        showErrorToast(t('register-complete-view.unableComplete').toString())
      } finally {
        loading.value = false
      }
    }

    const resend = async () => {
      loading.value = true
      try {
        const response = await store.dispatch('profile/resendConfirmationEmail')
        if (response.data.status) {
          showSuccessToast(
            t('register-complete-view.emailHasBeenResent').toString(),
          )
        } else {
          switch (response.data.error) {
          case 'EMAIL_ALREADY_CONFIRMED': {
            showErrorToast(t('register-complete-view.alreadyConfirmed').toString())
            break
          }
          case 'PROFILE_NOT_EXIST':
          case 'USER_NOT_EXIST': {
            showErrorToast(t('register-complete-view.userNotExist').toString())
            break
          }
          case 'CANNOT_SEND_EMAIL':
          default: {
            showErrorToast(t('register-complete-view.resendEmailError').toString())
            break
          }
          }
        }
      } catch (error) {
        showErrorToast(t('register-complete-view.resendEmailError').toString())
      } finally {
        loading.value = false
      }
    }

    onMounted(() => {
      store.dispatch('profile/getOccupations')

      const currentDate = new Date()
      const month = currentDate.getMonth() + 1
      const day = currentDate.getDate()
      const year = currentDate.getFullYear()
      const monthWithZero = month < 10
        ? '0' + month.toString()
        : month.toLocaleString()
      const dayWithZero = day < 10
        ? '0' + day.toString()
        : day.toLocaleString()

      today.value = year + '-' + monthWithZero + '-' + dayWithZero
    })

    return {
      birthday,
      complete,
      emailConfirmed,
      errors,
      errorMessage,
      firstName,
      getReligiousOptions,
      hideAllMedia,
      interests,
      interestsOptions,
      isOrthodox,
      isNonOrthodox,
      loading,
      location,
      maritalStatus,
      maritalStatusOptions,
      meta,
      occupation,
      occupationOptions,
      occupations,
      onMaritalStatusChange,
      profileId,
      religiousAffiliation,
      removeDating,
      removeLocationIfNeeded,
      resend,
      setFieldValue,
      setLocation,
      title,
      titleOptions,
      today,
      emailOptIn,
    }
  }
})
</script>

<style lang="scss" scoped>
.form-group {
  margin-bottom: 1rem;
}

.inner-container {
  display: flex;
  justify-content: center;

  #register-complete-wrapper {
    padding: 3rem 0;
    text-align: center;

    .sub-title {
      font-size: 1.2em;
    }

    .privacy {
      padding-top: 2em;
    }

    #register-complete-form {
      padding-top: 1rem;
      font-size: 1em;
      max-width: 460px;

      button[type='submit'] {
        width: 100%;
        margin-top: 10px;
      }

      .error-details {
        font-size: 0.8em;
        padding-top: 6px;
      }

      :deep(.v-select) input {
        color: #495057;
      }

      input::placeholder {
        color: #495057;
      }

      :deep(.input-label) {
        font-weight: bolder;

        &.required {
          &::after {
            content: ' *';
            color: $colorRed;
          }
        }
      }

      :deep(.vs__search) {
        cursor: pointer;
      }

      .hide-all-media-desc {
        color: #65676b;
        font-size: 13px;
        text-align: left;
      }

      .email-opt-in-label {
        color: $colorDarkRed;
      }

      .custom-switch {
        transform: scale(2);
      }
    }
  }

  .email-confirmation {
    display: flex;
    flex-direction: column;
    .alert {
      font-size: 18px;
    }
    .tips {
      text-align: center;
    }
  }
}
</style>
