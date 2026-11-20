import * as React from 'react'
import { History, Trash2, ArrowUpRight, X, Clock } from 'lucide-react'
import {
  getHistory,
  clearHistory,
  deleteHistoryItem,
} from '@/lib/history/storage'
import type { HistoryItem } from '@/lib/history/types'
import { MethodBadge, StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface HistoryPanelProps {
  open: boolean
  onClose: () => void
  onSelect: (item: HistoryItem) => void
}

export function HistoryPanel({ open, onClose, onSelect }: HistoryPanelProps) {
  const [historyItems, setHistoryItems] = React.useState<HistoryItem[]>([])

  const refreshHistory = React.useCallback(() => {
    setHistoryItems(getHistory())
  }, [])

  React.useEffect(() => {
    if (open) {
      refreshHistory()
    }
  }, [open, refreshHistory])

  const handleClearAll = () => {
    if (
      window.confirm(
        'Are you sure you want to clear your local request history?',
      )
    ) {
      clearHistory()
      setHistoryItems([])
    }
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    deleteHistoryItem(id)
    setHistoryItems((prev) => prev.filter((i) => i.id !== id))
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-xs">
      <div
        className="w-full max-w-md h-full bg-[var(--bg-surface)] border-l border-[var(--border-color)] shadow-2xl flex flex-col animate-in slide-in-from-right duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <History className="size-4 text-[var(--accent)]" />
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Request History
            </h2>
            <span className="text-xs text-[var(--text-muted)] font-mono">
              ({historyItems.length})
            </span>
          </div>
          <div className="flex items-center gap-1">
            {historyItems.length > 0 && (
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
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] rounded"
              aria-label="Close history"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {historyItems.length === 0 ? (
            <div className="py-16 text-center text-xs text-[var(--text-muted)] space-y-2">
              <Clock className="size-8 mx-auto opacity-40 mb-2" />
              <div className="font-medium text-[var(--text-primary)]">
                No history recorded yet
              </div>
              <p className="max-w-xs mx-auto">
                Completed requests will automatically appear here.
                Authentication tokens are stripped for privacy.
              </p>
            </div>
          ) : (
            historyItems.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelect(item)
                  onClose()
                }}
                className="p-3 rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-raised)] hover:border-[var(--accent)] cursor-pointer transition-all space-y-2 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <MethodBadge method={item.method} size="sm" />
                    <span className="text-xs font-mono text-[var(--text-primary)] truncate font-medium">
                      {item.url}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => handleDelete(item.id, e)}
                    className="opacity-0 group-hover:opacity-100 text-[var(--text-muted)] hover:text-red-500 p-1 transition-opacity"
                    title="Delete entry"
                  >
                    <Trash2 className="size-3.5" />
                  </button>
                </div>

                <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] pt-1 border-t border-[var(--border-color)]">
                  <div className="flex items-center gap-2">
                    {item.status ? (
                      <StatusBadge
                        status={item.status}
                        statusText={item.statusText}
                      />
                    ) : item.error ? (
                      <span className="text-red-500 text-[10px] font-semibold">
                        Failed
                      </span>
                    ) : (
                      <span>Unavailable</span>
                    )}
                    {item.durationMs !== undefined && (
                      <span>{item.durationMs}ms</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{new Date(item.timestamp).toLocaleTimeString()}</span>
                    <ArrowUpRight className="size-3 text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-[var(--bg-surface-raised)] border-t border-[var(--border-color)] text-[11px] text-[var(--text-muted)]">
          History is saved locally in your browser storage (max 50 items).
        </div>
      </div>
    </div>
  )
}
