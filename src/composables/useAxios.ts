import { type AxiosInstance } from 'axios'
import { getCurrentInstance } from 'vue'

/**
 * This is a wrapper around a temporary helper for useStore,
 * which makes it available with vue2 + vuex3.
 * Once we upgrade to vuex4 or higher, we could remove it.
 */
export const useAxios = (): AxiosInstance => {
  const vm = getCurrentInstance()
  if (!vm?.proxy) {
    throw new Error('getCurrentInstance() returned null. Method must be called at the top of a setup function')
  }
  return vm.proxy.$http
}
