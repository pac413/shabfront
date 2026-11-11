import { get } from '@/plugins/axios'
import { type FeedAction } from '@/store/feed/types'
import { type IframelyResponse } from '@/types'
import { createClientError, ERROR_BY_ACTION, parseError } from '@/utils/errors'

export type Params = string
export type GetPreviewAction = FeedAction<Params, IframelyResponse>

export const getPreview: GetPreviewAction = async (_, url) => {
  let response
  try {
    response = await get(`${import.meta.env.VITE_APP_IFRAMELY_API}`, {
      url,
      api_key: import.meta.env.VITE_APP_IFRAMELY_KEY,
      iframe: 0,
    })
  } catch (error: any) {
    return parseError(error, ERROR_BY_ACTION.LOAD_WEBSCRAPED_PREVIEW)
  }
  const data = response.data
  if (!data) {
    return createClientError(ERROR_BY_ACTION.LOAD_WEBSCRAPED_PREVIEW)
  }

  return { data: response.data as IframelyResponse }
}
