import styles from '@/assets/styles/variables/export.module.scss'

export const getStyleVariable = (name: string, defaultValue?: string) => {
  return styles[name] || defaultValue
}

export const getStyleNumberVariable = (name: string, defaultValue?: number) => {
  const value = getStyleVariable(name)
  return value ? parseInt(value) : defaultValue
}
