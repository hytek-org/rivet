import * as React from 'react'
import { CheckCircle2, AlertCircle, Wand2, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { HttpMethod, BodyType } from '@/lib/http/types'

interface BodyEditorProps {
  method: HttpMethod
  bodyType: BodyType
  body: string
  onChangeType: (type: BodyType) => void
  onChangeBody: (body: string) => void
}

export function BodyEditor({
  method,
  bodyType,
  body,
  onChangeType,
  onChangeBody,
}: BodyEditorProps) {
  const isBodySupported = ['POST', 'PUT', 'PATCH'].includes(method)

  // Real-time JSON validation
  const validation = React.useMemo(() => {
    if (!isBodySupported || bodyType !== 'json') return { valid: true }
    const trimmed = body.trim()
    if (!trimmed) return { valid: true, empty: true }
    try {
      JSON.parse(trimmed)
      return { valid: true, error: null }
    } catch (err) {
      return {
        valid: false,
        error: err instanceof Error ? err.message : 'Invalid JSON format',
      }
    }
  }, [body, bodyType, isBodySupported])

  const handlePrettify = () => {
    const trimmed = body.trim()
    if (!trimmed) return
    try {
      const parsed = JSON.parse(trimmed)
      onChangeBody(JSON.stringify(parsed, null, 2))
    } catch {
      // Keep as-is if invalid
    }
  }

  const handleClear = () => {
    onChangeBody('')
  }

  const handleLoadSample = () => {
    const sample = JSON.stringify(
      {
        title: 'New API resource',
        description: 'Testing request payload sent via Rivet',
        active: true,
        priority: 1,
      },
      null,
      2,
    )
    onChangeBody(sample)
    if (bodyType !== 'json') {
      onChangeType('json')
    }
  }

  if (!isBodySupported) {
    return (
      <div className="p-6 border border-[var(--border-color)] rounded-md bg-[var(--bg-surface-raised)] text-center text-xs text-[var(--text-muted)]">
        The HTTP specification and browser{' '}
        <code className="font-mono">fetch</code> API do not support sending
        request bodies with{' '}
        <span className="font-semibold text-[var(--text-primary)]">
          {method}
        </span>{' '}
        requests.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Body format bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 bg-[var(--bg-surface-raised)] p-0.5 rounded border border-[var(--border-color)]">
          <button
            type="button"
            onClick={() => onChangeType('json')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              bodyType === 'json'
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xs font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            JSON (application/json)
          </button>
          <button
            type="button"
            onClick={() => onChangeType('text')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              bodyType === 'text'
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xs font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            Raw Text
          </button>
          <button
            type="button"
            onClick={() => onChangeType('none')}
            className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
              bodyType === 'none'
                ? 'bg-[var(--bg-surface)] text-[var(--text-primary)] shadow-2xs font-semibold'
                : 'text-[var(--text-muted)] hover:text-[var(--text-primary)]'
            }`}
          >
            None
          </button>
        </div>

        {bodyType !== 'none' && (
          <div className="flex items-center gap-2">
            {bodyType === 'json' && (
              <Button
                type="button"
                variant="secondary"
                size="xs"
                onClick={handlePrettify}
                disabled={!validation.valid || !body.trim()}
              >
                <Wand2 className="size-3 mr-1" />
                Format JSON
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              size="xs"
              onClick={handleLoadSample}
            >
              Sample JSON
            </Button>
            {body.trim() && (
              <Button
                type="button"
                variant="ghost"
                size="xs"
                onClick={handleClear}
                className="text-[var(--text-muted)] hover:text-red-500"
              >
                <Trash2 className="size-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        )}
      </div>

      {bodyType === 'none' ? (
        <div className="p-6 border border-dashed border-[var(--border-color)] rounded-md text-center text-xs text-[var(--text-muted)]">
          No request body will be sent with this {method} request.{' '}
          <button
            type="button"
            onClick={() => onChangeType('json')}
            className="text-[var(--accent)] hover:underline ml-1 font-medium"
          >
            Add JSON body
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="border border-[var(--border-color)] rounded-md overflow-hidden bg-[var(--bg-surface)] focus-within:border-[var(--accent)]">
            <textarea
              value={body}
              onChange={(e) => onChangeBody(e.target.value)}
              placeholder={
                bodyType === 'json'
                  ? '{\n  "key": "value"\n}'
                  : 'Enter raw request text...'
              }
              rows={8}
              spellCheck={false}
              className="w-full p-3 font-mono text-xs bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] resize-y outline-none leading-relaxed"
            />
          </div>

          {/* Validation Feedback Bar */}
          {bodyType === 'json' && body.trim() && (
            <div
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono border ${
                validation.valid
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
                  : 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
              }`}
            >
              {validation.valid ? (
                <>
                  <CheckCircle2 className="size-3.5 shrink-0" />
                  <span>Valid JSON structure</span>
                </>
              ) : (
                <>
                  <AlertCircle className="size-3.5 shrink-0" />
                  <span>JSON Syntax Error: {validation.error}</span>
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
