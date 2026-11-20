import * as React from 'react'
import {
  Copy,
  Check,
  AlertTriangle,
  Loader2,
  Inbox,
  FileCode,
  Layers,
  Info,
} from 'lucide-react'
import type { HttpResponse, HttpError } from '@/lib/http/types'
import { StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ResponseHeaders } from './ResponseHeaders'
import { ResponseMetadata } from './ResponseMetadata'

interface ResponseViewerProps {
  response?: HttpResponse
  error?: HttpError
  isLoading: boolean
  activeTab: 'body' | 'headers' | 'metadata'
  onChangeTab: (tab: 'body' | 'headers' | 'metadata') => void
}

export function ResponseViewer({
  response,
  error,
  isLoading,
  activeTab,
  onChangeTab,
}: ResponseViewerProps) {
  const [copied, setCopied] = React.useState(false)
  const [viewMode, setViewMode] = React.useState<'pretty' | 'raw'>('pretty')

  const copyBody = () => {
    if (!response?.rawBody) return
    navigator.clipboard.writeText(response.rawBody)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  // Initial State: No request sent
  if (!isLoading && !response && !error) {
    return (
      <div className="border border-[var(--border-color)] rounded-lg bg-[var(--bg-surface)] p-8 text-center shadow-xs">
        <div className="mx-auto size-10 rounded-full bg-[var(--bg-surface-raised)] flex items-center justify-center text-[var(--text-muted)] mb-3">
          <Inbox className="size-5" />
        </div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Response Workspace
        </h3>
        <p className="mt-1 text-xs text-[var(--text-muted)] max-w-sm mx-auto leading-relaxed">
          Configure an HTTP method, enter an endpoint URL, and press Send to
          inspect status codes, headers, and payloads.
        </p>
      </div>
    )
  }

  // Loading State
  if (isLoading) {
    return (
      <div className="border border-[var(--border-color)] rounded-lg bg-[var(--bg-surface)] p-12 text-center shadow-xs">
        <div className="mx-auto size-10 flex items-center justify-center text-[var(--accent)] mb-3">
          <Loader2 className="size-6 animate-spin" />
        </div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">
          Executing Request...
        </h3>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Waiting for remote server response. You can cancel with the Cancel
          button above.
        </p>
      </div>
    )
  }

  // Network or Execution Error (No response object)
  if (error && !response) {
    return (
      <div className="border border-red-500/30 rounded-lg bg-[var(--bg-surface)] p-5 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-semibold text-sm">
          <AlertTriangle className="size-4 shrink-0" />
          <span>{error.message}</span>
        </div>

        {error.details && (
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            {error.details}
          </p>
        )}

        <div className="p-3 rounded bg-[var(--bg-surface-raised)] border border-[var(--border-color)] font-mono text-[11px] text-[var(--text-muted)] space-y-1">
          <div>Error Type: {error.kind.toUpperCase()}</div>
          {error.durationMs !== undefined && (
            <div>Duration: {error.durationMs} ms</div>
          )}
          {error.requestUrl && (
            <div className="truncate">Target: {error.requestUrl}</div>
          )}
        </div>

        <div className="text-[11px] text-[var(--text-muted)] leading-relaxed">
          <strong>Troubleshooting tips:</strong>
          <ul className="list-disc pl-4 mt-1 space-y-0.5">
            <li>
              Verify the target server is online and reachable from your
              network.
            </li>
            <li>
              If testing a third-party API, verify it enables the{' '}
              <code className="font-mono">Access-Control-Allow-Origin: *</code>{' '}
              header.
            </li>
            <li>
              Avoid HTTP endpoints when loading Rivet from HTTPS (mixed content
              blockage).
            </li>
          </ul>
        </div>
      </div>
    )
  }

  if (!response) return null

  const isHttpError = response.status >= 400
  const headerCount = Object.keys(response.headers).length

  return (
    <div className="border border-[var(--border-color)] rounded-lg bg-[var(--bg-surface)] shadow-xs overflow-hidden">
      {/* Response Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 border-b border-[var(--border-color)] bg-[var(--bg-surface-raised)]">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge
            status={response.status}
            statusText={response.statusText}
          />
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            {response.durationMs} ms
          </span>
          <span className="text-xs font-mono text-[var(--text-secondary)]">
            {formatSize(response.sizeBytes)}
          </span>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1 bg-[var(--bg-surface)] p-0.5 rounded border border-[var(--border-color)]">
          <button
            type="button"
            onClick={() => onChangeTab('body')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === 'body'
                ? 'bg-[var(--accent)] text-white shadow-2xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <FileCode className="size-3" />
            <span>Body</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('headers')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === 'headers'
                ? 'bg-[var(--accent)] text-white shadow-2xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Layers className="size-3" />
            <span>Headers ({headerCount})</span>
          </button>
          <button
            type="button"
            onClick={() => onChangeTab('metadata')}
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              activeTab === 'metadata'
                ? 'bg-[var(--accent)] text-white shadow-2xs'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            <Info className="size-3" />
            <span>Metadata</span>
          </button>
        </div>
      </div>

      {/* HTTP Error notification banner if 4xx or 5xx */}
      {isHttpError && (
        <div className="px-3 py-2 bg-amber-500/10 border-b border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 flex items-center justify-between">
          <span className="flex items-center gap-1.5 font-medium">
            <AlertTriangle className="size-3.5 shrink-0" />
            Server responded with HTTP {response.status} ({response.statusText}
            ). Body payload is preserved below.
          </span>
        </div>
      )}

      {/* Body Tab Panel */}
      {activeTab === 'body' && (
        <div className="p-3 space-y-2">
          {/* Controls bar */}
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[11px]">
                {response.isJson ? 'JSON' : response.contentType || 'Text'}
              </span>
              {response.isJson && (
                <div className="flex items-center border border-[var(--border-color)] rounded overflow-hidden">
                  <button
                    type="button"
                    onClick={() => setViewMode('pretty')}
                    className={`px-2 py-0.5 text-[10px] font-mono ${
                      viewMode === 'pretty'
                        ? 'bg-[var(--bg-surface-raised)] font-semibold text-[var(--text-primary)]'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    Pretty
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('raw')}
                    className={`px-2 py-0.5 text-[10px] font-mono ${
                      viewMode === 'raw'
                        ? 'bg-[var(--bg-surface-raised)] font-semibold text-[var(--text-primary)]'
                        : 'text-[var(--text-muted)]'
                    }`}
                  >
                    Raw
                  </button>
                </div>
              )}
            </div>

            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={copyBody}
              className="h-7 text-[11px]"
            >
              {copied ? (
                <Check className="size-3 text-emerald-500 mr-1" />
              ) : (
                <Copy className="size-3 mr-1" />
              )}
              {copied ? 'Copied' : 'Copy Payload'}
            </Button>
          </div>

          {/* Response Payload Viewer */}
          <div className="border border-[var(--border-color)] rounded-md bg-[var(--bg-surface-raised)] p-3 overflow-x-auto max-h-[500px]">
            {response.rawBody.trim().length === 0 ? (
              <div className="text-xs text-[var(--text-muted)] italic py-4 text-center">
                (Empty response body)
              </div>
            ) : response.isJson && viewMode === 'pretty' ? (
              <pre className="font-mono text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            ) : (
              <pre className="font-mono text-xs text-[var(--text-primary)] leading-relaxed whitespace-pre-wrap break-all">
                {response.rawBody}
              </pre>
            )}
          </div>
        </div>
      )}

      {/* Headers Tab Panel */}
      {activeTab === 'headers' && (
        <div className="p-3">
          <ResponseHeaders headers={response.headers} />
        </div>
      )}

      {/* Metadata Tab Panel */}
      {activeTab === 'metadata' && (
        <div className="p-3">
          <ResponseMetadata response={response} />
        </div>
      )}
    </div>
  )
}
