/**
 * * includes - attribute names to include when copying, if undefined, it will not considered
 * * excludes - attribute names to exclude when copying, if undefined, it will not considered
 */
export type COPY_ATTRIBUTE_OPTIONS = {
  includes?: string[]
  excludes?: string[]
}

export const copyAttributes = (destObj: any, srcObj: any, options: COPY_ATTRIBUTE_OPTIONS = {}) => {
  if (typeof srcObj !== 'object' || typeof destObj !== 'object') {
    return
  }
  for (const key in srcObj) {
    if (options.includes && !options.includes.includes(key)) {
      continue
    }
    if (options.excludes && options.excludes.includes(key)) {
      continue
    }
    if (srcObj[key] && typeof srcObj[key] === 'object') {
      if (Array.isArray(srcObj[key])) {
        destObj[key] = [...srcObj[key]]
      } else {
        copyAttributes(destObj[key], srcObj[key])
      }
    } else {
      destObj[key] = srcObj[key]
    }
  }
}
