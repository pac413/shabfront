import type { InjectionKey } from 'vue'
import { createLogger, createStore, type Store } from 'vuex'

import { isLocal } from '@/utils'

import auth from './auth'
import connections from './connections'
import feed from './feed'
import initialState from './initialState'
import invites from './invites'
import media from './media'
import message from './message'
import notification from './notification'
import parsha from './parsha'
import planner from './planner'
import profile from './profile'
import profileSettings from './profileSettings'
import search from './search'
import type { RootState } from './types'

export const store = createStore({
  modules: {
    auth,
    connections,
    feed,
    invites,
    media,
    message,
    notification,
    parsha,
    planner,
    profile,
    profileSettings,
    search,
  },
  mutations: {
    reset(state: RootState) {
      Object.keys(state).forEach((key) => {
        Object.assign(state[key as keyof RootState], initialState[key as keyof RootState])
      })
    },
  },
  plugins: isLocal ? [createLogger()] : [],
})

export const storeKey: InjectionKey<Store<RootState>> = Symbol()
