import { computed } from 'vue'
import { useStore } from 'vuex'

import {
  type IFeatureFlagsFragmentFragment,
  useFeatureFlagsQuery,
  useGlobalFeatureFlagsQuery,
} from '@/composables/graphql/generated'
import { storeKey } from '@/store'

export const useFeatureEnabled = () => {
  const { result: globalFeatureFlagsResult } = useGlobalFeatureFlagsQuery()
  const { result: featureFlagsResult } = useFeatureFlagsQuery()
  const store = useStore(storeKey)

  const featureFlags = computed(() => featureFlagsResult.value?.featureFlags)
  const globalFeatureFlags = computed(() => globalFeatureFlagsResult.value?.globalFeatureFlags)

  const isFeatureEnabled = (feature: keyof IFeatureFlagsFragmentFragment): boolean => {
    if (store.state.auth.authenticated) {
      return featureFlags.value ? !!featureFlags.value[feature] : false
    }
    return globalFeatureFlags.value ? !!globalFeatureFlags.value[feature] : false
  }

  return { isFeatureEnabled }
}
