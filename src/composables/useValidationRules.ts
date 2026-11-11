import { useI18n } from 'vue-i18n'
import { number, string } from 'yup'

export const useValidationRules = () => {
  const { t } = useI18n()
  
  const emailRules = string()
    .required(t('validations.messages.required', { field: 'email' }))
    .email(t('validations.messages.email'))
  const fullNameRules = string()
    .required(t('validations.messages.required', { field: 'full name' }))
    .min(4, t('validations.messages.full_name_min'))
  const messageRules = string()
    .required(t('validations.messages.required', { field: 'message' }))
    .min(4, t('validations.messages.message_min'))
  const passwordRules = string()
    .required(t('validations.messages.required', { field: 'password' }))
    .min(6, t('validations.messages.password_min'))

  return {
    emailRules,
    fullNameRules,
    messageRules,
    passwordRules,
  }
}

export const useStringRequiredRule = (field: string) => {
  const { t } = useI18n()
  return string()
    .required(t('validations.messages.required', { field }))
    .test(field, t('validations.messages.required', { field }), (value) => (value ?? '').replace(/\s/g, '').length > 0)
}

export const useNumberRequiredRule = (field: string) => {
  const { t } = useI18n()
  return number().integer().required(t('validations.messages.required', { field }))
}
