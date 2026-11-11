<template>
  <div>
    <BDropdown
      :variant="variant"
      size="sm"
      right
      toggle-class="dropdown-none"
    >
      <template #button-content>
        <language-flag-icon :locale="selectedLanguage.locale" />
        {{ selectedLanguage.text }}
      </template>
      <BDropdownItem
        v-for="lang in languages"
        :key="lang.locale"
        @click="onSelectLang(lang)"
      >
        <div class="d-flex flex-row justify-content-between align-items-center">
          {{ lang.text }}
          <img
            :src="lang.flag"
            class="language-flag-img"
          >
        </div>
      </BDropdownItem>
    </BDropdown>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'

import languages, { type SupportedLanguage } from '@/assets/js/languages'
import LanguageFlagIcon from '@/components/Common/LanguageFlagIcon.vue'
import i18n from '@/plugins/i18n'
import { setLocale } from '@/plugins/moment'
import { triggerReconnectWebsocket } from '@/plugins/vue-apollo'
import { useGlobalStore } from '@/stores/global'

export default defineComponent({
  name: 'SelectLanguage',
  components: { LanguageFlagIcon },
  props: {
    variant: {
      type: String as () => 'danger' | 'light',
      default: 'danger',
    },
  },
  setup() {
    const globalStore = useGlobalStore()
    const selectedLanguage = computed(() => globalStore.language)
    const onSelectLang = async (lang: SupportedLanguage) => {
      if (lang.locale === selectedLanguage.value.locale) {
        return
      }
      i18n.global.locale.value = lang.locale
      await globalStore.setLanguage(lang)
      setLocale(lang.locale)
      triggerReconnectWebsocket()
    }

    return {
      languages,
      onSelectLang,
      selectedLanguage
    }
  }
})
</script>

<style scoped lang="scss">
.language-flag-img {
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

:deep(.dropdown-none)::after {
  content: none !important;
}

:deep(button),
:deep(.dropdown-item) {
  @media (max-width: $mobileMaxWidth) {
    font-size: 14px;
  }

  @media (max-width: $mobileSmallMaxWidth) {
    font-size: 12px;
  }
}
</style>
