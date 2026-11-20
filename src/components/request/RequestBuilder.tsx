import * as React from 'react'
import { Send, X, AlertCircle } from 'lucide-react'
import type { HttpMethod, HttpRequestConfig } from '@/lib/http/types'
import { isValidUrl } from '@/lib/http/client'
import { Button } from '@/components/ui/Button'
import { QueryEditor } from './QueryEditor'
import { HeadersEditor } from './HeadersEditor'
import { BodyEditor } from './BodyEditor'
import { AuthEditor } from './AuthEditor'

interface RequestBuilderProps {
  config: HttpRequestConfig
  isLoading: boolean
  onChange: (patch: Partial<HttpRequestConfig>) => void
  onSend: () => void
  onCancel: () => void
  activeTab: 'params' | 'headers' | 'body' | 'auth'
  onChangeTab: (tab: 'params' | 'headers' | 'body' | 'auth') => void
}

const METHODS: HttpMethod[] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']

export function RequestBuilder({
  config,
  isLoading,
  onChange,
  onSend,
  onCancel,
  activeTab,
  onChangeTab,
}: RequestBuilderProps) {
  const urlValid = React.useMemo(() => {
    if (!config.url.trim()) return true
    return isValidUrl(config.url)
  }, [config.url])

  const enabledParamsCount = config.params.filter(
    (p) => p.enabled && p.key.trim(),
  ).length
  const enabledHeadersCount = config.headers.filter(
    (h) => h.enabled && h.key.trim(),
  ).length
  const hasBody =
    ['POST', 'PUT', 'PATCH'].includes(config.method) &&
    config.bodyType !== 'none' &&
    config.body.trim().length > 0
  const hasAuth = config.auth.type !== 'none'

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isLoading) {
      onCancel()
    } else {
      onSend()
    }
  }

  return (
    <div className="border border-[var(--border-color)] rounded-lg bg-[var(--bg-surface)] shadow-xs overflow-hidden">
      {/* Top Request Bar: Method selector, URL input, Send Button */}
      <form
        onSubmit={handleSubmit}
        className="p-3 border-b border-[var(--border-color)]"
      >
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          {/* Method Selector */}
          <div className="relative shrink-0 w-full sm:w-28">
            <select
              value={config.method}
              onChange={(e) =>
                onChange({ method: e.target.value as HttpMethod })
              }
              disabled={isLoading}
              className="w-full h-9 px-3 font-mono font-semibold text-xs border border-[var(--border-color)] rounded bg-[var(--bg-surface-raised)] text-[var(--text-primary)] outline-none focus:border-[var(--accent)] cursor-pointer"
            >
              {METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          {/* URL Input */}
          <div className="relative flex-1 flex items-center">
            <input
              type="text"
              value={config.url}
              onChange={(e) => onChange({ url: e.target.value })}
              placeholder="https://api.example.com/v1/resource"
              disabled={isLoading}
              className={`w-full h-9 px-3 pr-8 font-mono text-xs border rounded bg-[var(--bg-surface-raised)] text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none transition-colors ${
                !urlValid
                  ? 'border-red-500 focus:border-red-500'
                  : 'border-[var(--border-color)] focus:border-[var(--accent)]'
              }`}
            />
            {config.url && (
              <button
                type="button"
                onClick={() => onChange({ url: '' })}
                disabled={isLoading}
                className="absolute right-2.5 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                aria-label="Clear URL"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Send / Cancel Button */}
          <div className="flex items-center gap-2">
            {isLoading ? (
              <Button
                type="button"
                variant="destructive"
                onClick={onCancel}
                className="w-full sm:w-auto h-9 font-semibold"
              >
                <X className="size-3.5 mr-1" />
                Cancel
              </Button>
            ) : (
              <Button
                type="submit"
                variant="default"
                disabled={!config.url.trim() || !urlValid}
                className="w-full sm:w-auto h-9 font-semibold px-5"
              >
                <Send className="size-3.5 mr-1.5" />
                Send
              </Button>
            )}
          </div>
        </div>

        {/* Invalid URL validation hint */}
        {!urlValid && (
          <div className="mt-2 flex items-center gap-1.5 text-[11px] text-red-500 font-medium">
            <AlertCircle className="size-3.5 shrink-0" />
            <span>
              Please enter a valid absolute HTTP or HTTPS URL (e.g.
              https://api.example.com).
            </span>
          </div>
        )}
      </form>

      {/* Request Configuration Tabs */}
      <div className="flex items-center px-3 border-b border-[var(--border-color)] bg-[var(--bg-surface-raised)] gap-1">
        <button
          type="button"
          onClick={() => onChangeTab('params')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'params'
              ? 'border-[var(--accent)] text-[var(--text-primary)] font-semibold'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <span>Params</span>
          {enabledParamsCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[var(--accent)]/15 text-[var(--accent)]">
              {enabledParamsCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onChangeTab('headers')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'headers'
              ? 'border-[var(--accent)] text-[var(--text-primary)] font-semibold'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <span>Headers</span>
          {enabledHeadersCount > 0 && (
            <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono bg-[var(--accent)]/15 text-[var(--accent)]">
              {enabledHeadersCount}
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => onChangeTab('body')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'body'
              ? 'border-[var(--accent)] text-[var(--text-primary)] font-semibold'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <span>Body</span>
          {hasBody && (
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          )}
        </button>

        <button
          type="button"
          onClick={() => onChangeTab('auth')}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
            activeTab === 'auth'
              ? 'border-[var(--accent)] text-[var(--text-primary)] font-semibold'
              : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          <span>Auth</span>
          {hasAuth && (
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
          )}
        </button>
      </div>

      {/* Active Tab Panel */}
      <div className="p-4">
        {activeTab === 'params' && (
          <QueryEditor
            params={config.params}
            onChange={(params) => onChange({ params })}
          />
        )}

        {activeTab === 'headers' && (
          <HeadersEditor
            headers={config.headers}
            onChange={(headers) => onChange({ headers })}
          />
        )}

        {activeTab === 'body' && (
          <BodyEditor
            method={config.method}
            bodyType={config.bodyType}
            body={config.body}
            onChangeType={(bodyType) => onChange({ bodyType })}
            onChangeBody={(body) => onChange({ body })}
          />
        )}

        {activeTab === 'auth' && (
          <AuthEditor
            auth={config.auth}
            onChange={(auth) => onChange({ auth })}
          />
        )}
      </div>
    </div>
  )
}
