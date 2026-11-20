import { Plus, Trash2, AlertTriangle } from 'lucide-react'
import type { KeyValuePair } from '@/lib/http/types'
import {
  isRestrictedHeader,
  getRestrictedHeaderExplanation,
} from '@/lib/http/restrictedHeaders'
import { Button } from '@/components/ui/Button'

interface HeadersEditorProps {
  headers: KeyValuePair[]
  onChange: (headers: KeyValuePair[]) => void
}

const COMMON_HEADER_KEYS = [
  'Accept',
  'Content-Type',
  'Authorization',
  'Cache-Control',
  'X-Requested-With',
  'X-API-Key',
]

export function HeadersEditor({ headers, onChange }: HeadersEditorProps) {
  const handleToggle = (id: string) => {
    onChange(
      headers.map((h) => (h.id === id ? { ...h, enabled: !h.enabled } : h)),
    )
  }

  const handleUpdate = (id: string, field: 'key' | 'value', val: string) => {
    onChange(headers.map((h) => (h.id === id ? { ...h, [field]: val } : h)))
  }

  const handleDelete = (id: string) => {
    onChange(headers.filter((h) => h.id !== id))
  }

  const handleAdd = (defaultKey = '', defaultValue = '') => {
    const newItem: KeyValuePair = {
      id: `header-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      key: defaultKey,
      value: defaultValue,
      enabled: true,
    }
    onChange([...headers, newItem])
  }

  const handleClearAll = () => {
    onChange([])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-[var(--text-secondary)]">
          Request Headers (
          {headers.filter((h) => h.enabled && h.key.trim()).length} active)
        </div>
        <div className="flex items-center gap-2">
          {headers.length > 0 && (
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
            onClick={() => handleAdd()}
          >
            <Plus className="size-3 mr-1" />
            Add header
          </Button>
        </div>
      </div>

      {headers.length === 0 ? (
        <div className="p-6 border border-dashed border-[var(--border-color)] rounded-md text-center text-xs text-[var(--text-muted)]">
          No custom headers configured.{' '}
          <button
            type="button"
            onClick={() => handleAdd('Accept', 'application/json')}
            className="text-[var(--accent)] hover:underline ml-1 font-medium"
          >
            Add standard Accept header
          </button>
        </div>
      ) : (
        <div className="border border-[var(--border-color)] rounded-md overflow-hidden bg-[var(--bg-surface)]">
          <div className="grid grid-cols-[36px_1fr_1fr_40px] gap-2 px-3 py-1.5 bg-[var(--bg-surface-raised)] border-b border-[var(--border-color)] text-[11px] font-mono text-[var(--text-muted)]">
            <span className="text-center">On</span>
            <span>Header Name</span>
            <span>Value</span>
            <span />
          </div>

          <datalist id="common-headers-list">
            {COMMON_HEADER_KEYS.map((k) => (
              <option key={k} value={k} />
            ))}
          </datalist>

          <div className="divide-y divide-[var(--border-color)]">
            {headers.map((header) => {
              const restricted = isRestrictedHeader(header.key)
              const warningText = restricted
                ? getRestrictedHeaderExplanation(header.key)
                : null

              return (
                <div
                  key={header.id}
                  className="grid grid-cols-[36px_1fr_1fr_40px] items-center gap-2 px-3 py-1.5"
                >
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={header.enabled}
                      onChange={() => handleToggle(header.id)}
                      aria-label={`Enable header ${header.key || 'unnamed'}`}
                      className="size-3.5 rounded border-[var(--border-color)] text-[var(--accent)] focus:ring-[var(--accent)]"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 relative">
                    <input
                      type="text"
                      list="common-headers-list"
                      value={header.key}
                      onChange={(e) =>
                        handleUpdate(header.id, 'key', e.target.value)
                      }
                      placeholder="Header (e.g. Accept)"
                      className="w-full text-xs font-mono bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
                    />
                    {restricted && (
                      <span
                        title={warningText ?? 'Restricted by browser Fetch API'}
                        className="cursor-help text-amber-500 shrink-0"
                      >
                        <AlertTriangle className="size-3.5" />
                      </span>
                    )}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={header.value}
                      onChange={(e) =>
                        handleUpdate(header.id, 'value', e.target.value)
                      }
                      placeholder="Value (e.g. application/json)"
                      className="w-full text-xs font-mono bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
                    />
                  </div>
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleDelete(header.id)}
                      className="text-[var(--text-muted)] hover:text-red-500 p-1 transition-colors"
                      aria-label="Delete header"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Explanatory note about browser restricted headers */}
      <div className="text-[11px] text-[var(--text-muted)] leading-relaxed">
        <strong>Browser Fetch note:</strong> Certain headers such as{' '}
        <code className="font-mono">Host</code>,{' '}
        <code className="font-mono">Cookie</code>,{' '}
        <code className="font-mono">Origin</code>, and{' '}
        <code className="font-mono">Sec-*</code> are governed exclusively by
        browser security policy and cannot be altered by JavaScript.
      </div>
    </div>
  )
}
