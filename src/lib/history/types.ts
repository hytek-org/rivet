import type { HttpMethod, KeyValuePair } from '../http/types'

export interface HistoryItem {
  id: string
  timestamp: number
  method: HttpMethod
  url: string
  status?: number
  statusText?: string
  durationMs?: number
  error?: string
  params: KeyValuePair[]
  headers: KeyValuePair[]
  bodyType: 'none' | 'json' | 'text'
  body?: string
}
