import { type ProfileState } from './types'

export const getInitialState: () => ProfileState = () => ({
  activeProfile: null, // Authenticated user's profile
  currentProfile: null,

  // Occupation
  occupations: [],

  // Profiles for posts, feeds and comments
  profiles: [],

  // Subscriptions
  profilesSubscription: null,
  profilesSubscriptionIds: [],
  blockingProfiles: {},
})

const state: ProfileState = getInitialState()

export default state
