import { computed } from 'vue'

import { useGlobalStore } from '@/stores/global'

export const useIsRtl = () => {
  const globalStore = useGlobalStore()
  const isRtl = computed(() => globalStore.language.locale === 'he')
  
  return { isRtl }
}
