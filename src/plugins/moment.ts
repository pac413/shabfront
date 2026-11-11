import moment from 'moment'

import { getLocaleObject } from '@/utils'

export const setLocale = (locale: string) => {
  return moment.locale(locale)
}

setTimeout(() => {
  const localeObj = getLocaleObject()
  setLocale(localeObj.locale)
})

export default moment
