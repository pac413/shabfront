import { ApolloError } from '@apollo/client/errors'
import { defineStore } from 'pinia'
import type { RouteLocationNormalized } from 'vue-router'

import { updateProfilePrimaryLocale } from '@/graphql/mutations'
import type { SelectedLanguage } from '@/types'
import { getLocaleObject, getToken } from '@/utils'

interface GlobalState {
  language: SelectedLanguage
  navigatingRoute: RouteLocationNormalized | null
  showBackdrop: boolean
  mainHeaderHeight: number
}

export const useGlobalStore = defineStore('global', {
  state: (): GlobalState => ({
    language: getLocaleObject(),
    navigatingRoute: null,
    showBackdrop: false,
    mainHeaderHeight: 0,
  }),
  actions: {
    async setLanguage(selectedLanguage: SelectedLanguage) {
      this.language = selectedLanguage

      // This is temporary solution to update the language in the backend.
      // if (rootState.auth.authenticated) {
      if (getToken()) {
        try {
          await updateProfilePrimaryLocale({ primaryLocale: selectedLanguage.locale })
        } catch (error) {
          if (error instanceof ApolloError) {
            if (error.networkError && 'statusCode' in error.networkError && error.networkError.statusCode === 401) {
              // This means that it's good to ignore.
              return
            }
          }
          throw error
        }
      }
    },
    reset() {
      this.navigatingRoute = null
      this.showBackdrop = false
      this.mainHeaderHeight = 0
    }
  }
})
