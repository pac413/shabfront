import { type Store } from 'vuex'

import type { RootState } from './store/types'

declare module '@vue/runtime-core' {
  import type { ComponentCustomProperties } from 'vue'

  interface ComponentCustomProperties {
    $store: Store<RootState>
  }
}
