import { computed } from 'vue'
import { useStore } from 'vuex'

import { storeKey } from '@/store'
import { useGlobalStore } from '@/stores/global'
import { getParshaDate, getParshaText } from '@/utils'

export const useLocalizedDateDisplayText = () => {
  const store = useStore(storeKey)
  const globalStore = useGlobalStore()
  const activeProfile = computed(() => store.state.profile.activeProfile)
  const language = computed(() => globalStore.language)

  const localizeDateDisplayText = (date: string) => {
    if (!date || !activeProfile.value) {
      return ''
    }
    return (
      getParshaText(date, language.value.locale, activeProfile.value.religiousAffiliation) +
      ' - ' +
      getParshaDate(date, language.value.locale)
    )
  }

  return {
    localizeDateDisplayText,
  }
}
