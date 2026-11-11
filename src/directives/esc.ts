import type { Directive, DirectiveBinding } from 'vue'

type KeyEventHandler = (event: KeyboardEvent) => void

type BoundElement = HTMLElement & { __escHandler__?: { callback: Function; handler: KeyEventHandler } }

const validate = (binding: DirectiveBinding) => {
  if (typeof binding.value !== 'function') {
    throw new Error(`[v-esc:] provided expression ${binding.value}is not a function.`)
  }
}

const addHandler = (el: BoundElement, binding: DirectiveBinding, handler: KeyEventHandler) => {
  el.__escHandler__ = {
    handler: handler,
    callback: binding.value,
  }

  document.addEventListener('keydown', handler)
}

const execute = (el: BoundElement, event: KeyboardEvent) => {
  if (!el.__escHandler__) {
    return
  }
  el.__escHandler__.callback(event)
}

const removeHandler = (el: BoundElement) => {
  if (!el.__escHandler__) {
    return
  }
  document.removeEventListener('keydown', el.__escHandler__.handler)
  delete el.__escHandler__
}

/**
 * Directive used to catch esc event on the document
 *
 * Use as
 *
 * ```
 * <my-component v-esc="functionName" />
 * ```
 *
 * Note
 *
 * Common usage for this directive is to catch esc event i.e. deselect selected files
 *
 * For example
 *
 * ```
 * <div  v-esc="deselectAll" />
 * ```
 */
const directive: Directive = {
  mounted: function (el, binding) {
    validate(binding)

    // Define Handler and cache it on the element
    const handler = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        execute(el as BoundElement, event)
      }
    }

    addHandler(el as BoundElement, binding, handler)
  },

  updated: function (el, binding) {
    validate(binding)
    const boundElement = el as BoundElement
    if (!boundElement.__escHandler__) {
      return
    }
    boundElement.__escHandler__.callback = binding.value
  },

  unmounted: function (el) {
    removeHandler(el as BoundElement)
  },
}

export default directive
