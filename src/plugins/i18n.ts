import { createI18n } from 'vue-i18n'

import de from '../locales/de.json'
import en from '../locales/en.json'
import es from '../locales/es.json'
import fr from '../locales/fr.json'
import he from '../locales/he.json'
import pt from '../locales/pt.json'
import ru from '../locales/ru.json'

function setDetectedLanguage() {
  const lang = navigator.language

  if (lang === 'en-US') {
    return 'en'
  }
  return lang
}

const i18n = createI18n<[typeof en], 'en' | 'de' | 'es' | 'fr' | 'he' | 'pt' | 'ru'>({
  locale: setDetectedLanguage(),
  legacy: false,
  allowComposition: true,
  fallbackLocale: import.meta.env.VITE_APP_I18N_FALLBACK_LOCALE || 'en',
  messages: {
    de,
    en,
    es,
    fr,
    he,
    pt,
    ru,
  },
})

export default i18n
