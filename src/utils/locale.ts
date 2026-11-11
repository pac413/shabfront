import languages from '@/assets/js/languages'
import type { SelectedLanguage } from '@/types'

export const getLocaleObject = () => {
  const lang = localStorage.getItem('language')
  if (lang) {
    return JSON.parse(lang)
  }

  const browserLocale = navigator.language.split('-')[0]
  const detectedLanguage = languages.find((lang) => lang.locale === browserLocale)
  if (detectedLanguage) {
    return {
      locale: detectedLanguage.locale,
      text: detectedLanguage.text,
    }
  }

  return { text: 'English', locale: 'en' }
}

export const getLocale = () => {
  const langObj = getLocaleObject()
  return langObj.locale
}

export const setLocaleObject = (localeObj: SelectedLanguage) => {
  localStorage.setItem('language', JSON.stringify(localeObj))
}
