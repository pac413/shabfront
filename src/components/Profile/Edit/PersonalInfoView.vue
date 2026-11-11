<template>
  <div>
    <div class="panel">
      <div class="panel-header">
        <FaIcon
          :icon="['fal', 'calculator']"
          class="me-1"
        />
        {{ $t('profile-edit.personal-info.birthday') }}
      </div>
      <div class="panel-body">
        <BFormGroup
          id="birthday-group"
          class="form-group"
          :label="$t('profile-edit.personal-info.birthday')"
          label-for="birthday-input"
          label-class="input-label"
        >
          <DebounceInput
            id="birthday-input"
            v-model="birthday"
            type="date"
            :max="maxDate"
            :timeout="500"
            @blur="handleProfileUpdate('birthday')"
            @debounce="handleProfileUpdate('birthday')"
          />
        </BFormGroup>
        <BButton
          variant="primary"
          size="sm"
          @click="handleDeleteBirthday"
        >
          {{ $t('profile-edit.personal-info.delete-birthday') }}
        </BButton>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <FaIcon
          :icon="['fal', 'male']"
          class="me-1"
        />
        {{ $t('profile-edit.personal-info.gender') }}
      </div>
      <div class="panel-body">
        <BFormRadioGroup
          id="gender-radio"
          v-model="gender"
          :options="genderOptions"
          name="gender-radio"
          stacked
          @change="(selected: string) => handleProfileUpdate('gender', selected)"
        />
        <div
          v-if="genderErrors.length > 0"
          class="error-details pull-if-rtl-label"
        >
          {{ $t(genderErrors[0]) }}
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <FaIcon
          :icon="['fal', 'briefcase']"
          class="me-1"
        />
        {{ $t('profile-edit.personal-info.occupation') }}
      </div>
      <div class="panel-body">
        <div
          v-if="!occupation && profile.uncuratedOccupation"
          class="alert alert-warning"
          role="alert"
        >
          Your selected occupation "{{ profile.uncuratedOccupation }}"&nbsp;
          is not our supported list of occupations on Shabbat.com. <br>
          Please update your occupation by selecting one that most closely resembles yours.
        </div>
        <BFormSelect
          id="occupation-select"
          v-model="occupation"
          :options="occupationOptions"
          @change="handleProfileUpdate('occupation')"
        />
        <div
          v-if="occupationErrors.length > 0"
          class="error-details pull-if-rtl-label"
        >
          {{ $t(occupationErrors[0]) }}
        </div>
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <FaIcon
          :icon="['fal', 'graduation-cap']"
          class="me-1"
        />
        {{ $t('profile-edit.personal-info.organization') }}
      </div>
      <div class="panel-body">
        <DebounceInput
          id="organization-input"
          v-model="organization"
          type="text"
          :timeout="500"
          :placeholder="$t('profile-edit.personal-info.organization')"
          @blur="handleProfileUpdate('organization')"
          @debounce="handleProfileUpdate('organization')"
        />
      </div>
    </div>

    <div class="panel">
      <div class="panel-header">
        <FaIcon
          :icon="['fal', 'star-of-david']"
          class="me-1"
        />
        {{ $t('profile-edit.personal-info.religious-affiliation') }}
      </div>
      <div class="panel-body">
        <BFormSelect
          id="religious-affiliation-select"
          v-model="religiousAffiliation"
          :options="religiousAffiliationOptions"
          @change="handleProfileUpdate('religiousAffiliation')"
        />
        <div
          v-if="religiousAffiliationErrors.length > 0"
          class="error-details pull-if-rtl-label"
        >
          {{ $t(religiousAffiliationErrors[0]) }}
        </div>
      </div>
    </div>

    <ConfirmationDialog
      id="delete-birthday-confirmation-dialog"
      v-model="showDeleteBdConfirmationDlg"
      :body="$t('profile-edit.personal-info.delete-birthday-warning')"
      title="Confirmation"
      @success="onDeleteBdConfirmed"
    />
  </div>
</template>

<script lang="ts">
import { useField } from 'vee-validate'
import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import ConfirmationDialog from '@/components/Common/Dialogs/ConfirmationDialog.vue'
import DebounceInput from '@/components/Common/Inputs/DebounceInput.vue'
import { useStringRequiredRule, useToast } from '@/composables'
import { IGender, type IProfile,type IReligiousAffiliation,ISiteRole } from '@/composables/graphql/generated'
import { storeKey } from '@/store'
import { type InputOption } from '@/types'
import { getCurrentDate, getShortDate } from '@/utils'

