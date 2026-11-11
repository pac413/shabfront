import type { RouteRecordRaw } from 'vue-router'

const mobileProfileEditRoutes: RouteRecordRaw[] = [
  {
    component: () => import('@/components/Profile/Edit/ContactInfoView.vue'),
    name: 'mobile.edit.contact-info',
    path: 'contact-info',
  },
  {
    component: () => import('@/components/Profile/Edit/AboutMeView.vue'),
    name: 'mobile.edit.about-me',
    path: 'about-me',
  },
  {
    component: () => import('@/components/Profile/Edit/GuestPreferenceView.vue'),
    name: 'mobile.edit.guest-preferences',
    path: 'guest-preferences',
  },
  {
    component: () => import('@/components/Profile/Edit/HostPreferenceView.vue'),
    name: 'mobile.edit.host-preferences',
    path: 'host-preferences',
  },
  {
    component: () => import('@/components/Profile/Edit/RelationshipView.vue'),
    name: 'mobile.edit.relationship',
    path: 'relationship',
  },
  {
    component: () => import('@/components/Profile/Edit/PersonalInfoView.vue'),
    name: 'mobile.edit.personal-info',
    path: 'personal-info',
  },
  {
    component: () => import('@/components/Profile/Edit/ReferencesView.vue'),
    name: 'mobile.edit.references',
    path: 'references',
  },
  {
    component: () => import('@/components/Profile/Edit/AccountSettingsView.vue'),
    name: 'mobile.edit.account-settings',
    path: 'account-settings',
  },
  {
    component: () => import('@/components/Profile/Edit/DatingPreferenceView.vue'),
    name: 'mobile.edit.dating-preferences',
    path: 'dating-preferences',
  },
].map((routeConfig) => ({
  ...routeConfig,
  meta: { layout: 'mobile', requiresAuth: true },
}))

const mobileDatingProfileEditRoutes: RouteRecordRaw[] = [
  {
    component: () => import('@/components/Profile/DatingProfileEdit/BackgroundView.vue'),
    name: 'mobile.edit-dating.background',
    path: 'background',
  },
  {
    component: () => import('@/components/Profile/DatingProfileEdit/PersonalDetailsView.vue'),
    name: 'mobile.edit-dating.personal-details',
    path: 'personal-details',
  },
  {
    component: () => import('@/components/Profile/DatingProfileEdit/EducationView.vue'),
    name: 'mobile.edit-dating.education',
    path: 'education',
  },
  {
    component: () => import('@/components/Profile/DatingProfileEdit/MatchmakerView.vue'),
    name: 'mobile.edit-dating.matchmaker',
    path: 'matchmaker',
  },
  {
    component: () => import('@/components/Profile/DatingProfileEdit/PersonalDescriptionView.vue'),
    name: 'mobile.edit-dating.personal-description',
    path: 'personal-description',
  },
  {
    component: () => import('@/components/Profile/DatingProfileEdit/LookingForView.vue'),
    name: 'mobile.edit-dating.looking-for',
    path: 'looking-for',
  },
  {
    component: () => import('@/components/Profile/DatingProfileEdit/PrivacySettingsView.vue'),
    name: 'mobile.edit-dating.privacy-settings',
    path: 'privacy-settings',
  },
].map((routeConfig) => ({
  ...routeConfig,
  meta: { layout: 'mobile', requiresAuth: true },
}))

const mobileRoutes: RouteRecordRaw[] = [
  {
    path: '/mobile/profile/edit',
    name: 'Edit Profile - Mobile',
    component: () => import('@/views/Mobile/MobileProfileEdit.vue'),
    redirect: { name: 'mobile.edit.contact-info' },
    children: mobileProfileEditRoutes,
    meta: { layout: 'mobile', requiresAuth: true },
  },
  {
    path: '/mobile/profile/edit-dating',
    name: 'Edit Dating Profile - Mobile',
    component: () => import('@/views/Mobile/MobileDatingProfileEdit.vue'),
    redirect: { name: 'mobile.edit-dating.background' },
    children: mobileDatingProfileEditRoutes,
    meta: { layout: 'mobile', requiresAuth: true },
  },
  {
    path: '/mobile/profile/settings',
    name: 'Profile Settings - Mobile',
    component: () => import('@/views/Mobile/MobileProfileSettings.vue'),
    meta: { layout: 'mobile', requiresAuth: true },
  },
  {
    path: '/mobile/privacy',
    name: 'Privacy - Mobile',
    component: () => import('@/views/Mobile/MobilePrivacy.vue'),
    meta: { layout: 'mobile' },
  },
]

export default mobileRoutes
