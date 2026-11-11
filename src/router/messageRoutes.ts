import type { RouteRecordRaw } from 'vue-router'

const messageRoutes: RouteRecordRaw[] = [
  {
    path: '/messages',
    name: 'Message',
    component: () => import('@/views/Messages/MessagesInbox.vue'),
    meta: { layoutProps: { fitHeight: true }, requiresAuth: true },
  },
  {
    path: '/messages/:handle',
    name: 'CustomMessage',
    component: () => import('@/views/Messages/MessagesInbox.vue'),
    meta: { layoutProps: { fitHeight: true }, requiresAuth: true },
  },
  {
    path: '/messages/broadcast/:conversationId',
    name: 'BroadcastMessage',
    component: () => import('@/views/Messages/MessagesInbox.vue'),
    meta: { layoutProps: { fitHeight: true }, requiresAuth: true },
  },
  {
    path: '/message-requests',
    name: 'MessageRequests',
    component: () => import('@/views/Messages/MessageRequests.vue'),
    meta: { requiresAuth: true },
  },
]

export default messageRoutes
