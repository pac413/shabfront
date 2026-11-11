import { type MediaState } from './types'

export const getInitialState: () => MediaState = () => ({
  mediaDataById: {},
})

const state: MediaState = getInitialState()

export default state
