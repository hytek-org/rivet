/**
 * Browser Fetch API restricted headers:
 * According to the Fetch standard, certain headers are controlled exclusively by the user agent.
 * Setting these via request headers will be silently discarded or cause an error in the browser.
 */
export const RESTRICTED_HEADERS = new Set([
  'accept-charset',
  'accept-encoding',
  'access-control-request-headers',
  'access-control-request-method',
  'connection',
  'content-length',
  'cookie',
  'cookie2',
  'date',
  'dnt',
  'expect',
  'host',
  'keep-alive',
  'origin',
  'referer',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
  'via',
])

export function isRestrictedHeader(headerName: string): boolean {
  const normalized = headerName.trim().toLowerCase()
  if (RESTRICTED_HEADERS.has(normalized)) return true
  if (normalized.startsWith('sec-') || normalized.startsWith('proxy-'))
    return true
  return false
}

export function getRestrictedHeaderExplanation(
  headerName: string,
): string | null {
  if (!isRestrictedHeader(headerName)) return null

  const normalized = headerName.trim().toLowerCase()
  if (normalized === 'host') {
    return 'The Host header is managed by the browser and cannot be overwritten via fetch.'
  }
  if (normalized === 'cookie' || normalized === 'cookie2') {
    return 'Cookie headers cannot be manually set in browser fetch for security reasons.'
  }
  if (normalized === 'origin' || normalized === 'referer') {
    return 'Origin and Referer headers are set automatically by the browser to match your current origin.'
  }
  if (normalized === 'content-length') {
    return 'Content-Length is calculated automatically by the browser based on the request payload.'
  }
  if (normalized.startsWith('sec-')) {
    return 'Sec-* headers are forbidden by browsers to prevent security boundary bypasses.'
  }
  return `The '${headerName}' header is restricted by the browser Fetch specification and cannot be set directly.`
}
