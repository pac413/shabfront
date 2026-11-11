import { SCROLL_PERCENT_FOR_RELOAD } from '@/utils/consts'

export const checkIfScrolledOverPercentage = () => {
  // The document height which includes the header and needs to be reassessed when more items are added
  const docHeight = document.body.offsetHeight
  // The actual value on which to fetch more
  const scrollTrigger = SCROLL_PERCENT_FOR_RELOAD * docHeight
  // If the scroll position reaches the scrollTrigger
  return window.scrollY + window.innerHeight >= scrollTrigger
}
