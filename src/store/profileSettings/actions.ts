import type { ActionTree } from 'vuex'

import {
  updateProfileSettingsBooleans,
  updateProfileSettingsFeedContent,
  updateProfileSettingsMessagingPrivacyTier,
  updateProfileSettingsPostPrivacy,
} from '@/graphql/mutations'
import { getProfileSettings } from '@/graphql/queries'
import { mutateApollo, queryApollo } from '@/plugins/vue-apollo'
import type { RootState } from '@/store/types'

import { ProfileSettingsMap, type ProfileSettingsState } from './types'

const isCurrentProfileSettings = (rootState: RootState, responseProfileId: string) => {
  const { currentProfile } = rootState.profile
  const currentProfileId = currentProfile ? currentProfile.id : rootState.auth.profileId

  return currentProfileId === responseProfileId
}

const actions: ActionTree<ProfileSettingsState, RootState> = {
  async getActiveProfileSettings({ commit, rootState }) {
    try {
      const response = await queryApollo({
        query: getProfileSettings,
        fetchPolicy: 'network-only',
        variables: {},
      })
      const { profileId, settings } = response.data.profileSettings
      if (isCurrentProfileSettings(rootState, profileId)) {
        commit('SET_PROFILE_SETTINGS', settings)
      }
    } catch (error) {
      return { error }
    }
  },

  async getCurrentProfileSettings({ commit, rootState }, params) {
    const { profileId } = params
    try {
      const response = await queryApollo({
        query: getProfileSettings,
        fetchPolicy: 'network-only',
        variables: { profileId },
      })
      const { profileId: responseProfileId, settings } = response.data.profileSettings
      if (isCurrentProfileSettings(rootState, responseProfileId)) {
        commit('SET_PROFILE_SETTINGS', settings)
      }
    } catch (error) {
      return { error }
    }
  },

  async updateProfileSettings({ commit, rootState }, params) {
    const { profileId, setting, value } = params
    let response

    let gql
    let responseFieldName
    let variables

    if (setting === 'messagingPrivacy') {
      gql = updateProfileSettingsMessagingPrivacyTier
      responseFieldName = 'updateProfileSettingsMessagingPrivacyTier'
      variables = { profileId, value }
    } else if (setting === 'postPrivacy') {
      gql = updateProfileSettingsPostPrivacy
      responseFieldName = 'updateProfileSettingsPostPrivacy'
      variables = { profileId, value }
    } else if (setting === 'feedContent') {
      gql = updateProfileSettingsFeedContent
      responseFieldName = 'updateProfileSettingsFeedContent'
      variables = { profileId, value }
    } else {
      gql = updateProfileSettingsBooleans
      responseFieldName = 'updateProfileSettingsBooleans'
      const settingName = ProfileSettingsMap[setting]
      variables = { profileId, setting: settingName, value }
    }

    try {
      response = await mutateApollo({
        mutation: gql,
        fetchPolicy: 'no-cache',
        variables,
      })
    } catch (error) {
      return { error }
    }

    const { profileId: responseProfileId, settings } = response.data[responseFieldName]

    if (isCurrentProfileSettings(rootState, responseProfileId)) {
      commit('SET_PROFILE_SETTINGS', settings)
    }

    return response.data[responseFieldName]
  },
}
export default actions
