<template>
  <img
    v-if="currentFlag"
    :src="currentFlag"
    class="language-flag-icon"
  >
  <FaIcon
    v-else
    :icon="['fal', 'globe-americas']"
    class="me-1"
  />
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import languages from '@/assets/js/languages'
import { type SupportedLocale } from '@/types'

export default defineComponent({
  name: 'LanguageFlagIcon',
  props: {
    locale: {
      type: String as  () => SupportedLocale,
      required: true
    }
  },
  setup(props) {
    const currentFlag = computed((): string | undefined => {
      const currentLang = languages.find((lang) => lang.locale === props.locale)
      return currentLang?.flag
    })
    return {
      currentFlag
    }
  }
})
</script>

<style scoped lang="scss">
.language-flag-icon {
  width: 20px;
  height: 15px;
  object-fit: fill;

  @media (max-width: $mobileMaxWidth) {
    width: 18px;
    height: 14px;
  }

  @media (max-width: $mobileSmallMaxWidth) {
    width: 16px;
    height: 12px;
  }
}
</style>
