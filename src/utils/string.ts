import { words } from 'lodash'

export const generateGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export const getInitials = (name: string, length = 2): string => {
  return words(name)
    .map((word) => word[0])
    .slice(0, length)
    .join('')
    .toUpperCase()
}

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export const replaceTextNewLineWithBr = (text: string | null) => {
  if (!text) {
    return text
  }
  // Keep the new line characters added
  const newText = text.replace(new RegExp(/(\r\n|\r|\n)/, 'g'), '<br/>')
  return newText
}

export const escapeHtml = (html: string): string => {
  return html
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export const generatePasscode = (length = 4) => {
  const chars = '0123456789'
  let passcode = ''
  for (let i = 0; i < length; i++) {
    const rnum = Math.floor(Math.random() * chars.length)
    passcode += chars[rnum]
  }
  return passcode
}
