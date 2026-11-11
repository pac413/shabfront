<template>
  <div>
    <div class="panel">
      <div class="panel-header">
        {{ $t('dating-profile-edit.background.title') }}
      </div>

      <div class="panel-body">
        <!-- hashkafa -->
        <BFormGroup
          v-if="isOrthodox"
          id="hashkafa-group"
          class="form-group"
          :label="$t('dating-profile-edit.background.hashkafa')"
          label-for="hashkafa-input"
          label-class="input-label"
        >
          <BFormSelect
            id="hashkafa-input"
            v-model="hashkafa"
            :options="hashkafaOptions"
            @change="handleDatingProfileUpdate('hashkafa')"
          />
        </BFormGroup>

        <!-- torah observant since -->
        <BFormGroup
          v-if="isOrthodox"
          id="torah-observant-since-group"
          class="form-group"
          :label="$t('dating-profile-edit.background.torah-observant-since')"
          label-for="torah-observant-since-input"
          label-class="input-label"
        >
          <DebounceInput
            id="torah-observant-since"
            v-model="torahObservantSince"
            type="date"
            :timeout="500"
            @blur="handleDatingProfileUpdate('torahObservantSince')"
            @debounce="handleDatingProfileUpdate('torahObservantSince')"
          />
        </BFormGroup>

        <!-- ethnic background -->
        <BFormGroup
          id="ethnic-background-group"
          class="form-group"
          :label="$t('dating-profile-edit.background.ethnic-background')"
          label-for="ethnic-background-input"
          label-class="input-label"
        >
          <BFormSelect
            id="ethnic-background-input"
            v-model="ethnicBackground"
            :options="ethnicBackgroundOptions"
            @change="handleDatingProfileUpdate('ethnicBackground')"
          />
        </BFormGroup>

        <!-- primary language -->
        <BFormGroup
          id="primary-language-group"
          class="form-group"
          :label="$t('dating-profile-edit.background.primary-language')"
          label-for="primary-language-input"
          label-class="input-label"
        >
          <BFormSelect
            id="primary-language-input"
            v-model="primaryLanguage"
            :options="languageOptions"
            @change="handleDatingProfileUpdate('primaryLanguage')"
          />
        </BFormGroup>

        <!-- secondary language -->
        <BFormGroup
          id="secondary-language-group"
          class="form-group"
          :label="$t('dating-profile-edit.background.secondary-language')"
          label-for="secondary-language-input"
          label-class="input-label"
        >
          <BFormSelect
            id="secondary-language-input"
            v-model="secondaryLanguage"
            :options="languageOptions"
            @change="handleDatingProfileUpdate('secondaryLanguage')"
          />
        </BFormGroup>

        <!-- living in israel -->
        <BFormGroup
          id="living-in-israel-group"
          class="form-group"
          :label="$t('dating-profile-edit.background.living-in-israel')"
          label-for="living-in-israel-input"
          label-class="input-label"
        >
          <BFormSelect
            id="living-in-israel-input"
            v-model="livingIsrael"
            :options="importanceOptions"
            @change="handleDatingProfileUpdate('livingIsrael')"
          />
        </BFormGroup>

        <!-- personality trait 1 -->
        <BFormGroup
          id="personality-trait1-group"
          class="form-group"
          :label="$t('dating-profile-edit.background.personality-trait1')"
          label-for="personality-trait1-input"
          label-class="input-label"
        >
          <BFormSelect
            id="personality-trait1-input"
            v-model="primaryPersonalityTrait"
            :options="personalityTraitOptions"
            @change="handleDatingProfileUpdate('primaryPersonalityTrait')"
          />
        </BFormGroup>

        <!-- personality trait 2 -->
        <BFormGroup
          id="personality-trait2-group"
          class="form-group"
          :label="$t('dating-profile-edit.background.personality-trait2')"
          label-for="personality-trait2-input"
          label-class="input-label"
        >
          <BFormSelect
            id="personality-trait2-input"
            v-model="secondaryPersonalityTrait"
            :options="personalityTraitOptions"
            @change="handleDatingProfileUpdate('secondaryPersonalityTrait')"
          />
        </BFormGroup>

        <!-- i plan on wearing skirts -->
        <div
          v-if="isFemaleOrthodox"
          class="panel-item"
        >
          <label
            for="plan-on-wearing-skirts"
            class="input-label"
          >
            {{ $t('dating-profile-edit.background.plan-on-wearing-skirts') }}
          </label>
          <BFormCheckbox
            id="plan-on-wearing-skirts"
            v-model="wearSkirts"
            name="plan-on-wearing-skirts-button"
            switch
            @change="handleDatingProfileUpdate('wearSkirts')"
          />
        </div>

        <!-- i plan on covering my hair -->
        <div
          v-if="isFemaleOrthodox"
          class="panel-item"
        >
          <label
            for="plan-on-covering-my-hair"
            class="input-label"
          >
            {{ $t('dating-profile-edit.background.plan-on-covering-my-hair') }}
          </label>
          <BFormCheckbox
            id="plan-on-covering-my-hair"
            v-model="coveringHair"
            name="plan-on-covering-my-hair-button"
            switch
            @change="handleDatingProfileUpdate('coveringHair')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from 'vuex'

import DebounceInput from '@/components/Common/Inputs/DebounceInput.vue'
import { storeKey } from '@/store'
import {
  type DatingProfile,
  EthnicBackground,
  Gender,
  Hashkafa,
  Importance,
  type InputOption,
  Language,
  PersonalityTrait,
  type Profile,
  ReligiousAffiliation
} from '@/types'

