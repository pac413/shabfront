import type { Profile } from '@/types'

export const buildRelationshipClause = (u: any, privateDatingProfile: boolean): string => {
  if (u.relationship.isMarried) {
    let relationshipClause = 'Married'
    if (u.relationship.spouse && u.relationship.spouse.length > 0) {
      relationshipClause += ' to ' + u.relationship.spouse
    }
    if (u.relationship.children) {
      relationshipClause += ' with ' + u.relationship.children + ' child'
      if (u.relationship.children > 1) {
        relationshipClause += 'ren'
      }
      relationshipClause += ' at home'
    } else {
      relationshipClause += '.'
    }
    return relationshipClause
  } else {
    if (privateDatingProfile) {
      return 'Available for dating'
    } else {
      return 'Single'
    }
  }
}

/**
 * Returns a unique profile identification string
 * That will be used when assembling a profile route
 * @param profile
 */
export const getProfileRoutePath = (profile: Profile): string => {
  return profile.handle || profile.id
}

/**
 * Returns a color associated with the profile
 * currently the association is based on the first digit in the profile uuid
 * @param profile
 */
export const getAvatarBackground = (profile: Profile): string => {
  const colors = [
    '#1abc9c',
    '#3498db',
    '#9b59b6',
    '#34495e',
    '#16a085',
    '#2980b9',
    '#8e44ad',
    '#2c3e50',
    '#f1c40f',
    '#e67e22',
    '#e74c3c',
    '#95a5a6',
    '#f39c12',
    '#d35400',
    '#c0392b',
    '#bdc3c7',
    '#7f8c8d',
  ]
  const results = profile.id.match(/\d/)
  const idx: number = results ? Number.parseInt(results[0]) : 0
  return colors[idx]
}

/**
 * Returns a a Boostrap color variant associated with the profile
 * currently the association is based on the first digit in the profile uuid
 * @param profile
 */
export const getAvatarVariant = (profile: { id: string }): string => {
  const variants = ['secondary', 'primary', 'dark', 'success', 'danger', 'warning', 'info', 'danger', 'warning', 'info']
  const results = profile.id ? profile.id.match(/\d/) : null
  const idx: number = results ? Number.parseInt(results[0]) : 0
  return variants[idx]
}

export const getHeightText = (num: number) => {
  const feet = Math.floor(num / 12)
  const inches = num % 12
  const cm = Math.round(num / 0.3937)
  return `${feet}' ${inches}'' (${cm} cm)`
}
