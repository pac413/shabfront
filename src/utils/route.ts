export const getSingleIdFromRouteParam = (param: string | string[] | null | undefined): string | null | undefined => {
  if (!param) {
    return param
  }
  return typeof param === 'string' ? param : param[0]
}
