import { type RouteLocationRaw } from 'vue-router'

export interface ActionResult {
  action: string
  redirect?: RouteLocationRaw
  back?: boolean
  message: string
  success: boolean
}
