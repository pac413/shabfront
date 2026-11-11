import type { RouteRecordRaw } from 'vue-router'

const actionRoutes: RouteRecordRaw[] = [
  {
    path: '/action',
    component: () => import('@/views/Action/Action.vue'),
    children: [
      {
        component: () => import('@/views/Action/FriendRequestAction.vue'),
        path: 'friend-request/:action(accept|delete)/:id',
        name: 'FriendRequestAction',
        meta: { requiresAuth: true, skipRedirect: true },
      },
      {
        component: () => import('@/views/Action/ReferencesRequestAction.vue'),
        path: 'references-request/:action(accept|delete)/:id',
        name: 'ReferencesRequestAction',
        meta: { requiresAuth: true, skipRedirect: true },
      },
      {
        component: () => import('@/views/Action/HostingAction.vue'),
        path: 'hosting/:action(accept|decline)/:id',
        name: 'HostingAction',
        meta: { requiresAuth: true, skipRedirect: true },
      },
      {
        component: () => import('@/views/Action/MessageRequestAction.vue'),
        path: 'message-request/:action(accept|delete)/:id',
        name: 'MessageRequestAction',
        meta: { requiresAuth: true, skipRedirect: true },
      },
      {
        component: () => import('@/views/Action/ConfirmEmailAction.vue'),
        path: 'confirm-email/:action(confirm|delete)/:id',
        name: 'ConfirmEmailAction',
        meta: { requiresAuth: true, skipRedirect: true },
      },
      {
        component: () => import('@/views/Action/DatingProfileRequestAction.vue'),
        path: 'private-dating-profile-request/:action(accept)/:id',
        name: 'DatingProfileRequestAction',
        meta: { requiresAuth: true, skipRedirect: true },
      },
      {
        component: () => import('@/views/Action/HostEndorsementRequestAction.vue'),
        path: 'host-endorsement-request/:action(accept)/:hostingId',
        name: 'HostEndorsementRequestAction',
        meta: { requiresAuth: true, skipRedirect: true },
      },
      {
        component: () => import('@/views/Action/GuestEndorsementRequestAction.vue'),
        path: 'guest-endorsement-request/:action(accept)/:hostingId',
        name: 'GuestEndorsementRequestAction',
        meta: { requiresAuth: true, skipRedirect: true },
      },
      {
        component: () => import('@/views/Action/MessagesByEmailOffAction.vue'),
        path: 'messages-by-email-off/:action(accept)/:userId',
        name: 'MessagesByEmailOffAction',
        meta: { requiresAuth: true, skipRedirect: true },
      },
      {
        path: 'view-endorsement/:action(accept)/:endorsementId',
        name: 'ViewEndorsementAction',
        redirect: { name: 'Endorsements' },
        meta: { requiresAuth: true, skipRedirect: true },
      },
      {
        component: () => import('@/views/Action/EndorseBackAction.vue'),
        path: 'endorse-back/:action(accept)/:endorserHandle/:endorsementType',
        name: 'EndorseBackAction',
        meta: { requiresAuth: true, skipRedirect: true },
      },
    ],
  },
]

export default actionRoutes
