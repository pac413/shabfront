import { getCurrentInstance } from 'vue'

export const useInstance = () => {
  const vm = getCurrentInstance()
  if (!vm) {
    throw new Error('getCurrentInstance() returned null. Method must be called at the top of a setup function')
  }
  return vm.proxy
}
