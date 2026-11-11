export type ProgressCallback = (sentBytes: number, totalBytes: number) => void
export type SendFileParams = {
  url: string
  onProgress: ProgressCallback
}

type SendResponse = { message: string; success: boolean }
type Result = (a: SendResponse) => void

const resolveResponse = (request: XMLHttpRequest, resolve: Result, reject: Result) => {
  const response = new DOMParser().parseFromString(request.response, 'text/xml')
  const messageContainer = response && response.firstElementChild && response.children[0]
  if (!messageContainer) {
    return reject({ success: false, message: 'Invalid response' })
  }

  const message = messageContainer.innerHTML
  const success = request.status === 201

  return resolve({ success, message })
}

export const sendFile = (file: File, options: SendFileParams) => {
  const { url, onProgress } = options
  const request = new XMLHttpRequest()
  request.open('PUT', url)
  return new Promise((resolve, reject) => {
    request.onload = () => resolveResponse(request, resolve, reject)
    request.onerror = () => resolveResponse(request, resolve, reject)
    request.upload.onprogress = (e) => onProgress && onProgress(e.loaded, e.total)

    request.send(file)
  })
}
