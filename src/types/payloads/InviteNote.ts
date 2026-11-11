import { type IHostingRole } from '@/composables/graphql/generated'

export interface InviteNote {
  sender: IHostingRole
  body: string
}
