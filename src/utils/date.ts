import { type MomentInput } from 'moment'

import shabbatYomTovDates from '@/assets/js/dates'
import languages from '@/assets/js/languages'
import i18n from '@/plugins/i18n'
import moment from '@/plugins/moment'
import { useGlobalStore } from '@/stores/global'
import { HostingPart, ReligiousAffiliation } from '@/types'

import { MOMENT_DATE_FORMAT } from './consts'

export const isDateValid = (dateString: string) => {
  const date = new Date(dateString)
  if (date <= new Date('1900-01-01')) {
    return false
  }
  return true
}

export const calculateAge = (birthday: string) => {
  const birthDate = new Date(birthday)
  const ageDifMs = Date.now() - birthDate.getTime()
  const ageDate = new Date(ageDifMs)
  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

export const generateDateDiffString = (date: MomentInput) => {
  const momentDate = moment(date)
  const todayMoment = moment()
  const dayDiff = todayMoment.diff(momentDate, 'day')
  let dateStr = ''
  if (dayDiff > 365) {
    dateStr = momentDate.format('MMMM YYYY')
  } else if (dayDiff > 7) {
    dateStr = momentDate.format('MMMM D')
  } else {
    if (dayDiff === 0) {
      dateStr = i18n.global.t('general.today').toString()
    } else if (dayDiff === 1) {
      dateStr = i18n.global.t('general.yesterday').toString()
    } else {
      dateStr = momentDate.format('dddd')
    }
  }
  return dateStr
}

export const upcomingShabbatOrYomTov = () => {
  const futureDates = shabbatYomTovDates.map((item) => moment(item.date)).filter((date) => date.isAfter(moment.now()))
  return moment.min(futureDates).format(MOMENT_DATE_FORMAT)
}

export const isPast = (date: string) => {
  return moment().isSameOrAfter(date)
}

export const getHostingPartsByDate = (date: string) => {
  const selectedDate = shabbatYomTovDates.find((item) => item.date === date)
  if (!selectedDate) {
    return []
  }

  if (!selectedDate.isYomTov) {
    return [HostingPart.NIGHT, HostingPart.DAY, HostingPart.THIRD, HostingPart.MELAVE_MALKA, HostingPart.LODGING]
  } else {
    return [HostingPart.NIGHT, HostingPart.DAY, HostingPart.LODGING]
  }
}

export const getAgoString = (date: MomentInput, abbreviate = false): string => {
  const globalStore = useGlobalStore()
  const lang = globalStore.language.locale
  const timeout = moment.utc(date)
  if (abbreviate && lang === 'en') {
    return moment(timeout).locale('en-abbrv').fromNow(true)
  }
  return moment.utc(moment.now()).locale(lang).to(timeout)
}

export const defineAbbreviatedLocale = () => {
  moment.defineLocale('en-abbrv', {
    parentLocale: 'en',
    relativeTime: {
      future: 'in %s',
      past: (number) => (number === 'just now' ? number : `${number} ago`),
      s: 'just now',
      ss: '%ss',
      m: 'a minute',
      mm: '%dm',
      h: 'an hour',
      hh: '%dh',
      d: 'a day',
      dd: '%dd',
      M: 'a month',
      MM: '%dM',
      y: 'a year',
      yy: '%dY',
    },
  })

  languages.forEach((lang) => {
    moment.updateLocale(lang.locale, {
      relativeTime: {
        future: () => '',
        past: (number) =>
          number === i18n.global.t('moment.just-now').toString()
            ? number
            : `${number} ${i18n.global.t('moment.ago').toString()}`,
        s: i18n.global.t('moment.just-now').toString(),
      },
    })
  })
}

export const getConciseTimeDisplay = (date: MomentInput, lang = 'en', showDate = false): string => {
  // get from-now for this date
  const fromNow = getAgoString(date)

  // ensure the date is displayed with today and yesterday
  return moment(date)
    .locale(lang)
    .local()
    .calendar(null, {
      // when the date is closer, specify custom values
      lastWeek: showDate ? 'L LT' : 'LT',
      lastDay: showDate ? 'L LT' : 'LT',
      sameDay: (mom, now) => {
        if (moment(mom).isBefore(moment(now).add(-1, 'hours'))) {
          return 'LT'
        }
        return `[${fromNow}]`
      },
      // when the date is further away, use from-now functionality
      sameElse: function () {
        return showDate ? 'L LT' : 'LT'
      },
    })
}

export const groupedDateDisplay = (date: MomentInput, lang = 'en'): string => {
  // get from-now for this date
  const fromNow = getAgoString(date)

  // ensure the date is displayed with today and yesterday
  return moment(date)
    .locale(lang)
    .local()
    .calendar(undefined, {
      // when the date is closer, specify custom values
      lastWeek: i18n.global.t('messages.calendar-last-week').toString(),
      lastDay: i18n.global.t('messages.calendar-last-day').toString(),
      sameDay: i18n.global.t('messages.calendar-same-day').toString(),
      // when the date is further away, use from-now functionality
      sameElse: function () {
        return '[' + fromNow + ']'
      },
    })
}

// If user is English speaking and not Orthodox, display parsha in English. Otherwise, Hebrew
export const getParshaText = (date: string, lang = 'en', affiliation: string | null) => {
  const selectedDate = shabbatYomTovDates.find((item) => item.date === date)
  if (!selectedDate) {
    return date
  }
  const isOrthodox = affiliation === ReligiousAffiliation.Orthodox
  const displayHebrew = lang === 'he' || isOrthodox
  let result = ''

  if (displayHebrew) {
    if (selectedDate.isYomTov) {
      result = selectedDate.isYomTovIsrael ? selectedDate.yomTov!.heIsrael! : selectedDate.yomTov!.heDiaspora
    } else {
      result = ' שבת פרשת ' + selectedDate.parsha!['he']
    }
  } else {
    if (selectedDate.isYomTov) {
      result = selectedDate.isYomTovIsrael ? selectedDate.yomTov!.enIsrael! : selectedDate.yomTov!.enDiaspora
    } else {
      result = 'Shabbat ' + selectedDate.parsha!['en']
    }
  }

  return result
}

export const getParshaDate = (date: string, lang = 'en') => moment(date).locale(lang).format('MMM DD, YYYY')

export const getShortDate = (date: string) => moment.utc(date).format('YYYY-MM-DD')

export const getCurrentDate = () => moment().format('YYYY-MM-DD')

export const getMessageDate = (date: string, unreadText?: string) =>
  date ? moment(date).format('MMM DD, YYYY hh:mm A') : unreadText

export const getActiveOrSinceNotation = (createdAt: Date, dateActive: Date, dateToUse?: 'createdAt' | 'dateActive') => {
  const sinceString = i18n.global
    .t('profile.since', {
      date: generateDateDiffString(createdAt.toString()),
    })
    .toString()
  const activeString = i18n.global
    .t('profile.active', {
      date: generateDateDiffString(dateActive.toString()),
    })
    .toString()
  switch (dateToUse) {
  case 'createdAt':
    return sinceString
  case 'dateActive':
    return activeString
  default:
    return (+new Date() - +new Date(createdAt)) / (1000 * 3600 * 24 * 365) > 1 ? sinceString : activeString
  }
}
