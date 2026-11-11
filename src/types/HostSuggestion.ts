import { type Suggestion } from './Suggestion'

export interface HostSuggestion extends Suggestion {
  status: string
  reserveBy: string
}
