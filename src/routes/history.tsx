import * as React from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
  ArrowRight,
  ArrowUpRight,
  Clock3,
  Database,
  History,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from 'lucide-react'

import {
  getHistory,
  clearHistory,
  deleteHistoryItem,
} from '@/lib/history/storage'
import type { HistoryItem } from '@/lib/history/types'
import { MethodBadge, StatusBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export const Route = createFileRoute('/history')({
  component: HistoryPage,
})

function formatTimestamp(timestamp: number, withTime = true) {
  const date = new Date(timestamp)

  if (Number.isNaN(date.getTime())) return 'Unknown date'

  return withTime
    ? date.toLocaleString(undefined, {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : date.toLocaleTimeString(undefined, {
        hour: '2-digit',
        minute: '2-digit',
      })
}

function HistoryPage() {
  const navigate = useNavigate()
  const [items, setItems] = React.useState<HistoryItem[]>([])
  const [query, setQuery] = React.useState('')
  const [selectedId, setSelectedId] = React.useState<string | null>(null)

  React.useEffect(() => {
    const storedItems = getHistory()
    setItems(storedItems)
    setSelectedId(storedItems[0]?.id ?? null)
  }, [])

  const selectedItem = React.useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  )

  const filteredItems = React.useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return items

    return items.filter((item) => {
      const searchableFields = [
        item.url,
        item.method,
        item.status?.toString() ?? '',
        item.statusText ?? '',
        item.error ?? '',
      ]

      return searchableFields.some((field) =>
        field.toLowerCase().includes(normalizedQuery),
      )
    })
  }, [items, query])

  const successfulCount = items.filter(
    (item) => item.status !== undefined && item.status >= 200 && item.status < 400,
  ).length
  const failedCount = items.filter((item) => Boolean(item.error)).length

  const handleClearAll = () => {
    if (
      !window.confirm(
        'Are you sure you want to delete all saved request history?',
      )
    ) {
      return
    }

    clearHistory()
    setItems([])
    setSelectedId(null)
    setQuery('')
  }

  const handleDeleteItem = (id: string) => {
    const deletedIndex = items.findIndex((item) => item.id === id)
    deleteHistoryItem(id)

    const remainingItems = items.filter((item) => item.id !== id)
    setItems(remainingItems)

    if (selectedId === id) {
      const nextSelection =
        remainingItems[Math.min(Math.max(deletedIndex, 0), remainingItems.length - 1)]
      setSelectedId(remainingItems.length === 0 ? null : nextSelection.id)
    }
  }

  const handleOpenInPlayground = (item: HistoryItem) => {
    navigate({
      to: '/playground',
      search: {
        url: item.url,
        method: item.method,
        tab: 'params',
      },
    })
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--bg-app)]">
      <div className="mx-auto w-full max-w-[1480px] px-4 pb-16 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
        {/* Page heading */}
        <header className="mb-8 flex flex-col gap-6 border-b border-[var(--border-color)] pb-7 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
              <span className="flex size-6 items-center justify-center rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--accent)]">
                <History size={13} strokeWidth={2} />
              </span>
              Rivet workspace
              <span className="text-[var(--text-muted)]/50">/</span>
              History
            </div>

            <h1 className="text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)] sm:text-4xl">
              Request history
            </h1>
            <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-[var(--text-secondary)] sm:text-[15px]">
              Revisit previous requests, inspect their configuration, and send
              them to the Playground again.
            </p>
          </div>

          {items.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearAll}
              className="h-9 w-fit rounded-lg border-red-500/25 px-3 font-semibold text-red-600 hover:border-red-500/40 hover:bg-red-500/5 dark:text-red-400"
            >
              <Trash2 className="mr-2 size-3.5" />
              Clear history
            </Button>
          )}
        </header>

        {/* History overview */}
        <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4">
            <span className="flex size-9 items-center justify-center rounded-lg bg-[var(--accent)]/10 text-[var(--accent)]">
              <Database className="size-4" />
            </span>
            <div>
              <p className="text-xl font-semibold tracking-tight text-[var(--text-primary)] tabular-nums">
                {items.length}
              </p>
              <p className="text-[11px] font-medium text-[var(--text-muted)]">
                Saved requests
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4">
            <span className="flex size-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <ArrowRight className="size-4" />
            </span>
            <div>
              <p className="text-xl font-semibold tracking-tight text-[var(--text-primary)] tabular-nums">
                {successfulCount}
              </p>
              <p className="text-[11px] font-medium text-[var(--text-muted)]">
                Successful responses
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4">
            <span className="flex size-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400">
              <Clock3 className="size-4" />
            </span>
            <div>
              <p className="text-xl font-semibold tracking-tight text-[var(--text-primary)] tabular-nums">
                {failedCount}
              </p>
              <p className="text-[11px] font-medium text-[var(--text-muted)]">
                Failed attempts
              </p>
            </div>
          </div>
        </div>

        {items.length === 0 ? (
          <section className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)] px-6 py-16 text-center sm:py-20">
            <div className="mx-auto flex size-14 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface-raised)] text-[var(--text-muted)]">
              <History className="size-6" />
            </div>
            <h2 className="mt-5 text-lg font-semibold tracking-tight text-[var(--text-primary)]">
              Your request history starts here
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm font-medium leading-6 text-[var(--text-secondary)]">
              Requests sent from the Playground are saved in this browser.
              Credentials are excluded from saved history.
            </p>
            <Button
              className="mt-6 rounded-lg px-4 font-semibold"
              asChild
            >
              <Link
                to="/playground"
                search={{
                  url: 'https://jsonplaceholder.typicode.com/posts/1',
                  method: 'GET',
                  tab: 'params',
                }}
              >
                Open Playground
                <ArrowUpRight className="ml-2 size-4" />
              </Link>
            </Button>
          </section>
        ) : (
          <>
            {/* Search and result count */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <label className="relative block w-full sm:max-w-md">
                <span className="sr-only">Search request history</span>
                <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[var(--text-muted)]" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by URL, method, status, or error…"
                  className="h-11 w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] pl-10 pr-10 text-sm font-medium text-[var(--text-primary)] outline-none transition-[border-color,box-shadow] placeholder:text-[var(--text-muted)] hover:border-[var(--text-muted)]/50 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery('')}
                    aria-label="Clear history search"
                    className="absolute right-2.5 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface-raised)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  >
                    <X className="size-4" />
                  </button>
                )}
              </label>

              <p className="text-xs font-medium text-[var(--text-muted)]">
                Showing{' '}
                <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                  {filteredItems.length}
                </span>{' '}
                of{' '}
                <span className="font-semibold text-[var(--text-primary)] tabular-nums">
                  {items.length}
                </span>{' '}
                requests
              </p>
            </div>

            {/* Request list and selected request details */}
            <div className="grid items-start gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(390px,0.92fr)]">
              <section
                aria-label="Saved requests"
                className="min-w-0 overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]"
              >
                <div className="flex items-center justify-between border-b border-[var(--border-color)] px-4 py-3.5 sm:px-5">
                  <div>
                    <h2 className="text-sm font-semibold text-[var(--text-primary)]">
                      Saved requests
                    </h2>
                    <p className="mt-0.5 text-[11px] font-medium text-[var(--text-muted)]">
                      Select a request to inspect its details
                    </p>
                  </div>
                  <span className="rounded-full border border-[var(--border-color)] bg-[var(--bg-app)] px-2.5 py-1 text-[10px] font-semibold text-[var(--text-muted)] tabular-nums">
                    {filteredItems.length} entries
                  </span>
                </div>

                {filteredItems.length === 0 ? (
                  <div className="px-5 py-14 text-center">
                    <Search className="mx-auto size-5 text-[var(--text-muted)]" />
                    <h3 className="mt-3 text-sm font-semibold text-[var(--text-primary)]">
                      No matching requests
                    </h3>
                    <p className="mt-1 text-xs font-medium text-[var(--text-muted)]">
                      Try another URL, method, status, or error message.
                    </p>
                    <button
                      type="button"
                      onClick={() => setQuery('')}
                      className="mt-3 text-xs font-semibold text-[var(--accent)] hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                    >
                      Clear search
                    </button>
                  </div>
                ) : (
                  <ul className="divide-y divide-[var(--border-color)]">
                    {filteredItems.map((item) => {
                      const isSelected = selectedItem?.id === item.id

                      return (
                        <li
                          key={item.id}
                          className={`group flex min-w-0 items-stretch gap-2 border-l-2 transition-colors ${
                            isSelected
                              ? 'border-l-[var(--accent)] bg-[var(--accent)]/[0.055]'
                              : 'border-l-transparent hover:bg-[var(--bg-surface-raised)]/60'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedId(item.id)}
                            aria-pressed={isSelected}
                            className="min-w-0 flex-1 px-4 py-4 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--accent)] sm:px-5"
                          >
                            <div className="flex min-w-0 items-center gap-2.5">
                              <MethodBadge method={item.method} size="sm" />
                              <span className="min-w-0 flex-1 truncate font-mono text-xs font-medium text-[var(--text-primary)]">
                                {item.url}
                              </span>
                            </div>

                            <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                              {item.status ? (
                                <StatusBadge
                                  status={item.status}
                                  statusText={item.statusText}
                                />
                              ) : item.error ? (
                                <span className="inline-flex items-center rounded-md bg-red-500/10 px-2 py-1 text-[10px] font-semibold text-red-700 dark:text-red-400">
                                  Failed
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-[var(--text-muted)]">
                                  No response
                                </span>
                              )}

                              {item.durationMs !== undefined && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[var(--text-muted)]">
                                  <Clock3 className="size-3" />
                                  {item.durationMs} ms
                                </span>
                              )}

                              <span className="ml-auto text-[10px] font-medium text-[var(--text-muted)]">
                                {formatTimestamp(item.timestamp, false)}
                              </span>
                            </div>
                          </button>

                          <div className="flex shrink-0 items-center pr-3">
                            <button
                              type="button"
                              onClick={() => handleDeleteItem(item.id)}
                              aria-label={`Delete ${item.method} request to ${item.url}`}
                              title="Delete request"
                              className="flex size-8 items-center justify-center rounded-lg text-[var(--text-muted)] opacity-100 transition-colors hover:bg-red-500/10 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 sm:opacity-0 sm:group-hover:opacity-100 sm:group-focus-within:opacity-100 dark:hover:text-red-400"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </section>

              {/* Selected request detail */}
              <aside
                aria-label="Selected request details"
                className="min-w-0 xl:sticky xl:top-20"
              >
                {selectedItem ? (
                  <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)]">
                    <div className="flex flex-col gap-3 border-b border-[var(--border-color)] px-4 py-4 sm:px-5">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                            Request inspection
                          </p>
                          <h2 className="mt-1 text-base font-semibold tracking-tight text-[var(--text-primary)]">
                            Request details
                          </h2>
                        </div>
                        <MethodBadge method={selectedItem.method} />
                      </div>

                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleOpenInPlayground(selectedItem)}
                        className="h-9 w-full rounded-lg font-semibold sm:w-fit"
                      >
                        Load into Playground
                        <ArrowUpRight className="ml-2 size-3.5" />
                      </Button>
                    </div>

                    <div className="space-y-5 p-4 sm:p-5">
                      <div>
                        <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--text-muted)]">
                          Endpoint URL
                        </p>
                        <div className="break-all rounded-lg border border-[var(--border-color)] bg-[var(--bg-app)] p-3 font-mono text-[11px] font-medium leading-5 text-[var(--text-primary)]">
                          {selectedItem.url}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-app)] p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                            Status
                          </p>
                          <div className="mt-2">
                            {selectedItem.status ? (
                              <StatusBadge
                                status={selectedItem.status}
                                statusText={selectedItem.statusText}
                              />
                            ) : (
                              <span className="text-xs font-semibold text-red-600 dark:text-red-400">
                                {selectedItem.error ? 'Failed' : 'No response'}
                              </span>
                            )}
                          </div>
                          {selectedItem.error && (
                            <p className="mt-2 break-words text-[10px] font-medium leading-4 text-red-600 dark:text-red-400">
                              {selectedItem.error}
                            </p>
                          )}
                        </div>

                        <div className="rounded-lg border border-[var(--border-color)] bg-[var(--bg-app)] p-3">
                          <p className="text-[10px] font-semibold uppercase tracking-[0.1em] text-[var(--text-muted)]">
                            Duration
                          </p>
                          <p className="mt-2 text-sm font-semibold text-[var(--text-primary)] tabular-nums">
                            {selectedItem.durationMs !== undefined
                              ? `${selectedItem.durationMs} ms`
                              : '—'}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--text-muted)]">
                          Executed at
                        </p>
                        <p className="text-xs font-medium text-[var(--text-secondary)]">
                          {formatTimestamp(selectedItem.timestamp)}
                        </p>
                      </div>

                      {selectedItem.params.length > 0 && (
                        <DetailList
                          title={`Query parameters · ${selectedItem.params.length}`}
                          rows={selectedItem.params.map((param) => ({
                            key: param.key,
                            value: param.value,
                          }))}
                        />
                      )}

                      {selectedItem.headers.length > 0 && (
                        <DetailList
                          title={`Request headers · ${selectedItem.headers.length}`}
                          rows={selectedItem.headers.map((header) => ({
                            key: header.key,
                            value: header.value,
                          }))}
                        />
                      )}

                      {selectedItem.body && (
                        <div>
                          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--text-muted)]">
                            Saved request body
                          </p>
                          <pre className="max-h-48 overflow-auto whitespace-pre-wrap break-words rounded-lg border border-[var(--border-color)] bg-[var(--bg-app)] p-3 font-mono text-[11px] leading-5 text-[var(--text-secondary)]">
                            {selectedItem.body}
                          </pre>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)] px-6 py-10 text-center">
                    <div className="flex size-11 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface-raised)] text-[var(--text-muted)]">
                      <History className="size-5" />
                    </div>
                    <h2 className="mt-4 text-sm font-semibold text-[var(--text-primary)]">
                      Select a request
                    </h2>
                    <p className="mt-1.5 max-w-xs text-xs font-medium leading-5 text-[var(--text-muted)]">
                      Choose an entry from your history to inspect its endpoint,
                      result, and saved request configuration.
                    </p>
                  </div>
                )}
              </aside>
            </div>
          </>
        )}

        {/* Privacy note */}
        <aside className="mt-10 flex items-start gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 sm:p-5">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface-raised)] text-[var(--accent)]">
            <ShieldCheck className="size-4" />
          </span>
          <div>
            <h2 className="text-xs font-semibold text-[var(--text-primary)]">
              Your history stays in this browser
            </h2>
            <p className="mt-1 text-xs font-medium leading-5 text-[var(--text-muted)]">
              History is stored in your browser&apos;s{' '}
              <code className="rounded bg-[var(--bg-surface-raised)] px-1 py-0.5 font-mono">
                localStorage
              </code>
              . Authentication headers, tokens, and Basic Auth credentials are
              not recorded in request history.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}

interface DetailListProps {
  title: string
  rows: Array<{ key: string; value: string }>
}

function DetailList({ title, rows }: DetailListProps) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--text-muted)]">
        {title}
      </p>
      <div className="overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--bg-app)]">
        {rows.map((row, index) => (
          <div
            key={`${row.key}-${index}`}
            className="grid grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] gap-3 border-b border-[var(--border-color)] px-3 py-2.5 last:border-b-0"
          >
            <span className="break-all font-mono text-[10px] font-medium text-[var(--text-muted)]">
              {row.key}
            </span>
            <span className="break-all text-right font-mono text-[10px] font-medium text-[var(--text-primary)]">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
