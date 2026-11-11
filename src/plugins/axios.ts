import axios, { type AxiosError, AxiosHeaders, type AxiosRequestConfig, type AxiosResponse, type Method } from 'axios'

import { clearToken, getLocale, getRefreshToken, getToken, session } from '@/utils'

/**
 * Axios interceptor which handles an expired access token error by requesting a
 * refreshed access token before retrying the original request.
 *
 * Retries happen only once
 */
const handleExpiredAccessToken = async (error: AxiosError) => {
  if (!error.response) {
    throw error
  }
  if (error.response.status !== 401) {
    throw error
  }

  clearToken()

  const refreshToken = getRefreshToken()
  if (!refreshToken) {
    throw error
  }

  await updateAccessToken()

  return client.request(error.config || {})
}

export const client = axios.create({
  baseURL: import.meta.env.VITE_APP_REST_API,
  validateStatus: (status: number) => {
    return status < 400
  },
})

/**
 * Axios interceptor which adds an authorization header to all requests,
 * if access token is available in local storage
 */
client.interceptors.request.use((request) => {
  const token = getToken()
  if (token) {
    if (request.headers) {
      request.headers['Authorization'] = `Bearer ${token}`
    } else {
      request.headers = new AxiosHeaders({ Authorization: `Bearer ${token}` })
    }
  }
  return request
})
client.interceptors.response.use(undefined, handleExpiredAccessToken)

// Primary client public interface

type AdditionalRequestOptions = Omit<AxiosRequestConfig, 'method' | 'url' | 'data'>

/**
 * Main request method for use with the primary backend client
 */
export const request = <T = any>(
  url: string,
  method: Method,
  data: any,
  options: AdditionalRequestOptions = {},
): Promise<AxiosResponse<T>> => {
  const { headers, ...otherOptions } = options
  const locale = getLocale()

  return client.request({
    method,
    url,
    data,
    headers: {
      ...(options.headers || {}),
      'Accept-Language': locale,
    },
    ...otherOptions,
  })
}

/**
 * Utility method for GET requests to the backend
 */
export const get = <T = any>(url: string, params?: object) => request<T>(url, 'get', null, { params })

/**
 * Utility method for POST requests to the backend
 */
export const post = <T = any>(url: string, data?: object) => request<T>(url, 'post', data)

/**
 * Utility method for PUT requests to the backend
 */
export const put = <T = any>(url: string, data?: object) => request<T>(url, 'put', data)
export const remove = (url: string, data?: object) => request(url, 'delete', data)

// Requests using REFRESH token

/**
 * Temporarily storing a request to refresh the access token when it has expired
 *
 * Used to avoid multiple refresh requests from the backend.
 */
let refreshAccessTokenRequest: null | Promise<any> = null

/**
 * updateAccessToken takes a refresh-token and requests a new access-token.
 *
 * The request is memoized while in progress, and is attached to by subsequent requests,
 * to avoid firing multiple requests in paralel.
 */
export const updateAccessToken = async () => {
  refreshAccessTokenRequest = refreshAccessTokenRequest || refreshClient.get('auth/refresh-access-token')

  let response

  try {
    response = await refreshAccessTokenRequest
  } finally {
    refreshAccessTokenRequest = null
  }

  session.updateToken({
    accessToken: response.data.accessToken,
    accessTokenExpiresAt: response.data.accessTokenExpiresAt,
  })
  return response
}

/**
 * Client used to perform refresh-token related requests to the backend
 *
 */
export const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_APP_REST_API,
})

/**
 * Axios interceptor.
 *
 * Signs all requests to the backend with an authorization header containing the access token.
 *
 * If the token has expired, the request to backend will fail,
 * but will triger a refresh of the access token, followed by a retry.
 */
refreshClient.interceptors.request.use((request) => {
  const token = getRefreshToken()
  if (token) {
    if (request.headers) {
      request.headers['Authorization'] = `Bearer ${token}`
    } else {
      request.headers = new AxiosHeaders({ Authorization: `Bearer ${token}` })
    }
  }
  return request
})
