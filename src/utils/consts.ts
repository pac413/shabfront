import { type IPreferenceFragmentFragment } from '@/composables/graphql/generated'

export const ENV = {
  LOCAL_SERVER_ADDRESS: 'http://localhost:8080/',
}

export const PROFILE_LIST_PAGE_SIZE = 30

export const MIN_AGE = 18
export const MAX_AGE = 80
export const INITIAL_MIN_SEARCH_AGE = 18
export const INITIAL_MAX_SEARCH_AGE = 80
export const INITIAL_MIN_DATING_AGE = 18
export const INITIAL_MAX_DATING_AGE = 42
export const MIN_PROXIMITY = 1
export const MAX_PROXIMITY = 250
export const DEFAULT_ME_PROXIMITY = 5
export const DEFAULT_LOCATION_PROXIMITY = 20

export const SortByModalOptions = [
  {
    value: 'proximity',
    text: 'proximity',
  },
  {
    value: 'dateActive',
    text: 'active-on-shabbat',
  },
  {
    value: 'firstNameAsc',
    text: 'first-name-asc',
  },
  {
    value: 'firstNameDesc',
    text: 'first-name-desc',
  },
  {
    value: 'lastNameAsc',
    text: 'last-name-asc',
  },
  {
    value: 'lastNameDesc',
    text: 'last-name-desc',
  },
  // {
  //   value: 'mostInvites',
  //   text: 'most-invites'
  // }
]

export const PreferenceSearchModeKeys: Array<keyof IPreferenceFragmentFragment> = [
  'type',
  'name',
  'city',
  'state',
  'country',
  'occupation',
]

export enum ProfileOverlayItem {
  FRIEND = 'friend',
  BLOCK = 'block',
  MESSAGE = 'message',
  DATING = 'dating',
  INVITE = 'invite',
  FOLLOW = 'follow',
  REPORT = 'report',
  GUEST = 'guest',
}

export const INFINITE_SCROLL_DISTANCE = 10
export const INFINITE_SCROLL_THROTTLE_DELAY = 200
export const MESSAGE_READ_TIME = 1000

export const MOMENT_DATE_FORMAT = 'YYYY-MM-DD'

export const MESSAGE_TYPING_THROTTLE_WAIT = 2000
export const MESSAGE_TYPING_CHECK_INTERVAL = 500

export enum Country {
  ISRAEL = 'Israel',
  UNITED_STATES = 'United States',
  CANADA = 'Canada',
}

export enum ZmanimKeys {
  candlelighting = 'candlelighting',
  havdola = 'havdola',
  havdolaRabeinuTam = 'havdolaRabeinuTam',
}

export enum ImageSize {
  minimum = 200,
  maximum = 8192,
}

export enum ImageRatio {
  avatar = 1,
  wallpaper = 2.701587301587302,
}

export const VideoSize = {
  maximum: 10, // 10gb
}

export const TextMaxSize = 500
export const MinimalTextMaxSize = 90

export const SCROLL_PERCENT_FOR_RELOAD = 0.8

export enum ConnectionTypes {
  friends = 'friends',
  followers = 'followers',
  followings = 'followings',
}

export const DONATE_SHABBAT_LINK = import.meta.env.VITE_APP_DONATE_LINK
export const BLOG_SHABBAT_LINK = 'https://blog.shabbat.com'
export const DEFAULT_SHABBAT_WALLPAPER_LINK = 'https://shabbat-com.s3.us-east-2.amazonaws.com/background.jpeg'
export const SHABBAT_MOBILE_APP_LINK = {
  ios: 'https://apps.apple.com/app/id1037705799',
  android: 'https://play.google.com/store/apps/details?id=com.tribex.shabbat',
}

export const DEFAULT_TITLE = 'The Jewish Social Network helping to connect the Jewish people.'
export const DEFAULT_META_OPTIONS = [
  {
    property: 'description',
    content: 'Shabbat.com - The Jewish Social Network helping to connect the Jewish people from around the world.',
  },
  {
    property: 'keywords',
    content: 'Jewish Social Network, Social Networking, Shabbat, Shabbat hospitality, Shabbaton, Jewish, Shabbat',
  },
  { vmid: 'fb_url_meta', property: 'og:url', content: 'www.shabbat.com' },
  { vmid: 'fb_sitename_meta', property: 'og:site_name', content: 'Shabbat.com' },
  { vmid: 'fb_title_meta', property: 'og:title', content: 'Shabbat.com' },
  {
    vmid: 'fb_description_meta',
    property: 'og:description',
    content: 'Shabbat.com - The Jewish Social Network helping to connect the Jewish people from around the world.',
  },
  { vmid: 'fb_type_meta', property: 'og:type', content: 'website' },
  {
    vmid: 'fb_image_meta',
    property: 'og:image',
    content: 'https://shabbat-com-assets.s3.us-east-2.amazonaws.com/shabbat-share-2-0.jpg',
  },
  { vmid: 'fb_image_width_meta', property: 'og:image:width', content: '1200' },
  { vmid: 'fb_image_height_meta', property: 'og:image:height', content: '630' },
  { vmid: 'fb_appid_meta', property: 'fb:app_id', content: '102813819773375' },
]

export const GOOGLE_API_KEY = import.meta.env.VITE_APP_GOOGLE_API_KEY
