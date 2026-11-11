import type { RouteRecordRaw } from 'vue-router'

let profileRoutes: RouteRecordRaw[] = []

// Add routes for profile page, edit profile, profile-not-found pages
profileRoutes = profileRoutes.concat([
  {
    path: '/profile/:handle?',
    component: () => import('@/views/Profile/Profile.vue'),
    children: [
      {
        path: 'endorsements',
        name: 'Endorsements',
        component: () => import('@/components/Profile/Endorsement/Endorsements.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'guest-list/:hostId*',
        props: (route) => ({ hostId: route.params.hostId }),
        name: 'Hosting Guest',
        component: () => import('@/components/Profile/HostingGuestCard/HostingGuestCard.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'pictures',
        name: 'All Pictures',
        component: () => import('@/components/Profile/PicturesCard/AllPicturesCard.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'connections',
        name: 'All Connections',
        component: () => import('@/components/Profile/ConnectionsCard/AllConnectionsCard.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'viewers',
        name: 'All Viewers',
        component: () => import('@/components/Profile/ViewersCard/AllViewersCard.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'edit',
        name: 'Edit Profile',
        component: () => import('@/components/Profile/Edit/ProfileEditCard.vue'),
        redirect: { name: 'edit.contact-info' },
        meta: { requiresAuth: true },
        children: [
          {
            component: () => import('@/components/Profile/Edit/ContactInfoView.vue'),
            meta: { requiresAuth: true },
            name: 'edit.contact-info',
            path: 'contact-info',
          },
          {
            component: () => import('@/components/Profile/Edit/AboutMeView.vue'),
            meta: { requiresAuth: true },
            name: 'edit.about-me',
            path: 'about-me',
          },
          {
            component: () => import('@/components/Profile/Edit/GuestPreferenceView.vue'),
            meta: { requiresAuth: true },
            name: 'edit.guest-preferences',
            path: 'guest-preferences',
          },
          {
            component: () => import('@/components/Profile/Edit/HostPreferenceView.vue'),
            meta: { requiresAuth: true },
            name: 'edit.host-preferences',
            path: 'host-preferences',
          },
          {
            component: () => import('@/components/Profile/Edit/RelationshipView.vue'),
            meta: { requiresAuth: true },
            name: 'edit.relationship',
            path: 'relationship',
          },
          {
            component: () => import('@/components/Profile/Edit/PersonalInfoView.vue'),
            meta: { requiresAuth: true },
            name: 'edit.personal-info',
            path: 'personal-info',
          },
          {
            component: () => import('@/components/Profile/Edit/ReferencesView.vue'),
            meta: { requiresAuth: true },
            name: 'edit.references',
            path: 'references',
          },
          {
            component: () => import('@/components/Profile/Edit/AccountSettingsView.vue'),
            meta: { requiresAuth: true },
            name: 'edit.account-settings',
            path: 'account-settings',
          },
          {
            component: () => import('@/components/Profile/Edit/DatingPreferenceView.vue'),
            meta: { requiresAuth: true },
            name: 'edit.dating-preferences',
            path: 'dating-preferences',
          },
        ],
      },
      {
        path: 'edit-dating',
        name: 'Edit Dating Profile',
        component: () => import('@/components/Profile/DatingProfileEdit/DatingProfileEditCard.vue'),
        meta: { requiresAuth: true },
        redirect: { name: 'edit-dating.background' },
        children: [
          {
            component: () => import('@/components/Profile/DatingProfileEdit/BackgroundView.vue'),
            meta: { requiresAuth: true },
            name: 'edit-dating.background',
            path: 'background',
          },
          {
            component: () => import('@/components/Profile/DatingProfileEdit/PersonalDetailsView.vue'),
            meta: { requiresAuth: true },
            name: 'edit-dating.personal-details',
            path: 'personal-details',
          },
          {
            component: () => import('@/components/Profile/DatingProfileEdit/EducationView.vue'),
            meta: { requiresAuth: true },
            name: 'edit-dating.education',
            path: 'education',
          },
          {
            component: () => import('@/components/Profile/DatingProfileEdit/MatchmakerView.vue'),
            meta: { requiresAuth: true },
            name: 'edit-dating.matchmaker',
            path: 'matchmaker',
          },
          {
            component: () => import('@/components/Profile/DatingProfileEdit/PersonalDescriptionView.vue'),
            meta: { requiresAuth: true },
            name: 'edit-dating.personal-description',
            path: 'personal-description',
          },
          {
            component: () => import('@/components/Profile/DatingProfileEdit/LookingForView.vue'),
            meta: { requiresAuth: true },
            name: 'edit-dating.looking-for',
            path: 'looking-for',
          },
          {
            component: () => import('@/components/Profile/DatingProfileEdit/PrivacySettingsView.vue'),
            meta: { requiresAuth: true },
            name: 'edit-dating.privacy-settings',
            path: 'privacy-settings',
          },
        ],
      },
      {
        path: '',
        name: 'Profile',
        component: () => import('@/components/Profile/Index.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/profile-not-found',
    name: 'Profile Not Found',
    component: () => import('@/views/Profile/ProfileNotFound.vue'),
  },
])

// All profile routes require auth
profileRoutes = profileRoutes.map((item) => ({
  ...item,
  meta: { requiresAuth: true },
}))

export default profileRoutes
