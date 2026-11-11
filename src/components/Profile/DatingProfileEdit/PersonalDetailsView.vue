<template>
  <div>
    <div class="panel">
      <div class="panel-header">
        {{ $t('dating-profile-edit.personal-details.title') }}
      </div>

      <div class="panel-body">
        <!-- marital status -->
        <BFormGroup
          id="marital-status-group"
          class="form-group"
          :label="$t('dating-profile-edit.personal-details.marital-status')"
          label-for="marital-status-input"
          label-class="input-label"
        >
          <BFormSelect
            id="marital-status-input"
            v-model="maritalStatus"
            :options="maritalStatusOptions"
            @change="handleDatingProfileUpdate('maritalStatus')"
          />
        </BFormGroup>

        <!-- height -->
        <BFormGroup
          id="height-group"
          class="form-group"
          :label="$t('dating-profile-edit.personal-details.height')"
          label-for="height-input"
          label-class="input-label"
        >
          <BFormSelect
            id="height-input"
            v-model="height"
            :options="heightOptions"
            @change="handleDatingProfileUpdate('height')"
          />
        </BFormGroup>

        <!-- body type -->
        <BFormGroup
          id="body-type-group"
          class="form-group"
          :label="$t('dating-profile-edit.personal-details.body-type')"
          label-for="body-type-input"
          label-class="input-label"
        >
          <BFormSelect
            id="body-type-input"
            v-model="bodyType"
            :options="bodyTypeOptions"
            @change="handleDatingProfileUpdate('bodyType')"
          />
        </BFormGroup>

        <!-- i am a smoker -->
        <div class="panel-item">
          <label
            for="am-smoker"
            class="input-label"
          >
            {{ $t('dating-profile-edit.personal-details.am-smoker') }}
          </label>
          <BFormCheckbox
            id="am-smoker"
            v-model="amSmoker"
            name="am-smoker-button"
            switch
            @change="handleDatingProfileUpdate('amSmoker')"
          />
        </div>

        <!-- i keep kosher -->
        <BFormGroup
          id="keep-kosher-group"
          class="form-group"
          :label="$t('dating-profile-edit.personal-details.keep-kosher')"
          label-for="keep-kosher-input"
          label-class="input-label"
        >
          <BFormSelect
            id="keep-kosher-input"
            v-model="datingKeepKosher"
            :options="keepKosherOptions"
            @change="handleDatingProfileUpdate('datingKeepKosher')"
          />
        </BFormGroup>

        <!-- torah learning -->
        <BFormGroup
          id="torah-learning-group"
          class="form-group"
          :label="$t('dating-profile-edit.personal-details.torah-learning')"
          label-for="torah-learning-input"
          label-class="input-label"
        >
          <BFormSelect
            id="torah-learning-input"
            v-model="torahLearning"
            :options="frequencyOptions"
            @change="handleDatingProfileUpdate('torahLearning')"
          />
        </BFormGroup>

        <!-- prayer -->
        <BFormGroup
          id="prayer-group"
          class="form-group"
          :label="$t('dating-profile-edit.personal-details.prayer')"
          label-for="prayer-input"
          label-class="input-label"
        >
          <BFormSelect
            id="prayer-input"
            v-model="prayer"
            :options="frequencyOptions"
            @change="handleDatingProfileUpdate('prayer')"
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
  DatingProfileBodyType,
  Frequency,
  type InputOption,
  KeepKosher,
  MaritalStatus,
  type Profile,
} from '@/types'
import { getHeightText } from '@/utils'

export default defineComponent({
  name: 'PersonalDetailsView',
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
    const maritalStatus = ref<MaritalStatus | null>(null)
    const bodyType = ref<DatingProfileBodyType | null>(null)
    const datingKeepKosher = ref<KeepKosher | null>(null)
    const torahLearning = ref<Frequency | null>(null)
    const prayer = ref<Frequency | null>(null)
    const height = ref<number>(0)
    const amSmoker = ref<boolean>(false)

    const heightOptions = computed((): InputOption[] => {
      const options: InputOption[] = [
        { value: null, text: t('dating-profile-edit.select-one').toString() }
      ]
      // loop from 50 inch to 90 inch
      for (let i = 50; i < 90; i++) {
        options.push({
          value: i, text: getHeightText(i)
        })
      }
      return options
    })

    const maritalStatusOptions = computed((): InputOption[] => {
      const options: InputOption[] = [
        { value: null, text: t('dating-profile-edit.select-one').toString() }
      ]
      Object.keys(MaritalStatus).forEach(key => {
        options.push({ value: key, text: t(`dating-profile-edit.personal-details.${key}`).toString() })
      })
      return options
    })

    const bodyTypeOptions = computed((): InputOption[] => {
      const options: InputOption[] = [
        { value: null, text: t('dating-profile-edit.select-one').toString() }
      ]
      Object.keys(DatingProfileBodyType).forEach(key => {
        options.push({ value: key, text: t(`dating-profile-edit.personal-details.${key}`).toString() })
      })
      return options
    })

    const keepKosherOptions = computed((): InputOption[] => {
      const options: InputOption[] = [
        { value: null, text: t('dating-profile-edit.select-one').toString() }
      ]
      Object.keys(KeepKosher).forEach(key => {
        options.push({ value: key, text: t(`dating-profile-edit.personal-details.${key}`).toString() })
      })
      return options
    })

    const frequencyOptions = computed((): InputOption[] => {
      const options: InputOption[] = [
        { value: null, text: t('dating-profile-edit.select-one').toString() }
      ]
      Object.keys(Frequency).forEach(key => {
        options.push({ value: key, text: t(`dating-profile-edit.personal-details.${key}`).toString() })
      })
      return options
    })

    const handleDatingProfileUpdate = async (key: string) => {
      const payload = {
        id: props.datingProfile.id,
        profileId: props.profile.id,
        ...(key === 'maritalStatus' ? { maritalStatus: maritalStatus.value } : {}),
        ...(key === 'height' ? { height: height.value } : {}),
        ...(key === 'bodyType' ? { bodyType: bodyType.value } : {}),
        ...(key === 'amSmoker' ? { amSmoker: amSmoker.value } : {}),
        ...(key === 'datingKeepKosher' ? { datingKeepKosher: datingKeepKosher.value } : {}),
        ...(key === 'torahLearning' ? { torahLearning: torahLearning.value } : {}),
        ...(key === 'prayer' ? { prayer: prayer.value } : {}),
      }
      await store.dispatch('profile/updateDatingProfile', payload)
    }

    onMounted(() => {
      if (props.datingProfile) {
        maritalStatus.value = props.datingProfile.maritalStatus
        height.value = props.datingProfile.height
        bodyType.value = props.datingProfile.bodyType
        amSmoker.value = props.datingProfile.amSmoker
        datingKeepKosher.value = props.datingProfile.datingKeepKosher
        torahLearning.value = props.datingProfile.torahLearning
        prayer.value = props.datingProfile.prayer
      }
    })

    return {
      amSmoker,
      bodyType,
      bodyTypeOptions,
      datingKeepKosher,
      frequencyOptions,
      handleDatingProfileUpdate,
      height,
      heightOptions,
      keepKosherOptions,
      maritalStatus,
      maritalStatusOptions,
      prayer,
      torahLearning,
    }
  }
})
</script>

<style lang="scss" scoped>
@import './style.module.scss';
</style>
