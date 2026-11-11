import type { ISiteRole } from '@/composables/graphql/generated'

import { type Relationship, type SiteRole } from './enums'

export interface Reference {
  id: string
  name: string
  siteRole: SiteRole | ISiteRole
  relationship: Relationship[] | null
  phone: string | null
  email: string | null
}
