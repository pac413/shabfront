import confirmEmail from './auth/mutations/confirmEmail'
import deleteMyAccount from './auth/mutations/deleteMyAccount'
import updateAccountEmail from './auth/mutations/updateAccountEmail'
import updateAccountPassword from './auth/mutations/updateAccountPassword'
import acceptDatingProfileRequest from './datingProfile/acceptDatingProfileRequest'
import downloadDatingProfile from './datingProfile/downloadDatingProfile'
import emailDatingProfile from './datingProfile/emailDatingProfile'
import requestDatingProfile from './datingProfile/requestDatingProfile'
import updateDatingProfile from './datingProfile/updateDatingProfile'
import confirmAndProcessUploadedMedia from './media/mutations/confirmAndProcessUploadedMedia'
import deleteMedia from './media/mutations/deleteMedia'
import getMediaUploadUrl from './media/mutations/getMediaUploadUrl'
import updateMedia from './media/mutations/updateMedia'
import updateNotificationStatus from './notification/mutations/updateNotificationStatus'
import {
  updateProfileSettingsBooleans,
  updateProfileSettingsFeedContent,
  updateProfileSettingsMessagingPrivacyTier,
  updateProfileSettingsPostPrivacy,
} from './profileSettings/mutations'
import addReference from './reference/addReference'
import approveReferencesRequest from './reference/approveReferencesRequest'
import deleteReference from './reference/deleteReference'
import requestReference from './reference/requestReference'
import updateReference from './reference/updateReference'

export * from './friends/mutations'
export * from './guestProfile/mutations'
export * from './hostProfile/mutations'
export * from './preference/mutations'
export * from './profile/mutations'

export {
  confirmAndProcessUploadedMedia,
  getMediaUploadUrl,
  deleteMedia,
  updateMedia,
  updateNotificationStatus,
  addReference,
  updateReference,
  deleteReference,
  requestReference,
  approveReferencesRequest,
  updateDatingProfile,
  requestDatingProfile,
  emailDatingProfile,
  downloadDatingProfile,
  acceptDatingProfileRequest,
  confirmEmail,
  updateAccountEmail,
  updateAccountPassword,
  deleteMyAccount,
  updateProfileSettingsBooleans,
  updateProfileSettingsMessagingPrivacyTier,
  updateProfileSettingsPostPrivacy,
  updateProfileSettingsFeedContent,
}
