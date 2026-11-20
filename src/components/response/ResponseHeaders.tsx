import * as React from 'react'
import { Copy, Check, Search } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface ResponseHeadersProps {
  headers: Record<string, string>
}

export function ResponseHeaders({ headers }: ResponseHeadersProps) {
  const [filter, setFilter] = React.useState('')
  const [copiedKey, setCopiedKey] = React.useState<string | null>(null)

  const entries = Object.entries(headers)

  const filteredEntries = React.useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return entries
    return entries.filter(
      ([key, val]) =>
        key.toLowerCase().includes(q) || val.toLowerCase().includes(q),
    )
  }, [entries, filter])

  const copyHeader = (key: string, value: string) => {
    navigator.clipboard.writeText(`${key}: ${value}`)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 1500)
  }

  if (entries.length === 0) {
    return (
      <div className="p-6 text-center text-xs text-[var(--text-muted)] border border-dashed border-[var(--border-color)] rounded-md">
        No response headers were returned or accessible by the browser.
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Search Header filter */}
      <div className="relative">
        <Search className="size-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)]" />
        <input
          type="text"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Filter headers by key or value..."
          className="w-full h-8 pl-8 pr-3 text-xs bg-[var(--bg-surface-raised)] border border-[var(--border-color)] rounded text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)] font-mono"
        />
      </div>

      <div className="border border-[var(--border-color)] rounded-md overflow-hidden bg-[var(--bg-surface)]">
        <div className="grid grid-cols-[1fr_2fr_60px] gap-2 px-3 py-1.5 bg-[var(--bg-surface-raised)] border-b border-[var(--border-color)] text-[11px] font-mono text-[var(--text-muted)]">
          <span>Header Name</span>
          <span>Value</span>
          <span className="text-right">Action</span>
        </div>

        <div className="divide-y divide-[var(--border-color)] max-h-80 overflow-y-auto">
          {filteredEntries.map(([key, value]) => {
            const isCopied = copiedKey === key

            return (
              <div
                key={key}
                className="grid grid-cols-[1fr_2fr_60px] items-center gap-2 px-3 py-2 text-xs font-mono"
              >
                <span
                  className="font-semibold text-[var(--text-primary)] truncate"
                  title={key}
                >
                  {key}
                </span>
                <span
                  className="text-[var(--text-secondary)] break-all select-all text-[11px]"
                  title={value}
                >
                  {value}
                </span>
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={() => copyHeader(key, value)}
                    className="h-6 px-1.5 text-[10px]"
                    title="Copy header line"
                  >
                    {isCopied ? (
                      <Check className="size-3 text-emerald-500" />
                    ) : (
                      <Copy className="size-3" />
                    )}
                  </Button>
                </div>
              </div>
            )
          })}

          {filteredEntries.length === 0 && (
            <div className="p-4 text-center text-xs text-[var(--text-muted)]">
              No headers matching &quot;{filter}&quot;.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
