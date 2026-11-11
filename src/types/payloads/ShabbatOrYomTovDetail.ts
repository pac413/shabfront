export interface ShabbatOrYomTovDetail {
  date: string
  isYomTov: boolean
  isYomTovIsrael: boolean
  hebrewDate: {
    en: string
    he: string
  }
  parsha?: {
    en: string
    he: string
  }
  yomTov?: {
    enDiaspora: string
    heDiaspora: string
    enIsrael?: string
    heIsrael?: string
  }
}
