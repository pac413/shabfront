import languages from '@/assets/js/languages'
import { type ILocation } from '@/composables/graphql/generated'
import { type Location, type SelectedLanguage, type SupportedLocale } from '@/types'

import { Country } from './consts'

export const buildDirectionsUrl = (location: Location): string => {
  return (
    'https://www.google.com/maps/dir/Current+Location/' +
      (location.address && location.address.replace(' ', '+')) +
      (location.city && ',' + location.city.replace(' ', '+')) +
      (location.state && ', ' + location.state.replace(' ', '+')) ||
    '' + (location.zipcode && location.zipcode.length && '+' + location.zipcode) ||
    ''
  )
}

export const getLocationDisplay = (location: Location | ILocation): string => {
  if (!location) {
    return ''
  }
  const locationParts: string[] = [location.city]
  if (location.country === Country.UNITED_STATES || location.country === Country.CANADA) {
    locationParts.push(location.state || location.country)
  } else if (location.country) {
    locationParts.push(location.country)
  }
  return locationParts.filter((part) => part).join(', ')
}

export const getLanguageByLocale = (locale: SupportedLocale): SelectedLanguage => {
  const matched = languages.find((lang) => lang.locale === locale)

  if (matched) {
    return matched as SelectedLanguage
  }

  // English by default
  return languages[0] as SelectedLanguage
}
