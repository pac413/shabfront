<template>
  <div>
    <div class="panel">
      <div class="panel-header">
        {{ $t('dating-profile-edit.education.title') }}
      </div>

      <div class="panel-body">
        <!-- employment status -->
        <BFormGroup
          id="employment-status-group"
          class="form-group"
          :label="$t('dating-profile-edit.education.employment-status')"
          label-for="employment-status-input"
          label-class="input-label"
        >
          <BFormSelect
            id="employment-status-input"
            v-model="datingEmploymentStatus"
            :options="datingEmploymentStatusOptions"
            @change="handleDatingProfileUpdate('datingEmploymentStatus')"
          />
        </BFormGroup>

        <!-- secular education -->
        <BFormGroup
          id="secular-education-group"
          class="form-group"
          :label="$t('dating-profile-edit.education.secular-education')"
          label-for="secular-education-input"
          label-class="input-label"
        >
          <BFormSelect
            id="secular-education-input"
            v-model="datingSecularEducation"
            :options="datingSecularEducationOptions"
            @change="handleDatingProfileUpdate('datingSecularEducation')"
          />
        </BFormGroup>

        <!-- jewish education -->
        <BFormGroup
          id="jewish-education-group"
          class="form-group"
          :label="$t('dating-profile-edit.education.jewish-education')"
          label-for="jewish-education-input"
          label-class="input-label"
        >
          <BFormSelect
            id="jewish-education-input"
            v-model="datingJewishEducation"
            :options="datingJewishEducationOptions"
            @change="handleDatingProfileUpdate('datingJewishEducation')"
          />
        </BFormGroup>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import { storeKey } from '@/store'
import {
  type DatingProfile,
  EmploymentStatus,
  type InputOption,
  JewishEducation,
  type Profile,
  SecularEducation
} from '@/types'

export default defineComponent({
  name: 'EducationView',
  props: {
    profile: {
      type: Object as () => Profile,
      required: true,
    },
    datingProfile: {
      type: Object as () => DatingProfile,
      required: true,
    },
  },
  setup(props) {
    const { t } = useI18n()
    const store = useStore(storeKey)
    const datingEmploymentStatus = ref<EmploymentStatus | null>(null)
    const datingJewishEducation = ref<JewishEducation | null>(null)
    const datingSecularEducation = ref<SecularEducation | null>(null)

    const datingEmploymentStatusOptions = computed((): InputOption[] => {
      const options: InputOption[] = [
        { value: null, text: t('dating-profile-edit.select-one').toString() }
      ]
      Object.keys(EmploymentStatus).forEach(key => {
        options.push({ value: key, text: t(`dating-profile-edit.education.${key}`).toString() })
      })
      return options
    })

    const datingSecularEducationOptions = computed((): InputOption[] => {
      const options: InputOption[] = [
        { value: null, text: t('dating-profile-edit.select-one').toString() }
      ]
      Object.keys(SecularEducation).forEach(key => {
        options.push({ value: key, text: t(`dating-profile-edit.education.${key}`).toString() })
      })
      return options
    })

    const datingJewishEducationOptions = computed((): InputOption[] => {
      const options: InputOption[] = [
        { value: null, text: t('dating-profile-edit.select-one').toString() }
      ]
      Object.keys(JewishEducation).forEach(key => {
        options.push({ value: key, text: t(`dating-profile-edit.education.${key}`).toString() })
      })
      return options
    })

    const handleDatingProfileUpdate = async (key: string) => {
      const payload = {
        id: props.datingProfile.id,
        profileId: props.profile.id,
        ...(key === 'datingEmploymentStatus' ? { datingEmploymentStatus: datingEmploymentStatus.value } : {}),
        ...(key === 'datingSecularEducation' ? { datingSecularEducation: datingSecularEducation.value } : {}),
        ...(key === 'datingJewishEducation' ? { datingJewishEducation: datingJewishEducation.value } : {}),
      }
      await store.dispatch('profile/updateDatingProfile', payload)
    }

    onMounted(() => {
      if (props.datingProfile) {
        datingEmploymentStatus.value = props.datingProfile.datingEmploymentStatus
        datingSecularEducation.value = props.datingProfile.datingSecularEducation
        datingJewishEducation.value = props.datingProfile.datingJewishEducation
      }
    })

    return {
      datingEmploymentStatus,
      datingEmploymentStatusOptions,
      datingJewishEducation,
      datingJewishEducationOptions,
      datingSecularEducation,
      datingSecularEducationOptions,
      handleDatingProfileUpdate,
    }
  }
})
</script>

<style lang="scss" scoped>
@import './style.module.scss';
</style>
