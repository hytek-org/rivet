export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface KeyValuePair {
  id: string
  key: string
  value: string
  enabled: boolean
  description?: string
}

export type AuthType = 'none' | 'bearer' | 'basic'

export interface NoneAuthConfig {
  type: 'none'
}

export interface BearerAuthConfig {
  type: 'bearer'
  token: string
}

export interface BasicAuthConfig {
  type: 'basic'
  username: string
  password: string
}

export type AuthConfig = NoneAuthConfig | BearerAuthConfig | BasicAuthConfig

export type BodyType = 'none' | 'json' | 'text'

export interface HttpRequestConfig {
  id?: string
  url: string
  method: HttpMethod
  params: KeyValuePair[]
  headers: KeyValuePair[]
  bodyType: BodyType
  body: string
  auth: AuthConfig
}

export interface HttpResponse {
  status: number
  statusText: string
  headers: Record<string, string>
  rawBody: string
  data: unknown | null
  isJson: boolean
  contentType: string
  sizeBytes: number
  durationMs: number
  timestamp: number
  requestUrl: string
  requestMethod: HttpMethod
}

export type HttpErrorKind =
  'network' | 'cors' | 'abort' | 'timeout' | 'invalid_url' | 'parse' | 'unknown'

export interface HttpError {
  kind: HttpErrorKind
  message: string
  details?: string
  durationMs?: number
  timestamp: number
  requestUrl?: string
  requestMethod?: HttpMethod
}

export interface HttpExecutionResult {
  response?: HttpResponse
  error?: HttpError
}
