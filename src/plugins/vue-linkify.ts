import linkifyHtml from 'linkify-html'
import type { App } from 'vue'

export const setupVueLinkify = (app: App) => {
  app.directive('linkify', (el, binding) => {
    const newHtml = linkifyHtml(el.innerHTML, binding.value)

    if (el.innerHTML !== newHtml) {
      el.innerHTML = newHtml

      const range = document.createRange()
      const lastNode = el.lastChild as Node
      if (lastNode.childNodes[0]) {
        const textNode = lastNode.childNodes[0]
        textNode.textContent = textNode.textContent + ' '

        try {
          range.setStart(textNode, (textNode.textContent && textNode.textContent.length - 1) || 0)
          range.collapse(true)

          const selection = window.getSelection()
          if (selection) {
            selection.removeAllRanges()
            selection.addRange(range)
          }
        } catch (e: any) {
          console.error(e)
        }
      }
    }
  })
}
