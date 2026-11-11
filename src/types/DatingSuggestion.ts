import type { Suggestion } from './Suggestion'

export interface DatingSuggestion extends Suggestion {
  age: number
  occupation: string
}
