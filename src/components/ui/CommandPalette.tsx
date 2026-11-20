import * as React from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Search,
  X,
  ArrowRight,
  BookOpen,
  Terminal,
  Compass,
  History,
} from 'lucide-react'
import { CURATED_ENDPOINTS } from '@/lib/catalogue/endpoints'
import { MethodBadge } from './Badge'

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const navigate = useNavigate()
  const [query, setQuery] = React.useState('')
  const [selectedIndex, setSelectedIndex] = React.useState(0)
  const inputRef = React.useRef<HTMLInputElement>(null)

  React.useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // System pages
  const staticItems = [
    {
      id: 'page-playground',
      title: 'Open Playground',
      category: 'Navigation',
      icon: Terminal,
      action: () =>
        navigate({
          to: '/playground',
          search: {
            url: 'https://jsonplaceholder.typicode.com/posts/1',
            method: 'GET',
            tab: 'params',
          },
        }),
    },
    {
      id: 'page-explore',
      title: 'Explore Endpoints Catalogue',
      category: 'Navigation',
      icon: Compass,
      action: () =>
        navigate({
          to: '/explore',
          search: { q: '', category: 'all', page: 1 },
        }),
    },
    {
      id: 'page-history',
      title: 'Request History',
      category: 'Navigation',
      icon: History,
      action: () => navigate({ to: '/history' }),
    },
    {
      id: 'page-docs',
      title: 'Documentation',
      category: 'Navigation',
      icon: BookOpen,
      action: () => navigate({ to: '/docs' }),
    },
  ]

  // Filter curated endpoints
  const filteredEndpoints = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return CURATED_ENDPOINTS.filter(
      (ep) =>
        ep.name.toLowerCase().includes(q) ||
        ep.url.toLowerCase().includes(q) ||
        ep.tags.some((t) => t.toLowerCase().includes(q)),
    ).slice(0, 8)
  }, [query])

  const filteredStatic = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return staticItems
    return staticItems.filter((item) => item.title.toLowerCase().includes(q))
  }, [query])

  const totalResultsCount = filteredStatic.length + filteredEndpoints.length

  const handleSelect = (idx: number) => {
    if (idx < filteredStatic.length) {
      filteredStatic[idx].action()
    } else {
      const ep = filteredEndpoints[idx - filteredStatic.length]
      navigate({
        to: '/playground',
        search: {
          url: ep.url,
          method: ep.method,
          tab: 'params',
          q: ep.sampleParams
            ? new URLSearchParams(
                ep.sampleParams.map((p) => [p.key, p.value]),
              ).toString()
            : undefined,
        },
      })
    }
    onClose()
  }

  // Keyboard navigation
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) =>
          totalResultsCount > 0 ? (prev + 1) % totalResultsCount : 0,
        )
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) =>
          totalResultsCount > 0
            ? (prev - 1 + totalResultsCount) % totalResultsCount
            : 0,
        )
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (totalResultsCount > 0) {
          handleSelect(selectedIndex)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [open, totalResultsCount, selectedIndex])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-black/50 backdrop-blur-xs">
      <div
        className="w-full max-w-xl bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-lg shadow-xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-3 border-b border-[var(--border-color)] gap-2">
          <Search className="size-4 text-[var(--text-muted)] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setSelectedIndex(0)
            }}
            placeholder="Search endpoints, commands, or documentation..."
            className="w-full h-11 bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="p-1 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            >
              <X className="size-3.5" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono text-[var(--text-muted)] border border-[var(--border-color)] rounded">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto p-2 space-y-1">
          {filteredStatic.length > 0 && (
            <div className="mb-2">
              <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Pages
              </div>
              {filteredStatic.map((item, idx) => {
                const Icon = item.icon
                const isSelected = selectedIndex === idx
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded text-left transition-colors ${
                      isSelected
                        ? 'bg-[var(--accent)] text-white'
                        : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface-raised)]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="size-3.5" />
                      <span>{item.title}</span>
                    </div>
                    <ArrowRight className="size-3 opacity-60" />
                  </button>
                )
              })}
            </div>
          )}

          {filteredEndpoints.length > 0 && (
            <div>
              <div className="px-2 py-1 text-[10px] font-mono uppercase tracking-wider text-[var(--text-muted)]">
                Curated Endpoints
              </div>
              {filteredEndpoints.map((ep, idx) => {
                const globalIdx = filteredStatic.length + idx
                const isSelected = selectedIndex === globalIdx
                return (
                  <button
                    key={ep.id}
                    type="button"
                    onClick={() => handleSelect(globalIdx)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 text-xs rounded text-left transition-colors ${
                      isSelected
                        ? 'bg-[var(--accent)] text-white'
                        : 'text-[var(--text-primary)] hover:bg-[var(--bg-surface-raised)]'
                    }`}
                  >
                    <div className="flex items-center gap-2 overflow-hidden mr-2">
                      <MethodBadge method={ep.method} size="sm" />
                      <span className="font-medium truncate">{ep.name}</span>
                      <span className="text-[11px] opacity-70 truncate font-mono">
                        {ep.url}
                      </span>
                    </div>
                    <span className="text-[10px] opacity-70 shrink-0 capitalize">
                      {ep.category}
                    </span>
                  </button>
                )
              })}
            </div>
          )}

          {totalResultsCount === 0 && (
            <div className="py-8 text-center text-xs text-[var(--text-muted)]">
              No matching endpoints or pages found for &quot;{query}&quot;.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between px-3 py-2 bg-[var(--bg-surface-raised)] border-t border-[var(--border-color)] text-[11px] text-[var(--text-muted)]">
          <div className="flex items-center gap-2">
            <span>
              Navigate: <kbd className="font-mono">↑</kbd>{' '}
              <kbd className="font-mono">↓</kbd>
            </span>
            <span>
              Select: <kbd className="font-mono">↵</kbd>
            </span>
          </div>
          <span>Rivet Quick Search</span>
        </div>
      </div>
    </div>
  )
}