export default defineComponent({
  name: 'BackgroundView',
  components: {
    DebounceInput
  },
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
    const hashkafa = ref<Hashkafa | null>(null)
    const torahObservantSince = ref<string>('')
    const ethnicBackground = ref<EthnicBackground | null>(null)
    const primaryLanguage = ref<Language | null>(null)
    const secondaryLanguage = ref<Language | null>(null)
    const livingIsrael = ref<Importance | null>(null)
    const primaryPersonalityTrait = ref<string>('')
    const secondaryPersonalityTrait = ref<string>('')
    const wearSkirts = ref<boolean>(false)
    const coveringHair = ref<boolean>(false)

    const isOrthodox = computed((): boolean => {
      return props.profile.religiousAffiliation === ReligiousAffiliation.Orthodox
    })

    const isFemaleOrthodox = computed((): boolean => {
      const { religiousAffiliation, gender } = props.profile
      return religiousAffiliation === ReligiousAffiliation.Orthodox && gender === Gender.FEMALE
    })

    const hashkafaOptions = computed((): InputOption[] => {
      const options: InputOption[] = [
        { value: null, text: t('dating-profile-edit.select-one').toString() }
      ]
      Object.keys(Hashkafa).map(key => {
        options.push({ value: key, text: t(`dating-profile-edit.background.${key}`).toString() })
      })
      return options
    })

    const ethnicBackgroundOptions = computed((): InputOption[] => {
      const options: InputOption[] = [
        { value: null, text: t('dating-profile-edit.select-one').toString() }
      ]
      Object.keys(EthnicBackground).map(key => {
        options.push({ value: key, text: t(`dating-profile-edit.background.${key}`).toString() })
      })
      return options
    })

    const languageOptions = computed((): InputOption[] => {
      const options: InputOption[] = [
        { value: null, text: t('dating-profile-edit.select-one').toString() }
      ]
      Object.keys(Language).map(key => {
        options.push({ value: key, text: t(`dating-profile-edit.background.language.${key}`).toString() })
      })
      return options
    })

    const importanceOptions = computed((): InputOption[] => {
      const options: InputOption[] = [
        { value: null, text: t('dating-profile-edit.select-one').toString() }
      ]
      Object.keys(Importance).map(key => {
        options.push({ value: key, text: t(`dating-profile-edit.background.${key}`).toString() })
      })
      return options
    })

    const personalityTraitOptions = computed((): InputOption[] => {
      const options: InputOption[] = [
        { value: null, text: t('dating-profile-edit.select-one').toString() }
      ]
      Object.keys(PersonalityTrait).map(key => {
        options.push({ value: key, text: t(`dating-profile-edit.background.${key}`).toString() })
      })
      return options
    })

    const handleDatingProfileUpdate = async (key: string) => {
      if (key === 'torahObservantSince') {
        const today = (new Date()).toISOString().split('T')[0]
        if (torahObservantSince.value < '1970-01-01' || torahObservantSince.value > today) {
          torahObservantSince.value = props.datingProfile.torahObservantSince
          return
        }
      }
      const payload = {
        id: props.datingProfile.id,
        profileId: props.profile.id,
        ...(key === 'hashkafa' ? { hashkafa: hashkafa.value } : {}),
        ...(key === 'torahObservantSince' ? { torahObservantSince: torahObservantSince.value } : {}),
        ...(key === 'ethnicBackground' ? { ethnicBackground: ethnicBackground.value } : {}),
        ...(key === 'primaryLanguage' ? { primaryLanguage: primaryLanguage.value } : {}),
        ...(key === 'secondaryLanguage' ? { secondaryLanguage: secondaryLanguage.value } : {}),
        ...(key === 'livingIsrael' ? { livingIsrael: livingIsrael.value } : {}),
        ...(key === 'primaryPersonalityTrait' ? { primaryPersonalityTrait: primaryPersonalityTrait.value } : {}),
        ...(key === 'secondaryPersonalityTrait' ? { secondaryPersonalityTrait: secondaryPersonalityTrait.value } : {}),
        ...(key === 'wearSkirts' ? { wearSkirts: wearSkirts.value } : {}),
        ...(key === 'coveringHair' ? { coveringHair: coveringHair.value } : {}),
      }
      await store.dispatch('profile/updateDatingProfile', payload)
    }

    onMounted(() => {
      if (props.datingProfile) {
        hashkafa.value = props.datingProfile.hashkafa
        torahObservantSince.value = props.datingProfile.torahObservantSince
        ethnicBackground.value = props.datingProfile.ethnicBackground
        primaryLanguage.value = props.datingProfile.primaryLanguage
        secondaryLanguage.value = props.datingProfile.secondaryLanguage
        livingIsrael.value = props.datingProfile.livingIsrael
        primaryPersonalityTrait.value = props.datingProfile.primaryPersonalityTrait
        secondaryPersonalityTrait.value = props.datingProfile.secondaryPersonalityTrait
        wearSkirts.value = props.datingProfile.wearSkirts
        coveringHair.value = props.datingProfile.coveringHair
      }
    })

    return {
      coveringHair,
      ethnicBackground,
      ethnicBackgroundOptions,
      handleDatingProfileUpdate,
      hashkafa,
      hashkafaOptions,
      importanceOptions,
      isFemaleOrthodox,
      isOrthodox,
      languageOptions,
      livingIsrael,
      personalityTraitOptions,
      primaryLanguage,
      primaryPersonalityTrait,
      secondaryLanguage,
      secondaryPersonalityTrait,
      torahObservantSince,
      wearSkirts,
    }
  }
})
</script>

<style lang="scss" scoped>
@import './style.module.scss';
</style>
