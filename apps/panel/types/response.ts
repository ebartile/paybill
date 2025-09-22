export interface ResponseFailure {
  error: ResponseError
}

export type PaybillResponse<T> = T | ResponseFailure

export class ResponseError extends Error {
  code?: number
  requestId?: string
  retryAfter?: number

  constructor(message: string | undefined, code?: number, requestId?: string, retryAfter?: number) {
    super(message || 'API error happened while trying to communicate with the server.')
    this.code = code
    this.requestId = requestId
    this.retryAfter = retryAfter
  }
}
