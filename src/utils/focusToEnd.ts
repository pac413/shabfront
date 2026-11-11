export const focusToEnd = (el: Node) => {
  if (!el) {
    return
  }

  const range = document.createRange()
  const sel = window.getSelection()
  const textNode = el.childNodes[0] as Text

  if (!textNode) {
    range.setStart(el, 0)
  } else {
    range.setStart(textNode, textNode.length)
  }
  range.collapse(true)

  if (sel) {
    sel.removeAllRanges()
    sel.addRange(range)
  }
}
