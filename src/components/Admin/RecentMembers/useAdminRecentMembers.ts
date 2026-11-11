import { ref } from 'vue'

import { useToast } from '@/composables'
import {
  type IAdminRecentMemberFragmentFragment,
  type IAdminRecentMembersQueryVariables,
  useAdminRecentMembersLazyQuery,
  useBulkDeleteMembersMutation
} from '@/composables/graphql/generated'
import { PROFILE_LIST_PAGE_SIZE } from '@/utils'

export const useAdminRecentMembers = (defaultQuery: Partial<IAdminRecentMembersQueryVariables> = {}) => {
  const { showErrorToast } = useToast()
  const offset = ref<number>(0)
  const profiles = ref<IAdminRecentMemberFragmentFragment[]>([])
  const profilesSelection = ref<{ [key: string]: boolean }>({})

  const { load, loading, onResult } = useAdminRecentMembersLazyQuery({
    offset: offset.value,
    limit: PROFILE_LIST_PAGE_SIZE,
    ...defaultQuery,
  })
  const loadRecentMembers = (params?: Partial<IAdminRecentMembersQueryVariables>) => {
    load(
      undefined,
      {
        offset: offset.value,
        limit: PROFILE_LIST_PAGE_SIZE,
        ...defaultQuery,
        ...(params || {}),
      },
      { fetchPolicy: offset.value === 0 ? 'network-only' : 'cache-and-network' },
    )
  }

  const reset = () => {
    offset.value = 0
    profiles.value = []
    profilesSelection.value = {}
  }

  onResult((result) => {
    if (result.loading) {
      return
    }
    const newProfiles: IAdminRecentMemberFragmentFragment[] = [...profiles.value]
    const existingIds = newProfiles.map((profile) => profile.id)
    const loadedProfiles = result.data?.adminRecentMembers?.profiles || []
    loadedProfiles.forEach((profile) => {
      const idx = existingIds.indexOf(profile.id)
      if (idx >= 0) {
        newProfiles.splice(idx, 1, profile)
      } else {
        newProfiles.push(profile)
      }
    })
    profiles.value = newProfiles
    offset.value = profiles.value.length
  })

  const selectProfile = (id: string, isSelected: boolean) => {
    profilesSelection.value = {
      ...profilesSelection.value,
      [id]: isSelected,
    }
  }

  const clearSelection = () => {
    profilesSelection.value = {}
  }

  const toggleAll = (selected: boolean) => {
    const newProfileSelection = { ...profilesSelection.value }
    profiles.value.forEach((profile) => {
      newProfileSelection[profile.id] = selected
    })
    profilesSelection.value = newProfileSelection
  }

  const { 
    mutate: bulkDeleteMembers,
    onDone: onBulkDeleteMembersDone,
    onError: onBulkDeleteMembersError
  } = useBulkDeleteMembersMutation(() => ({
    variables: {
      profileIds: [], suspend: false
    }
  }))

  onBulkDeleteMembersDone((response) => {
    if (response.data?.bulkDeleteMembers) {
      profiles.value = profiles.value.filter(profile => !profilesSelection.value[profile.id])
      profilesSelection.value = {}
    }
  })

  onBulkDeleteMembersError((error) => showErrorToast(error))

  const deleteSelectedMembers = (shouldSuspend: boolean) => {
    const selectedProfileIds = Object.keys(profilesSelection.value).filter(
      profileId => profilesSelection.value[profileId]
    )
    bulkDeleteMembers({
      profileIds: selectedProfileIds,
      suspend: shouldSuspend
    })
  }

  return {
    clearSelection,
    loading,
    loadRecentMembers,
    onResult,
    profiles,
    profilesSelection,
    reset,
    selectProfile,
    toggleAll,
    deleteSelectedMembers
  }
}
