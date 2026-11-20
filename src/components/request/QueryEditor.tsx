import * as React from 'react'
import { Plus, Trash2, Check, Copy } from 'lucide-react'
import type { KeyValuePair } from '@/lib/http/types'
import { Button } from '@/components/ui/Button'

interface QueryEditorProps {
  params: KeyValuePair[]
  onChange: (params: KeyValuePair[]) => void
}

export function QueryEditor({ params, onChange }: QueryEditorProps) {
  const [copied, setCopied] = React.useState(false)

  const handleToggle = (id: string) => {
    onChange(
      params.map((p) => (p.id === id ? { ...p, enabled: !p.enabled } : p)),
    )
  }

  const handleUpdate = (id: string, field: 'key' | 'value', val: string) => {
    onChange(params.map((p) => (p.id === id ? { ...p, [field]: val } : p)))
  }

  const handleDelete = (id: string) => {
    onChange(params.filter((p) => p.id !== id))
  }

  const handleAdd = () => {
    const newItem: KeyValuePair = {
      id: `param-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      key: '',
      value: '',
      enabled: true,
    }
    onChange([...params, newItem])
  }

  const handleClearAll = () => {
    onChange([])
  }

  // Generate query string preview
  const queryString = React.useMemo(() => {
    const active = params.filter((p) => p.enabled && p.key.trim().length > 0)
    if (active.length === 0) return ''
    const sp = new URLSearchParams()
    active.forEach((p) => sp.append(p.key.trim(), p.value))
    return `?${sp.toString()}`
  }, [params])

  const copyQueryString = () => {
    if (!queryString) return
    navigator.clipboard.writeText(queryString)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-[var(--text-secondary)]">
          Query Parameters (
          {params.filter((p) => p.enabled && p.key.trim()).length} active)
        </div>
        <div className="flex items-center gap-2">
          {params.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="xs"
              onClick={handleClearAll}
              className="text-[var(--text-muted)] hover:text-red-500"
            >
              Clear all
            </Button>
          )}
          <Button
            type="button"
            variant="secondary"
            size="xs"
            onClick={handleAdd}
          >
            <Plus className="size-3 mr-1" />
            Add parameter
          </Button>
        </div>
      </div>

      {params.length === 0 ? (
        <div className="p-6 border border-dashed border-[var(--border-color)] rounded-md text-center text-xs text-[var(--text-muted)]">
          No query parameters configured.{' '}
          <button
            type="button"
            onClick={handleAdd}
            className="text-[var(--accent)] hover:underline ml-1 font-medium"
          >
            Add one
          </button>
        </div>
      ) : (
        <div className="border border-[var(--border-color)] rounded-md overflow-hidden bg-[var(--bg-surface)]">
          <div className="grid grid-cols-[36px_1fr_1fr_40px] gap-2 px-3 py-1.5 bg-[var(--bg-surface-raised)] border-b border-[var(--border-color)] text-[11px] font-mono text-[var(--text-muted)]">
            <span className="text-center">On</span>
            <span>Parameter Key</span>
            <span>Value</span>
            <span />
          </div>

          <div className="divide-y divide-[var(--border-color)]">
            {params.map((param) => (
              <div
                key={param.id}
                className="grid grid-cols-[36px_1fr_1fr_40px] items-center gap-2 px-3 py-1.5"
              >
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    checked={param.enabled}
                    onChange={() => handleToggle(param.id)}
                    aria-label={`Enable parameter ${param.key || 'unnamed'}`}
                    className="size-3.5 rounded border-[var(--border-color)] text-[var(--accent)] focus:ring-[var(--accent)]"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={param.key}
                    onChange={(e) =>
                      handleUpdate(param.id, 'key', e.target.value)
                    }
                    placeholder="Key (e.g. limit)"
                    className="w-full text-xs font-mono bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    value={param.value}
                    onChange={(e) =>
                      handleUpdate(param.id, 'value', e.target.value)
                    }
                    placeholder="Value (e.g. 20)"
                    className="w-full text-xs font-mono bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleDelete(param.id)}
                    className="text-[var(--text-muted)] hover:text-red-500 p-1 transition-colors"
                    aria-label="Delete parameter"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Compiled query string preview */}
      {queryString && (
        <div className="flex items-center justify-between px-3 py-2 bg-[var(--bg-surface-raised)] border border-[var(--border-color)] rounded-md font-mono text-[11px] text-[var(--text-secondary)]">
          <span className="truncate mr-2 font-mono">
            <span className="text-[var(--text-muted)] select-none">
              Compiled:{' '}
            </span>
            {queryString}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="xs"
            onClick={copyQueryString}
            className="shrink-0 text-[10px]"
          >
            {copied ? (
              <Check className="size-3 text-emerald-500" />
            ) : (
              <Copy className="size-3" />
            )}
            {copied ? 'Copied' : 'Copy'}
          </Button>
        </div>
      )}
    </div>
  )
}
