import type { HttpError, HttpErrorKind } from './types'

export function classifyFetchError(
  error: unknown,
  durationMs: number,
  requestUrl?: string,
  requestMethod?: string,
): HttpError {
  const timestamp = Date.now()

  if (error instanceof DOMException && error.name === 'AbortError') {
    return {
      kind: 'abort',
      message: 'Request was cancelled',
      details:
        'The in-flight HTTP request was deliberately cancelled before completion.',
      durationMs,
      timestamp,
      requestUrl,
      requestMethod: requestMethod as HttpError['requestMethod'],
    }
  }

  if (error instanceof TypeError) {
    const rawMsg = error.message || ''

    // Offline check
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return {
        kind: 'network',
        message: 'No internet connection',
        details:
          'The browser appears to be offline. Verify your network connectivity and try again.',
        durationMs,
        timestamp,
        requestUrl,
        requestMethod: requestMethod as HttpError['requestMethod'],
      }
    }

    // CORS or Network connectivity failure
    if (
      rawMsg.toLowerCase().includes('failed to fetch') ||
      rawMsg.toLowerCase().includes('networkerror') ||
      rawMsg.toLowerCase().includes('load failed')
    ) {
      const isMixedContent =
        typeof window !== 'undefined' &&
        window.location.protocol === 'https:' &&
        requestUrl?.startsWith('http:')

      if (isMixedContent) {
        return {
          kind: 'network',
          message: 'Mixed content blocked',
          details:
            'Browsers block unencrypted HTTP requests when loaded from an HTTPS origin. Please target an https:// endpoint or run Rivet over HTTP locally.',
          durationMs,
          timestamp,
          requestUrl,
          requestMethod: requestMethod as HttpError['requestMethod'],
        }
      }

      return {
        kind: 'cors',
        message: 'Network or CORS failure',
        details:
          'The request could not reach the server or was blocked by the browser CORS policy. Because this tool runs entirely in the browser, the remote server must include the `Access-Control-Allow-Origin` header for browser clients.',
        durationMs,
        timestamp,
        requestUrl,
        requestMethod: requestMethod as HttpError['requestMethod'],
      }
    }
  }

  const message =
    error instanceof Error ? error.message : 'Unknown network error'
  const kind: HttpErrorKind = message.toLowerCase().includes('url')
    ? 'invalid_url'
    : 'unknown'

  return {
    kind,
    message,
    details: 'An unexpected exception occurred during request dispatch.',
    durationMs,
    timestamp,
    requestUrl,
    requestMethod: requestMethod as HttpError['requestMethod'],
  }
}
