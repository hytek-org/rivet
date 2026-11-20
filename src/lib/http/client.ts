import type {
  HttpRequestConfig,
  HttpExecutionResult,
  HttpResponse,
  KeyValuePair,
} from './types'
import { classifyFetchError } from './errors'
import { isRestrictedHeader } from './restrictedHeaders'

/**
 * Validates whether a string can be parsed as an absolute HTTP/HTTPS URL.
 */
export function isValidUrl(rawUrl: string): boolean {
  if (!rawUrl || typeof rawUrl !== 'string') return false
  const trimmed = rawUrl.trim()
  try {
    const parsed = new URL(trimmed)
    return parsed.protocol === 'http:' || parsed.protocol === 'https:'
  } catch {
    return false
  }
}

/**
 * Builds the effective target URL by merging base URL with enabled query parameters.
 */
export function buildEffectiveUrl(
  baseUrl: string,
  params: KeyValuePair[],
): { url: string; error?: string } {
  const trimmed = baseUrl.trim()
  if (!trimmed) {
    return { url: '', error: 'Request URL cannot be empty' }
  }

  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    return {
      url: trimmed,
      error: 'Invalid URL format (must include http:// or https://)',
    }
  }

  // Preserve existing params from the URL if not already explicitly present,
  // then apply enabled params from the editor
  const enabledParams = params.filter(
    (p) => p.enabled && p.key.trim().length > 0,
  )

  // Use URLSearchParams to reliably serialize without string concatenation issues
  const searchParams = new URLSearchParams()
  for (const item of enabledParams) {
    searchParams.append(item.key.trim(), item.value)
  }

  const paramString = searchParams.toString()
  parsed.search = paramString ? `?${paramString}` : ''

  return { url: parsed.toString() }
}

/**
 * Parses query parameters from a URL into an array of KeyValuePair objects.
 */
export function parseQueryParamsFromUrl(urlString: string): KeyValuePair[] {
  try {
    const parsed = new URL(urlString.trim())
    const results: KeyValuePair[] = []
    parsed.searchParams.forEach((value, key) => {
      results.push({
        id: `param-${Math.random().toString(36).slice(2, 9)}`,
        key,
        value,
        enabled: true,
      })
    })
    return results
  } catch {
    return []
  }
}

/**
 * Executes a genuine HTTP request using the browser's Fetch API and measures metrics.
 * Note: Does NOT fabricate mock data or simulate responses.
 */
export async function executeHttpRequest(
  config: HttpRequestConfig,
  signal?: AbortSignal,
): Promise<HttpExecutionResult> {
  const urlBuildResult = buildEffectiveUrl(config.url, config.params)
  if (urlBuildResult.error || !urlBuildResult.url) {
    return {
      error: {
        kind: 'invalid_url',
        message: urlBuildResult.error || 'Invalid URL provided',
        details:
          'Check that the URL begins with http:// or https:// and has a valid hostname.',
        timestamp: Date.now(),
        requestUrl: config.url,
        requestMethod: config.method,
      },
    }
  }

  const targetUrl = urlBuildResult.url
  const headers = new Headers()

  // 1. Add custom enabled headers
  for (const header of config.headers) {
    const key = header.key.trim()
    if (header.enabled && key.length > 0) {
      if (!isRestrictedHeader(key)) {
        try {
          headers.append(key, header.value)
        } catch {
          // If header name contains invalid characters, ignore gracefully
        }
      }
    }
  }

  // 2. Apply Authentication headers
  if (config.auth.type === 'bearer' && config.auth.token.trim()) {
    headers.set('Authorization', `Bearer ${config.auth.token.trim()}`)
  } else if (config.auth.type === 'basic') {
    const creds = `${config.auth.username}:${config.auth.password}`
    try {
      const encoded = btoa(creds)
      headers.set('Authorization', `Basic ${encoded}`)
    } catch {
      // In case characters are out of Latin1 range
    }
  }

  // 3. Prepare body and method
  let requestBody: string | undefined = undefined
  const supportsBody = ['POST', 'PUT', 'PATCH'].includes(config.method)

  if (supportsBody && config.bodyType !== 'none') {
    const trimmedBody = config.body.trim()
    if (trimmedBody) {
      requestBody = trimmedBody
      if (config.bodyType === 'json') {
        if (!headers.has('Content-Type')) {
          headers.set('Content-Type', 'application/json; charset=utf-8')
        }
      }
    }
  }

  const startTime = performance.now()

  try {
    const response = await fetch(targetUrl, {
      method: config.method,
      headers,
      body: requestBody,
      signal,
      cache: 'no-cache',
    })

    const durationMs = Math.round(performance.now() - startTime)
    const rawText = await response.text()

    // Calculate response byte size accurately
    const sizeBytes = new TextEncoder().encode(rawText).length

    // Extract headers into a plain record
    const responseHeaders: Record<string, string> = {}
    response.headers.forEach((value, name) => {
      responseHeaders[name] = value
    })

    const contentType = response.headers.get('content-type') || ''
    let parsedData: unknown | null = null
    let isJson = false

    if (rawText.trim().length > 0) {
      try {
        parsedData = JSON.parse(rawText)
        isJson = true
      } catch {
        isJson = false
      }
    }

    const httpResponse: HttpResponse = {
      status: response.status,
      statusText:
        response.statusText || (response.ok ? 'OK' : 'Response Error'),
      headers: responseHeaders,
      rawBody: rawText,
      data: parsedData,
      isJson,
      contentType,
      sizeBytes,
      durationMs,
      timestamp: Date.now(),
      requestUrl: targetUrl,
      requestMethod: config.method,
    }

    return { response: httpResponse }
  } catch (err) {
    const durationMs = Math.round(performance.now() - startTime)
    const classifiedError = classifyFetchError(
      err,
      durationMs,
      targetUrl,
      config.method,
    )
    return { error: classifiedError }
  }
}
