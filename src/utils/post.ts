import { find } from 'linkifyjs'

export const extractLinks = (text: string) => {
  return find(text)
}
