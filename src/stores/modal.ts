import { defineStore } from 'pinia'

import {
  type IAdminRecentMemberFragmentFragment,
  type IEndorsement,
  type IEndorsementSiteRole,
  type IFlaggedContentFragmentFragment,
  type IFlaggedContentType,
  type IHostingType,
  type IProfileFragmentFragment,
  type ISimpleProfile,
} from '@/composables/graphql/generated'
import { type FeedItem, type InviteDetail, type InviteType, type Message, type Profile } from '@/types'

export enum Modal {
  ADMIN_MEMBER_MESSAGES = 'AdminMemberMessagesModal',
  CREATE_INVITE = 'CreateInviteModal',
  CREATE_BROADCAST_CONVERSATION = 'CreateBroadcastConversationModal',
  CONFIRM_UNFRIEND = 'ConfirmUnfriendModal',
  DATING_PROFILE = 'DatingProfileModal',
  CONFIRM_MESSAGE_DELETE = 'ConfirmMessageDeleteModal',
  CONFIRM_POST_DELETE = 'ConfirmPostDeleteModal',
  CONFIRM_POST_HIDE_FROM_FEED = 'ConfirmPostHideFromFeedModal',
  CONFIRM_HIDE_ALL_POSTS_FROM = 'ConfirmHideAllPostsFromModal',
  CONFIRM_POSTING_RESTRICT = 'ConfirmPostingRestrictModal',
  CONFIRM_CONTENT_DELETE = 'ConfirmContentDeleteModal',
  CONFIRM_MEMBER_DELETE = 'ConfirmMemberDeleteModal',
  CONFIRM_MEMBER_RESTORE = 'ConfirmMemberRestoreModal',
  CONFIRM_MEMBER_UNREPORT = 'ConfirmMemberUnreportModal',
  CONFIRM_ZEALOT = 'ConfirmZealotModal',
  CONFIRM_ADMIN = 'ConfirmAdminModal',
  GLOBAL_CONFIRMATION_DIALOG = 'GlobalConfirmationDialog',
  MERGE_SOCIAL_LOGIN = 'MergeSocialLoginModal',
  MESSAGE_INFO = 'MessageInfoModal',
  MESSAGE_IMAGE_PREVIEW_MODAL = 'MessageImagePreviewModal',
  FEED_ITEM = 'FeedItemModal',
  FEED_ITEM_LIKES = 'FeedItemLikesModal',
  BASIC_PHOTO_MODAL = 'BasicPhotoModal',
  REPORT_MEMBER = 'ReportMemberModal',
  BLOCK_MEMBER = 'BlockMemberModal',
  FLAG_CONTENT = 'FlagContentModal',
  RESTORE_ACCOUNT = 'RestoreAccountModal',
  VIEW_BLOCKING = 'ViewBlockingModal',
  BULK_INVITE = 'BulkInviteModal',
  ENDORSEMENT = 'EndorsementModal',
  ENDORSEMENT_TEMPLATES = 'EndorsementTemplatesModal',
  PRIVATE_INVITE_PASSCODE = 'PrivateInvitePasscodeModal'
}

export interface AdminMemberMessagesModalProps {
  member: IAdminRecentMemberFragmentFragment
}

export interface CreateInviteModalProps {
  recipient: Profile
  type: IHostingType
}

export interface CreateBroadcastConversationModalProps {
  participants: ISimpleProfile[]
}

export interface MessageInfoModalProps {
  data: Message
}

export interface ConfirmMessageDeleteModalProps {
  message: Message
  onSuccess: ((message: Message) => void) | null
}

export interface ConfirmPostDeleteModalProps {
  feedItemId: string
}

export interface ConfirmPostingRestrictModalProps {
  profileId: string
}

export interface MessageImagePreviewModalProps {
  image: string | ArrayBuffer | null
}

export interface CreateInviteProps {
  recipient: Profile
  type: InviteType
}

export interface ConfirmUnfriendProps {
  profile: Profile
  friendshipId: string
}

export interface DatingProfileProps {
  profile: Profile
}

export interface FeedItemModalProps {
  modalFeedItemId: string
  currentTime?: number
}

export interface FeedItemLikesModalProps {
  feedItem: FeedItem,
  commentId?: string | null,
  parentId?: string | null
  isNested?: boolean
  mode?: 'comment' | 'post'
}

export interface BasicPhotoProps {
  originalMediaUrl: string
}

export interface FlagContentProps {
  resourceId: string
  type: IFlaggedContentType
}

export interface RestoreAccountProps {
  email: string
}

export interface BlockMemberProps {
  profile: IProfileFragmentFragment
}

export interface UnreportMemberProps {
  reportId: string
}

export interface BulkInviteProps {
  recipients: Profile[]
}

export interface ConfirmContentDeleteModalProps {
  content: IFlaggedContentFragmentFragment
  onDeleteConfirmed: () => void
}

export interface ConfirmMemberUnreportModalProps {
  profileId: string
  onComplete: () => void
}

export interface ConfirmMemberDeleteModalProps {
  profileId: string
  suspend?: boolean
}

export interface ConfirmZealotModalProps {
  profileId: string
  value?: boolean
}

export interface EndorsementModalProps {
  endorser: ISimpleProfile
  endorsee?: ISimpleProfile
  endorseesInvitations?: InviteDetail[]
  type: IEndorsementSiteRole
  endorsingBack?: boolean
  reference?: {
    hostingId: string
  } | null
  id?: string
  content?: string
  onSubmitted?: (endorsement: IEndorsement) => void | Promise<void>
  onClosed?: () => void
}

export interface GlobalConfirmationDialogProps {
  title: string
  body: string
  yes?: string | null
  no?: string | null
  onCancel?: () => void
  onSuccess?: () => void
}

export interface EndorsementTemplatesModalProps {
  type: IEndorsementSiteRole
  firstName: string
  onSelect: (template: string) => void
}

export interface PrivateInvitePasscodeModalProps {
  passcode: string
  onCancel?: () => void
  onSuccess?: () => void
}

export interface ViewBlockingModalProps {}

export type ModalProps =
  | CreateInviteProps
  | ConfirmUnfriendProps
  | ConfirmMemberDeleteModalProps
  | ConfirmContentDeleteModalProps
  | ConfirmZealotModalProps
  | ConfirmPostingRestrictModalProps
  | DatingProfileProps
  | FeedItemModalProps
  | FeedItemLikesModalProps
  | BasicPhotoProps
  | FlagContentProps
  | RestoreAccountProps
  | BlockMemberProps
  | UnreportMemberProps
  | AdminMemberMessagesModalProps
  | MessageInfoModalProps
  | ConfirmMessageDeleteModalProps
  | ConfirmPostDeleteModalProps
  | MessageImagePreviewModalProps
  | BulkInviteProps
  | EndorsementModalProps
  | GlobalConfirmationDialogProps
  | ViewBlockingModalProps
  | PrivateInvitePasscodeModalProps

interface ModalState {
  selectedModal?: Modal
  selectedModalProps?: ModalProps
}

export const useModalStore = defineStore('modal', {
  state: (): ModalState => ({
    selectedModal: undefined,
    selectedModalProps: undefined,
  }),
  actions: {
    showModal(payload: { modal: Modal; props: ModalProps; }) {
      this.closeAllModals()
      this.selectedModal = payload.modal
      this.selectedModalProps = payload.props
    },
    hideModal(modal: Modal)  {
      if (this.selectedModal === modal) {
        this.selectedModal = undefined
        this.selectedModalProps = undefined
      }
    },
    closeAllModals() {
      this.selectedModal = undefined
      this.selectedModalProps = undefined
    }
  }
})
