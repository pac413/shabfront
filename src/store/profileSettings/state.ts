import type { ProfileSettingsState } from './types'

export const getInitialState: () => ProfileSettingsState = () => ({
  currentSettings: null,
})

const state: ProfileSettingsState = getInitialState()

export default state
