import type { HistoryItem } from './types'
import type { HttpRequestConfig, HttpResponse, HttpError } from '../http/types'

const STORAGE_KEY = 'rivet_request_history'
const MAX_HISTORY_ITEMS = 50

/**
 * Loads request history from localStorage safely.
 */
export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) return []

    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    // Filter and sanitize entries
    return parsed.filter((item): item is HistoryItem =>
      Boolean(
        item &&
        typeof item === 'object' &&
        typeof item.id === 'string' &&
        item.url,
      ),
    )
  } catch (err) {
    console.warn('Failed to parse Rivet history from localStorage:', err)
    return []
  }
}

/**
 * Sanitizes headers by stripping any Authorization or Cookie credentials.
 */
function sanitizeHeaders(headers: HttpRequestConfig['headers']) {
  return headers
    .filter((h) => {
      const key = h.key.trim().toLowerCase()
      // Strip sensitive headers
      return key !== 'authorization' && key !== 'cookie' && key !== 'x-api-key'
    })
    .map((h) => ({ ...h }))
}

/**
 * Saves a completed request into history. Never saves secrets or tokens.
 */
export function recordRequestHistory(
  config: HttpRequestConfig,
  result?: { response?: HttpResponse; error?: HttpError },
): HistoryItem {
  const current = getHistory()

  const safeHeaders = sanitizeHeaders(config.headers)

  // Status is only recorded if a genuine response was returned
  const status = result?.response?.status
  const statusText = result?.response?.statusText
  const durationMs = result?.response?.durationMs ?? result?.error?.durationMs
  const error = result?.error?.message

  const item: HistoryItem = {
    id: `hist_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: Date.now(),
    method: config.method,
    url: config.url,
    status,
    statusText,
    durationMs,
    error,
    params: config.params.map((p) => ({ ...p })),
    headers: safeHeaders,
    bodyType: config.bodyType,
    body:
      config.method === 'GET' || config.method === 'DELETE'
        ? undefined
        : config.body,
  }

  const updated = [item, ...current.filter((h) => h.id !== item.id)].slice(
    0,
    MAX_HISTORY_ITEMS,
  )

  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.warn('Failed to save Rivet history to localStorage:', err)
  }

  return item
}

/**
 * Clears all saved request history.
 */
export function clearHistory(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.warn('Failed to clear Rivet history:', err)
  }
}

/**
 * Deletes a single history item by id.
 */
export function deleteHistoryItem(id: string): void {
  const current = getHistory()
  const updated = current.filter((item) => item.id !== id)
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch (err) {
    console.warn('Failed to update Rivet history:', err)
  }
}
