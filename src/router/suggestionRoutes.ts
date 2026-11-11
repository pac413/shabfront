import type { RouteRecordRaw } from 'vue-router'

const suggestionRoutes: RouteRecordRaw[] = [
  {
    path: '/shabbat-suggestions',
    name: 'ShabbatSuggestions',
    component: () => import('@/views/Suggestion/Suggestion.vue'),
    meta: { layoutProps: { fitHeight: true }, requiresAuth: true },
  },
]

export default suggestionRoutes