export default defineComponent({
  name: 'PersonalInfoView',
  components: {
    DebounceInput,
    ConfirmationDialog
  },
  props: {
    profile: {
      type: Object as () => IProfile,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const { showErrorToast } = useToast()
    const occupations = computed(() => store.state.profile.occupations)
    const birthday = ref<string>('')

    const genderRules = useStringRequiredRule('gender')
    const occupationRules = useStringRequiredRule('occupation')
    const religiousAffiliationRules = useStringRequiredRule('religiousAffiliation')

    const { errors: genderErrors, value: gender }
      = useField<IGender | null>('gender', genderRules, {
        initialValue: props.profile.gender,
      })
    const { errors: occupationErrors, value: occupation }
      = useField<string | null>('occupation', occupationRules, {
        initialValue: props.profile.occupation,
      })
    const organization = ref<string | null>(null)
    const { errors: religiousAffiliationErrors, value: religiousAffiliation }
      = useField<IReligiousAffiliation | null>('religiousAffiliation', religiousAffiliationRules, {
        initialValue: props.profile.religiousAffiliation
      })
    const maxDate = ref<string>(getCurrentDate())
    const showDeleteBdConfirmationDlg = ref<boolean>(false)

    const genderOptions = computed((): InputOption[] => {
      return ([
        { value: IGender.Male, text: t('profile-edit.personal-info.gender-male').toString() },
        { value: IGender.Female, text: t('profile-edit.personal-info.gender-female').toString() }
      ])
    })

    const religiousAffiliationOptions = computed((): InputOption[] => {
      return ([
        { value: null, text: t('profile-edit.personal-info.religious-affiliation-null').toString() },
        { value: 'CONSERVATIVE', text: t('profile-edit.personal-info.conservative').toString() },
        { value: 'CONSERVADOX', text: t('profile-edit.personal-info.conservadox').toString() },
        { value: 'CONVERSION', text: t('profile-edit.personal-info.conversion').toString() },
        { value: 'GENTILE', text: t('profile-edit.personal-info.gentile').toString() },
        { value: 'ORTHODOX', text: t('profile-edit.personal-info.orthodox').toString() },
        { value: 'REFORM', text: t('profile-edit.personal-info.reform').toString() },
        { value: 'RENEWAL', text: t('profile-edit.personal-info.renewal').toString() },
        { value: 'RECONSTRUCTIONIST', text: t('profile-edit.personal-info.reconstructionist').toString() },
        { value: 'UNAFFILIATED', text: t('profile-edit.personal-info.unaffiliated').toString() }
      ])
    })

    const occupationOptions = computed((): InputOption[] => {
      let options: InputOption[] = [
        { value: null, text: t('profile-edit.personal-info.occupation-null').toString() }
      ]
      occupations.value.forEach(item => {
        options.push({ value: item.id, text: item.name })
      })

      // check if uncuratedOccupation is needed to be included into occupation options
      const { occupation, uncuratedOccupation } = props.profile
      if (!occupation && uncuratedOccupation) {
        options.push({ value: 'uncurated', text: uncuratedOccupation })
      }
      return options
    })

    const deleteBirthday = async () => {
      let payload = {
        id: props.profile.id,
        birthday: null
      }
      await store.dispatch('profile/updateProfile', payload)
    }

    const onDeleteBdConfirmed = async () => {
      await deleteBirthday()

      // Remove dating siteRole
      const params = {
        profileId: props.profile.id,
        siteRole: ISiteRole.Dating
      }
      await store.dispatch('profile/deleteSiteRole', params)
    }

    const handleDeleteBirthday = async () => {
      if (props.profile.siteRoles?.includes(ISiteRole.Dating)) {
        showDeleteBdConfirmationDlg.value = true
      } else {
        await deleteBirthday()
      }
    }

    const handleProfileUpdate = async (fieldName: string, selected?: string) => {
      let payload: any = { id: props.profile.id }
      switch (fieldName) {
      case 'occupation':
      {
        const index = occupations.value.findIndex(item => item.id === occupation.value)
        payload.occupationId = occupation.value
        payload.occupation = occupations.value[index].name
        break
      }

      case 'gender':
        payload.gender = selected
        break

      case 'birthday':
        if (birthday.value) {
          if (new Date(birthday.value) > new Date()) {
            showErrorToast({
              error: {
                message: t('profile-edit.personal-info.birthday-invalid').toString(),
                status: 400
              }
            })
          } else {
            payload.birthday = new Date(birthday.value)
          }
        } else {
          payload.birthday = null
        }
        break
      case 'religiousAffiliation':
        payload.religiousAffiliation = religiousAffiliation.value
        break
      case 'organization':
        payload.organization = organization.value
        break
      default:
        return
      }

      await store.dispatch('profile/updateProfile', payload)
    }

    watch(() => props.profile, () => {
      birthday.value = props.profile.birthday ? getShortDate(props.profile.birthday) : ''
      gender.value = props.profile.gender || null
      occupation.value = props.profile.occupationId || null
      organization.value = props.profile.organization || null
      religiousAffiliation.value = props.profile.religiousAffiliation || null
    }, { immediate: true })

    onMounted(() => {
      if (occupations.value.length === 0) {
        store.dispatch('profile/getOccupations')
      }
    })

    return {
      birthday,
      deleteBirthday,
      gender,
      genderErrors,
      genderOptions,
      handleDeleteBirthday,
      handleProfileUpdate,
      maxDate,
      occupation,
      occupationErrors,
      occupationOptions,
      occupations,
      onDeleteBdConfirmed,
      organization,
      religiousAffiliation,
      religiousAffiliationErrors,
      religiousAffiliationOptions,
      showDeleteBdConfirmationDlg,
    }
  }
})
</script>

<style lang="scss" scoped>
@import './style.module.scss';
</style>
