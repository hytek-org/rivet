import * as React from 'react'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  Compass,
  Database,
  Globe2,
  Search,
  SlidersHorizontal,
  Tag,
  X,
} from 'lucide-react'

import {
  CURATED_ENDPOINTS,
  CATALOGUE_CATEGORIES,
} from '@/lib/catalogue/endpoints'
import { MethodBadge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

interface ExploreSearch {
  q?: string
  category?: string
  page?: number
}

const PAGE_SIZE = 6

export const Route = createFileRoute('/explore')({
  validateSearch: (search: Record<string, unknown>): ExploreSearch => {
    const validCategories = CATALOGUE_CATEGORIES.map((category) => category.id)
    const requestedCategory =
      typeof search.category === 'string' ? search.category : 'all'

    return {
      q: typeof search.q === 'string' ? search.q : '',
      category: (validCategories as string[]).includes(requestedCategory)
        ? requestedCategory
        : 'all',
      page:
        typeof search.page === 'number' &&
        Number.isFinite(search.page) &&
        search.page > 0
          ? Math.floor(search.page)
          : 1,
    }
  },
  component: ExplorePage,
})

function getEndpointHost(endpointUrl: string) {
  try {
    return new URL(endpointUrl).host
  } catch {
    return endpointUrl
  }
}

function ExplorePage() {
  const navigate = useNavigate({ from: Route.fullPath })
  const search = Route.useSearch()

  const [searchInput, setSearchInput] = React.useState(search.q || '')

  // Keep the search field in sync with browser navigation and shared links.
  React.useEffect(() => {
    setSearchInput(search.q || '')
  }, [search.q])

  // Debounce search into the URL so filtered views can be shared and revisited.
  React.useEffect(() => {
    const normalizedInput = searchInput.trim()
    const currentQuery = search.q || ''

    if (normalizedInput === currentQuery) return

    const timer = window.setTimeout(() => {
      navigate({
        search: (old) => ({
          ...old,
          q: normalizedInput || undefined,
          page: 1,
        }),
        replace: true,
      })
    }, 250)

    return () => window.clearTimeout(timer)
  }, [searchInput, search.q, navigate])

  const filteredEndpoints = React.useMemo(() => {
    const query = (search.q || '').toLowerCase().trim()
    const category = search.category || 'all'

    return CURATED_ENDPOINTS.filter((endpoint) => {
      const matchesCategory =
        category === 'all' || endpoint.category === category

      const matchesQuery =
        !query ||
        endpoint.name.toLowerCase().includes(query) ||
        endpoint.url.toLowerCase().includes(query) ||
        endpoint.description.toLowerCase().includes(query) ||
        endpoint.tags.some((tag) => tag.toLowerCase().includes(query))

      return matchesCategory && matchesQuery
    })
  }, [search.q, search.category])

  const totalPages = Math.max(1, Math.ceil(filteredEndpoints.length / PAGE_SIZE))
  const currentPage = Math.min(Math.max(1, search.page || 1), totalPages)

  const paginatedEndpoints = React.useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredEndpoints.slice(start, start + PAGE_SIZE)
  }, [filteredEndpoints, currentPage])

  const activeCategory = search.category || 'all'
  const hasActiveFilters = Boolean(search.q) || activeCategory !== 'all'
  const resultStart = filteredEndpoints.length
    ? (currentPage - 1) * PAGE_SIZE + 1
    : 0
  const resultEnd = Math.min(currentPage * PAGE_SIZE, filteredEndpoints.length)

  const handleCategoryChange = (category: string) => {
    navigate({
      search: (old) => ({
        ...old,
        category,
        page: 1,
      }),
      replace: true,
    })
  }

  const handlePageChange = (newPage: number) => {
    navigate({
      search: (old) => ({
        ...old,
        page: Math.max(1, Math.min(totalPages, newPage)),
      }),
      replace: true,
    })
  }

  const handleClearFilters = () => {
    setSearchInput('')
    navigate({
      search: () => ({
        category: 'all',
        page: 1,
      }),
      replace: true,
    })
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-[var(--bg-app)]">
      <div className="mx-auto w-full max-w-[1480px] px-4 pb-16 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
        {/* Directory heading */}
        <header className="border-b border-[var(--border-color)] pb-8">
          <div className="flex flex-col gap-7 xl:flex-row xl:items-end xl:justify-between">
            <div className="max-w-2xl">
              <div className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--text-muted)]">
                <span className="flex size-6 items-center justify-center rounded-md border border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--accent)]">
                  <Compass size={13} strokeWidth={2} />
                </span>
                Rivet directory
                <span className="text-[var(--text-muted)]/50">/</span>
                Explore
              </div>

              <h1 className="text-3xl font-semibold tracking-[-0.045em] text-[var(--text-primary)] sm:text-4xl">
                Explore public APIs
              </h1>
              <p className="mt-2 max-w-xl text-sm font-medium leading-6 text-[var(--text-secondary)] sm:text-[15px]">
                Find an endpoint, see what it offers, and open it directly in
                your request workspace.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:w-fit">
              <div className="min-w-[132px] rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-3">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Database className="size-3.5" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                    Catalogue
                  </span>
                </div>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                  {CURATED_ENDPOINTS.length}
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-[var(--text-muted)]">
                  Curated endpoints
                </p>
              </div>

              <div className="min-w-[132px] rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 py-3">
                <div className="flex items-center gap-2 text-[var(--text-muted)]">
                  <Globe2 className="size-3.5" />
                  <span className="text-[10px] font-semibold uppercase tracking-[0.12em]">
                    Access
                  </span>
                </div>
                <p className="mt-2 text-2xl font-semibold tracking-tight text-[var(--text-primary)]">
                  Public
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-[var(--text-muted)]">
                  Browser-ready APIs
                </p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div className="mt-8 flex flex-col gap-3 lg:flex-row lg:items-center">
            <label className="relative block min-w-0 flex-1">
              <span className="sr-only">Search public APIs</span>
              <Search className="pointer-events-none absolute left-4 top-1/2 size-[18px] -translate-y-1/2 text-[var(--text-muted)]" />
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search APIs by name, description, tag, or URL…"
                className="h-12 w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] pl-11 pr-11 text-sm font-medium text-[var(--text-primary)] shadow-sm outline-none transition-[border-color,box-shadow] placeholder:font-medium placeholder:text-[var(--text-muted)] hover:border-[var(--text-muted)]/50 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent)]/10"
              />
              {searchInput && (
                <button
                  type="button"
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 flex size-7 -translate-y-1/2 items-center justify-center rounded-md text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface-raised)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </label>

            <div className="inline-flex h-12 shrink-0 items-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] px-4 text-xs font-semibold text-[var(--text-secondary)]">
              <SlidersHorizontal className="size-4 text-[var(--accent)]" />
              <span>Filter by category</span>
            </div>
          </div>

          {/* Category filters */}
          <nav
            aria-label="Filter APIs by category"
            className="mt-4 flex gap-2 overflow-x-auto pb-1"
          >
            {CATALOGUE_CATEGORIES.map((category) => {
              const isActive = activeCategory === category.id

              return (
                <button
                  key={category.id}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => handleCategoryChange(category.id)}
                  className={`shrink-0 rounded-full border px-4 py-2 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-app)] ${
                    isActive
                      ? 'border-[var(--accent)] bg-[var(--accent)] text-white shadow-sm'
                      : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-secondary)] hover:border-[var(--accent)]/50 hover:bg-[var(--bg-surface-raised)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {category.label}
                </button>
              )
            })}
          </nav>
        </header>

        {/* Results heading */}
        <section className="mt-8" aria-live="polite">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                <span className="size-1.5 rounded-full bg-[var(--accent)]" />
                API catalogue
              </div>
              <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.035em] text-[var(--text-primary)] sm:text-2xl">
                {activeCategory === 'all'
                  ? 'Browse endpoints'
                  : CATALOGUE_CATEGORIES.find(
                      (category) => category.id === activeCategory,
                    )?.label || 'Browse endpoints'}
              </h2>
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <p className="text-xs font-medium text-[var(--text-muted)]">
                <span className="font-semibold tabular-nums text-[var(--text-primary)]">
                  {resultStart}–{resultEnd}
                </span>{' '}
                of{' '}
                <span className="font-semibold tabular-nums text-[var(--text-primary)]">
                  {filteredEndpoints.length}
                </span>{' '}
                results
              </p>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--accent)] transition-opacity hover:opacity-75 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                >
                  Clear filters <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Endpoint cards */}
          {paginatedEndpoints.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[var(--border-color)] bg-[var(--bg-surface)] px-6 py-16 text-center sm:py-20">
              <div className="mx-auto flex size-12 items-center justify-center rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface-raised)] text-[var(--text-muted)]">
                <Search className="size-5" />
              </div>
              <h3 className="mt-5 text-base font-semibold text-[var(--text-primary)]">
                No APIs match your search
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm font-medium leading-6 text-[var(--text-secondary)]">
                Try a different search term or choose another category to see
                more public endpoints.
              </p>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="mt-5 rounded-lg font-semibold"
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {paginatedEndpoints.map((item) => {
                let playgroundUrl = item.url

                if (item.sampleParams && item.sampleParams.length > 0) {
                  const params = new URLSearchParams()
                  item.sampleParams.forEach((param) =>
                    params.append(param.key, param.value),
                  )
                  const separator = item.url.includes('?') ? '&' : '?'
                  playgroundUrl = `${item.url}${separator}${params.toString()}`
                }

                return (
                  <article
                    key={item.id}
                    className="group flex min-w-0 flex-col rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)]/60 hover:shadow-[0_16px_44px_-32px_rgba(0,0,0,0.38)] sm:p-5"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <MethodBadge method={item.method} size="sm" />
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface-raised)] px-2.5 py-1 text-[10px] font-semibold capitalize text-[var(--text-muted)]">
                        <Tag className="size-3" />
                        {item.category}
                      </span>
                    </div>

                    <div className="mt-5 min-h-[88px]">
                      <h3 className="text-base font-semibold tracking-[-0.02em] text-[var(--text-primary)]">
                        {item.name}
                      </h3>
                      <p className="mt-2 line-clamp-3 text-sm font-medium leading-6 text-[var(--text-secondary)]">
                        {item.description}
                      </p>
                    </div>

                    <div className="mt-4 rounded-lg border border-[var(--border-color)] bg-[var(--bg-app)] px-3 py-2.5">
                      <p className="mb-1 text-[9px] font-semibold uppercase tracking-[0.13em] text-[var(--text-muted)]">
                        Base endpoint
                      </p>
                      <p
                        title={item.url}
                        className="truncate font-mono text-[11px] font-medium text-[var(--text-secondary)]"
                      >
                        {getEndpointHost(item.url)}
                      </p>
                      <p className="mt-1 truncate font-mono text-[10px] text-[var(--text-muted)]">
                        {item.url}
                      </p>
                    </div>

                    <div className="mt-4 flex min-h-6 flex-wrap gap-1.5">
                      {item.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-[var(--bg-surface-raised)] px-2 py-1 text-[10px] font-medium text-[var(--text-muted)]"
                        >
                          {tag}
                        </span>
                      ))}
                      {item.tags.length > 4 && (
                        <span className="rounded-md bg-[var(--bg-surface-raised)] px-2 py-1 text-[10px] font-medium text-[var(--text-muted)]">
                          +{item.tags.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto flex items-center justify-between gap-3 border-t border-[var(--border-color)] pt-4 mt-5">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                        <CheckCircle2 className="size-3.5" />
                        {item.corsSupport} CORS
                      </span>

                      <Link
                        to="/playground"
                        search={{
                          url: playgroundUrl,
                          method: item.method,
                          tab: 'params',
                        }}
                        className="inline-flex items-center gap-1.5 rounded-md text-xs font-semibold text-[var(--accent)] transition-colors hover:text-[var(--accent-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-surface)]"
                      >
                        Open in playground
                        <ArrowUpRight className="size-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav
              aria-label="API catalogue pagination"
              className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-[var(--border-color)] pt-5 sm:flex-row"
            >
              <p className="text-xs font-medium text-[var(--text-muted)]">
                Page <span className="font-semibold text-[var(--text-primary)]">{currentPage}</span>{' '}
                of <span className="font-semibold text-[var(--text-primary)]">{totalPages}</span>
              </p>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage <= 1}
                  className="h-9 rounded-lg px-3 font-semibold"
                >
                  <ArrowLeft className="mr-1.5 size-3.5" />
                  Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages}
                  className="h-9 rounded-lg px-3 font-semibold"
                >
                  Next
                  <ArrowRight className="ml-1.5 size-3.5" />
                </Button>
              </div>
            </nav>
          )}
        </section>

        {/* Catalogue note */}
        <aside className="mt-12 flex flex-col gap-3 rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 sm:flex-row sm:items-start sm:p-5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface-raised)] text-[var(--accent)]">
            <Globe2 className="size-4" />
          </span>
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              About this catalogue
            </h2>
            <p className="mt-1 max-w-4xl text-xs font-medium leading-6 text-[var(--text-secondary)]">
              These are curated public API endpoints intended for browser-based
              testing. Rivet sends requests directly from your browser. Actual
              availability, rate limits, and cross-origin access are controlled
              by each API provider.
            </p>
          </div>
        </aside>
      </div>
    </div>
  )
}
