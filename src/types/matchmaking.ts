import { type DatingSearchFilterBy, type MatchmakingFilterKey, MatchmakingType, type Profile } from './payloads'

export type MatchmakingFilerValue = string | number | boolean | object

export type MatchmakingFilterOption = Pick<DatingSearchFilterBy, MatchmakingFilterKey>

export type MatchmakingBoolean = {
  [key in MatchmakingType]: boolean
}

export type MatchmakingNumber = {
  [key in MatchmakingType]: number
}

export type MatchmakingProfile = {
  [key in MatchmakingType]: Profile | null
}

export type MatchmakingOptions = {
  [key in MatchmakingType]: MatchmakingFilterOption
}

export const InitialMatchmakingBoolean: MatchmakingBoolean = {
  [MatchmakingType.Guys]: false,
  [MatchmakingType.Girls]: false,
}

export const InitialMatchmakingNumber: MatchmakingNumber = {
  [MatchmakingType.Guys]: 0,
  [MatchmakingType.Girls]: 0,
}

export const InitialMatchmakingProfile: MatchmakingProfile = {
  [MatchmakingType.Guys]: null,
  [MatchmakingType.Girls]: null,
}

export const InitialMatchmakingOptions: MatchmakingOptions = {
  [MatchmakingType.Guys]: {},
  [MatchmakingType.Girls]: {},
}

export const InitialMatchmakingFilters: MatchmakingFilterOption = {
  proxRadius: 20,
  filterAgeFrom: 18,
  filterAgeTo: 42,
}
