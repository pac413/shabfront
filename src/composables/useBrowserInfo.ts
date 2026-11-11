import UAParser from 'ua-parser-js'

export const useBrowserInfo = () => {
  const parser = new UAParser(window.navigator.userAgent)
  return parser.getBrowser()
}
