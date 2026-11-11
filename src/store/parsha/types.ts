import { type ParshaAudio } from '@/types'

export interface ParshaState {
  selectedParshaId?: string
  parshaList: ParshaAudio[]
  loading: boolean
}
