import _ from 'lodash'

import { type IHostingFragmentFragment, type IHostingStatus } from '@/composables/graphql/generated'
import { type HostingPart, type InviteDetail, InviteStatus, InviteType } from '@/types'

export const initialParts = (invite: InviteDetail): (InviteStatus | IHostingStatus | HostingPart)[] => {
  if (!invite) {
    return []
  }
  return (invite.type === InviteType.INVITATION ? invite.hostParts : invite.guestParts) || []
}

export const inviteParts = (invite: InviteDetail): (InviteStatus | IHostingStatus | HostingPart)[] => {
  if (!invite) {
    return []
  }
  if (invite.status === InviteStatus.ACCEPTED && invite.sharedParts && invite.sharedParts.length) {
    return invite.sharedParts
  } else {
    return initialParts(invite)
  }
}

export const statusIcon = (status: InviteStatus | IHostingStatus | HostingPart, isRecipient = false): string[] => {
  switch (status) {
  case InviteStatus.ACCEPTED:
    return ['fas', 'check']
  case InviteStatus.DECLINED:
    return ['fas', 'times']
  case InviteStatus.PENDING:
    return isRecipient ? ['fal', 'exclamation-circle'] : ['fas', 'hourglass']
  default:
    return []
  }
}

export const statusVariant = (status: InviteStatus | IHostingStatus | HostingPart): string => {
  switch (status) {
  case InviteStatus.ACCEPTED:
    return 'success'
  case InviteStatus.DECLINED:
    return 'danger'
  case InviteStatus.PENDING:
    return 'warning'
  default:
    return ''
  }
}

export const sortHostingsByStatus = (hostings: readonly (InviteDetail | IHostingFragmentFragment)[]) => {
  return _.groupBy(hostings, 'status')
}

export const sortHostingsByMeal = (hostings: readonly (InviteDetail | IHostingFragmentFragment)[]) => {
  const sorted: { [key in HostingPart]?: readonly (InviteDetail | IHostingFragmentFragment)[] | undefined } = {}
  hostings.map((item) => {
    const parts = item.type === InviteType.INVITATION ? item.hostParts! : item.guestParts!
    parts.forEach((part) => {
      sorted[part] = [...(sorted[part] || []), item]
    })
  })
  return sorted
}

export const sortedHostings = (
  sortByStatus: boolean,
  hostings: readonly (InviteDetail | IHostingFragmentFragment)[],
) => {
  if (sortByStatus) {
    return sortHostingsByStatus(hostings)
  } else {
    return sortHostingsByMeal(hostings)
  }
}

export const statusOfMeal = (
  part: InviteStatus | IHostingStatus | HostingPart,
  item: InviteDetail | IHostingFragmentFragment,
) => {
  if (item.status !== InviteStatus.ACCEPTED) {
    return item.status
  }
  return inviteParts(item).includes(part) ? InviteStatus.ACCEPTED : InviteStatus.DECLINED
}
