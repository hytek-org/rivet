import * as React from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  Activity,
  Check,
  Clock3,
  Command,
  Globe2,
  History,
  Share2,
  ShieldCheck,
  Terminal,
} from 'lucide-react'

import type {
  HttpMethod,
  HttpRequestConfig,
  HttpResponse,
  HttpError,
} from '@/lib/http/types'
import { executeHttpRequest, parseQueryParamsFromUrl } from '@/lib/http/client'
import { recordRequestHistory } from '@/lib/history/storage'
import type { HistoryItem } from '@/lib/history/types'
import { RequestBuilder } from '@/components/request/RequestBuilder'
import { ResponseViewer } from '@/components/response/ResponseViewer'
import { HistoryPanel } from '@/components/history/HistoryPanel'
import { Button } from '@/components/ui/Button'

interface PlaygroundSearch {
  url?: string
  method?: HttpMethod
  tab?: 'params' | 'headers' | 'body' | 'auth'
  respTab?: 'body' | 'headers' | 'metadata'
  q?: string
}

const DEFAULT_URL = 'https://jsonplaceholder.typicode.com/posts/1'
const DEFAULT_METHOD: HttpMethod = 'GET'

export const Route = createFileRoute('/playground')({
  validateSearch: (search: Record<string, unknown>): PlaygroundSearch => {
    const validMethods: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
    const validTabs = ['params', 'headers', 'body', 'auth']
    const validRespTabs = ['body', 'headers', 'metadata']

    return {
      url:
        typeof search.url === 'string' && search.url.trim()
          ? search.url
          : DEFAULT_URL,
      method:
        typeof search.method === 'string' &&
        validMethods.includes(search.method as HttpMethod)
          ? (search.method as HttpMethod)
          : DEFAULT_METHOD,
      tab:
        typeof search.tab === 'string' && validTabs.includes(search.tab)
          ? (search.tab as PlaygroundSearch['tab'])
          : 'params',
      respTab:
        typeof search.respTab === 'string' &&
        validRespTabs.includes(search.respTab)
          ? (search.respTab as PlaygroundSearch['respTab'])
          : 'body',
      q: typeof search.q === 'string' ? search.q : undefined,
    }
  },
  component: PlaygroundPage,
})

