import type { MutationTree } from 'vuex'

import type { IProfileSettings } from '@/composables/graphql/generated'

import type { ProfileSettingsState } from './types'

const mutations: MutationTree<ProfileSettingsState> = {
  SET_PROFILE_SETTINGS(state: ProfileSettingsState, settings: IProfileSettings) {
    state.currentSettings = settings
  },
}
export default mutations
