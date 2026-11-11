import { type HostProfileStatus, type ReserveHostingOptions } from './enums'

export interface HostAvailability {
  date: string
  status: HostProfileStatus
  reserveBy: typeof ReserveHostingOptions
}
