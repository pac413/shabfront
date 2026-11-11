import { uniqBy } from 'lodash'
import { computed, type ComputedRef, ref, watch } from 'vue'

import {
  type IHostingFragmentFragment,
  IHostingPart,
  type IHostingRole,
  IHostingStatus,
  useHostingsLazyQuery,
} from '@/composables/graphql/generated'

const statuses = [IHostingStatus.Accepted, IHostingStatus.Pending, IHostingStatus.Declined]

const meals = [IHostingPart.Night, IHostingPart.Day, IHostingPart.Third, IHostingPart.MelaveMalka, IHostingPart.Lodging]

export type LoadSortedHostingsParams = {
  hostId: string
  selectedDate: string
  role: IHostingRole
  limit: number
  sortBy: 'status' | 'meal'
}

export const useLoadSortedHostings = (params: ComputedRef<LoadSortedHostingsParams>) => {
  const hostingsByStatus = ref<{
    [key: string]: {
      hostings: readonly IHostingFragmentFragment[]
      total: number
    }
  }>({})
  const hostingsByMeal = ref<{
    [key: string]: {
      hostings: readonly IHostingFragmentFragment[]
      total: number
    }
  }>({})
  const currentStatusIdx = ref<number>(0)
  const currentMealIdx = ref<number>(0)
  const sortedHostings = computed(() => {
    if (params.value.sortBy === 'status') {
      return hostingsByStatus.value
    } else if (params.value.sortBy === 'meal') {
      return hostingsByMeal.value
    }
    return {}
  })
  const hasAllLoaded = computed(() => {
    if (params.value.sortBy === 'status') {
      return statuses.every((status) => {
        const data = hostingsByStatus.value[status]
        return !!data && data.hostings.length === data.total
      })
    } else if (params.value.sortBy === 'meal') {
      return meals.every((meal) => {
        const data = hostingsByMeal.value[meal]
        return data && data.hostings.length === data.total
      })
    }
    return true
  })
  const total = computed(() => {
    let sum = 0
    if (params.value.sortBy === 'status') {
      Object.values(hostingsByStatus.value).forEach(({ total }) => {
        sum += total
      })
    } else if (params.value.sortBy === 'meal') {
      Object.values(hostingsByMeal.value).forEach(({ total }) => {
        sum += total
      })
    }
    return sum
  })

  const { load, loading, onResult } = useHostingsLazyQuery({
    input: {
      profileId: params.value.hostId,
      date: params.value.selectedDate,
      role: params.value.role,
      offset: 0,
      limit: params.value.limit,
    },
  })

  onResult((result) => {
    if (result.loading) {
      return
    }
    const { hostings: newHostings, total } = result.data?.Hostings
    if (params.value.sortBy === 'status') {
      const status = statuses[currentStatusIdx.value]
      const data = hostingsByStatus.value[status] || { hostings: [], total: 0 }
      hostingsByStatus.value = {
        ...hostingsByStatus.value,
        [status]: {
          hostings: uniqBy([...data.hostings, ...newHostings], 'id'),
          total: total,
        },
      }
      if (newHostings.length < params.value.limit && hostingsByStatus.value[status].hostings.length === total) {
        loadMore()
      }
    } else if (params.value.sortBy === 'meal') {
      const meal = meals[currentMealIdx.value]
      const data = hostingsByMeal.value[meal] || { hostings: [], total: 0 }
      hostingsByMeal.value = {
        ...hostingsByMeal.value,
        [meal]: {
          hostings: uniqBy([...data.hostings, ...newHostings], 'id'),
          total: total,
        },
      }
      if (newHostings.length < params.value.limit && hostingsByMeal.value[meal].hostings.length === total) {
        loadMore()
      }
    }
  })

  const loadMore = () => {
    const input: any = {
      profileId: params.value.hostId,
      date: params.value.selectedDate,
      role: params.value.role,
      offset: 0,
      limit: params.value.limit,
    }

    if (params.value.sortBy === 'status') {
      let status = statuses[currentStatusIdx.value]
      const data = hostingsByStatus.value[status]
      if (data) {
        if (data.hostings.length === data.total) {
          if (currentStatusIdx.value >= 0 && currentStatusIdx.value < statuses.length - 1) {
            currentStatusIdx.value = currentStatusIdx.value + 1
            status = statuses[currentStatusIdx.value]
            input.statuses = [status]
          } else {
            return
          }
        } else {
          input.statuses = [status]
          input.offset = data.hostings.length
        }
      } else {
        input.statuses = [status]
      }
    } else if (params.value.sortBy === 'meal') {
      let meal = meals[currentMealIdx.value]
      const data = hostingsByMeal.value[meal]
      if (data) {
        if (data.hostings.length === data.total) {
          if (currentMealIdx.value >= 0 && currentMealIdx.value < meals.length - 1) {
            currentMealIdx.value = currentMealIdx.value + 1
            meal = meals[currentMealIdx.value]
            input.parts = [meal]
          } else {
            return
          }
        } else {
          input.parts = [meal]
          input.offset = data.hostings.length
        }
      } else {
        input.parts = [meal]
      }
    }

    load(undefined, { input })
  }

  const reset = () => {
    hostingsByStatus.value = {}
    hostingsByMeal.value = {}
    currentStatusIdx.value = 0
    currentMealIdx.value = 0
  }

  watch(
    params,
    () => {
      reset()
      loadMore()
    },
    { immediate: true },
  )

  return {
    hasAllLoaded,
    loading,
    loadMore,
    reset,
    sortedHostings,
    total,
  }
}
