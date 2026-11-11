import { type Suggestion } from './Suggestion'

export interface GuestSuggestion extends Suggestion {
  status: string
  availabilitySentence: string
}
