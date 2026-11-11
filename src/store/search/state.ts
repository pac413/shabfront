import { type SearchState } from './types'

export const getInitialState: () => SearchState = () => ({
  profilesSelection: {},
})

const state: SearchState = getInitialState()

export default state
