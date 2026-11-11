import { type ParshaState } from './types'

export const getInitialState: () => ParshaState = () => ({
  parshaList: [],
  selectedParshaId: undefined,
  loading: false,
})

const state: ParshaState = getInitialState()

export default state