function PlaygroundPage() {
  const navigate = useNavigate({ from: Route.fullPath })
  const search = Route.useSearch()

  const abortControllerRef = React.useRef<AbortController | null>(null)
  const shareResetTimerRef = React.useRef<number | null>(null)

  const [config, setConfig] = React.useState<HttpRequestConfig>(() => {
    const initialUrl = search.url || DEFAULT_URL

    return {
      url: initialUrl,
      method: search.method || DEFAULT_METHOD,
      params: parseQueryParamsFromUrl(initialUrl),
      headers: [
        {
          id: 'hdr-accept',
          key: 'Accept',
          value: 'application/json',
          enabled: true,
        },
      ],
      bodyType: 'none',
      body: '',
      auth: { type: 'none' },
    }
  })

  const [requestTab, setRequestTab] = React.useState<
    'params' | 'headers' | 'body' | 'auth'
  >(search.tab || 'params')
  const [responseTab, setResponseTab] = React.useState<
    'body' | 'headers' | 'metadata'
  >(search.respTab || 'body')

  const [isLoading, setIsLoading] = React.useState(false)
  const [response, setResponse] = React.useState<HttpResponse | undefined>()
  const [error, setError] = React.useState<HttpError | undefined>()
  const [historyOpen, setHistoryOpen] = React.useState(false)
  const [sharedCopied, setSharedCopied] = React.useState(false)
  const [shareFailed, setShareFailed] = React.useState(false)

  // Keep the editor in sync when a shared URL or Explore link changes the route.
  React.useEffect(() => {
    setConfig((previous) => {
      const urlChanged = Boolean(search.url && search.url !== previous.url)
      let nextUrl = search.url || previous.url

      if (search.q && (!search.url || !search.url.includes('?'))) {
        const separator = nextUrl.includes('?') ? '&' : '?'
        nextUrl = `${nextUrl}${separator}${search.q.replace(/^\?/, '')}`
      }

      return {
        ...previous,
        url: nextUrl,
        method: search.method || previous.method,
        params: urlChanged || search.q
          ? parseQueryParamsFromUrl(nextUrl)
          : previous.params,
      }
    })
  }, [search.url, search.method, search.q])

  // Keep tab state aligned when a route is opened from a shared link.
  React.useEffect(() => {
    if (search.tab) setRequestTab(search.tab)
    if (search.respTab) setResponseTab(search.respTab)
  }, [search.tab, search.respTab])

  React.useEffect(() => {
    return () => {
      const activeController = abortControllerRef.current
      abortControllerRef.current = null
      activeController?.abort()

      if (shareResetTimerRef.current !== null) {
        window.clearTimeout(shareResetTimerRef.current)
      }
    }
  }, [])

  const handleConfigChange = (patch: Partial<HttpRequestConfig>) => {
    setConfig((previous) => ({ ...previous, ...patch }))

    if (patch.url !== undefined || patch.method !== undefined) {
      navigate({
        search: (old) => ({
          ...old,
          ...(patch.url !== undefined ? { url: patch.url } : {}),
          ...(patch.method !== undefined ? { method: patch.method } : {}),
        }),
        replace: true,
      })
    }
  }

  const handleTabChange = (tab: 'params' | 'headers' | 'body' | 'auth') => {
    setRequestTab(tab)
    navigate({
      search: (old) => ({ ...old, tab }),
      replace: true,
    })
  }

  const handleRespTabChange = (respTab: 'body' | 'headers' | 'metadata') => {
    setResponseTab(respTab)
    navigate({
      search: (old) => ({ ...old, respTab }),
      replace: true,
    })
  }

  const executeRequest = async () => {
    // Only the newest request is allowed to update the visible result.
    abortControllerRef.current?.abort()

    const controller = new AbortController()
    abortControllerRef.current = controller
    const requestConfig = config

    setIsLoading(true)
    setError(undefined)
    setResponse(undefined)

    try {
      const result = await executeHttpRequest(requestConfig, controller.signal)

      if (abortControllerRef.current !== controller) return

      if (result.response) {
        setResponse(result.response)
        recordRequestHistory(requestConfig, { response: result.response })
      } else if (result.error) {
        setError(result.error)
        recordRequestHistory(requestConfig, { error: result.error })
      }
    } catch (err) {
      if (abortControllerRef.current !== controller) return

      const unexpectedError: HttpError = {
        kind: 'unknown',
        message: err instanceof Error ? err.message : 'Execution failed',
        timestamp: Date.now(),
        requestUrl: requestConfig.url,
        requestMethod: requestConfig.method,
      }

      setError(unexpectedError)
      recordRequestHistory(requestConfig, { error: unexpectedError })
    } finally {
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null
        setIsLoading(false)
      }
    }
  }

  const handleCancelRequest = () => {
    const controller = abortControllerRef.current
    if (!controller) return

    controller.abort()
    abortControllerRef.current = null
    setIsLoading(false)
    setResponse(undefined)
    setError({
      kind: 'abort',
      message: 'Request was cancelled',
      details: 'The in-flight HTTP request was manually cancelled.',
      timestamp: Date.now(),
      requestUrl: config.url,
      requestMethod: config.method,
    })
  }

  const handleLoadFromHistory = (item: HistoryItem) => {
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    setIsLoading(false)
    setResponse(undefined)
    setError(undefined)

    const nextConfig: HttpRequestConfig = {
      url: item.url,
      method: item.method,
      params: item.params.map((param) => ({ ...param })),
      headers: item.headers.map((header) => ({ ...header })),
      bodyType: item.bodyType,
      body: item.body || '',
      auth: { type: 'none' }, // Credentials are intentionally not restored from history.
    }

    setConfig(nextConfig)
    navigate({
      search: (old) => ({
        ...old,
        url: item.url,
        method: item.method,
      }),
      replace: true,
    })
  }

  const handleShareUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setSharedCopied(true)
      setShareFailed(false)

      if (shareResetTimerRef.current !== null) {
        window.clearTimeout(shareResetTimerRef.current)
      }

      shareResetTimerRef.current = window.setTimeout(() => {
        setSharedCopied(false)
      }, 2200)
    } catch {
      setSharedCopied(false)
      setShareFailed(true)
    }
  }

  const responseState = isLoading
    ? 'Receiving response'
    : error
      ? 'Request issue'
      : response
        ? 'Response received'
        : 'Awaiting request'

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--bg-app)]">
      <div className="mx-auto w-full max-w-[1480px] px-4 pb-12 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
        {/* Page heading and actions */}
        <header className="mb-8 flex flex-col gap-5 border-b border-[var(--border-color)] pb-7 lg:mb-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="min-w-0">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              <span className="inline-flex size-6 items-center justify-center rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--accent)]">
                <Terminal size={13} strokeWidth={2} />
              </span>
              Rivet workspace
              <span className="text-[var(--text-muted)]/50">/</span>
              Playground
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)] sm:text-4xl">
              API Playground
            </h1>
            <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-[var(--text-secondary)] sm:text-[15px]">
              Compose a request, send it from your browser, and inspect the
              response — all in one focused workspace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleShareUrl}
              title="Copy shareable link"
              className="h-9 rounded-lg px-3 font-semibold"
            >
              {sharedCopied ? (
                <Check className="mr-2 size-3.5 text-emerald-500" />
              ) : (
                <Share2 className="mr-2 size-3.5" />
              )}
              {sharedCopied ? 'Link copied' : 'Share'}
            </Button>

            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setHistoryOpen(true)}
              className="h-9 rounded-lg px-3 font-semibold"
            >
              <History className="mr-2 size-3.5 text-[var(--accent)]" />
              History
            </Button>
          </div>
        </header>

        {shareFailed && (
          <p role="status" className="-mt-5 mb-5 text-xs font-medium text-amber-600 dark:text-amber-400">
            Unable to copy the link. Check your browser clipboard permissions.
          </p>
        )}

        {/* Lightweight product/runtime context */}
        <div className="mb-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-[var(--text-muted)]">
          <span className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-emerald-500" />
            Browser-based execution
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Globe2 className="size-3.5" />
            Native Fetch API
          </span>
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="size-3.5" />
            Credentials excluded from history
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Command className="size-3.5" />
            Quick actions: ⌘K
          </span>
        </div>

        {/* Workspace: request editor and response inspector */}
        <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)]">
          <section
            aria-label="Request Builder"
            className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_8px_30px_-24px_rgba(0,0,0,0.28)]"
          >
            <div className="flex min-h-14 items-center justify-between gap-3 border-b border-[var(--border-color)] px-4 py-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-xs font-bold text-[var(--accent)]">
                  01
                </span>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                    Request builder
                  </h2>
                  <p className="mt-0.5 text-[11px] font-medium text-[var(--text-muted)]">
                    Configure method, URL, headers, and payload
                  </p>
                </div>
              </div>
              <span className="hidden items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-app)] px-2.5 py-1 text-[10px] font-semibold text-[var(--text-muted)] sm:inline-flex">
                <Activity className="size-3" />
                HTTP client
              </span>
            </div>

            <div className="min-w-0 p-3 sm:p-4">
              <RequestBuilder
                config={config}
                isLoading={isLoading}
                onChange={handleConfigChange}
                onSend={executeRequest}
                onCancel={handleCancelRequest}
                activeTab={requestTab}
                onChangeTab={handleTabChange}
              />
            </div>
          </section>

          <section
            aria-label="Response Inspector"
            aria-busy={isLoading}
            className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_8px_30px_-24px_rgba(0,0,0,0.28)]"
          >
            <div className="flex min-h-14 items-center justify-between gap-3 border-b border-[var(--border-color)] px-4 py-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-[var(--bg-surface-raised)] text-xs font-bold text-[var(--text-secondary)]">
                  02
                </span>
                <div className="min-w-0">
                  <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                    Response inspector
                  </h2>
                  <p className="mt-0.5 text-[11px] font-medium text-[var(--text-muted)]">
                    Status, headers, timing, and response body
                  </p>
                </div>
              </div>

              <span
                role="status"
                aria-live="polite"
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                  isLoading
                    ? 'border-[var(--accent)]/25 bg-[var(--accent)]/10 text-[var(--accent)]'
                    : error
                      ? 'border-amber-500/25 bg-amber-500/10 text-amber-700 dark:text-amber-400'
                      : response
                        ? 'border-emerald-500/25 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : 'border-[var(--border-color)] bg-[var(--bg-app)] text-[var(--text-muted)]'
                }`}
              >
                {isLoading ? (
                  <span className="size-1.5 animate-pulse rounded-full bg-current" />
                ) : response ? (
                  <Check className="size-3" />
                ) : error ? (
                  <span className="size-1.5 rounded-full bg-current" />
                ) : (
                  <Clock3 className="size-3" />
                )}
                {responseState}
              </span>
            </div>

            <div className="min-w-0 p-3 sm:p-4">
              <ResponseViewer
                response={response}
                error={error}
                isLoading={isLoading}
                activeTab={responseTab}
                onChangeTab={handleRespTabChange}
              />
            </div>
          </section>
        </div>

        <div className="mt-5 flex flex-col gap-2 border-t border-[var(--border-color)] pt-4 text-[11px] font-medium text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
          <span>
            Requests run from this browser. API availability and CORS policies
            are controlled by the destination server.
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="size-3" />
            Ready for your next request
          </span>
        </div>
      </div>

      <HistoryPanel
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onSelect={handleLoadFromHistory}
      />
    </div>
  )
}
