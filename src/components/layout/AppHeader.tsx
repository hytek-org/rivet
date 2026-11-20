import * as React from 'react'
import { Link, useRouterState } from '@tanstack/react-router'
import {
  ArrowUpRight,
  BookOpen,
  Command,
  Compass,
  History as HistoryIcon,
  Menu,
  Moon,
  Search,
  Sun,
  Terminal,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useTheme } from '@/lib/theme/useTheme'
import { RivetLogo } from './brand/RivetLogo'

interface AppHeaderProps {
  onOpenCommandPalette: () => void
}

const navigation = [
  { label: 'Playground', to: '/playground', icon: Terminal },
  { label: 'Explore', to: '/explore', icon: Compass },
  { label: 'History', to: '/history', icon: HistoryIcon },
  { label: 'Docs', to: '/docs', icon: BookOpen },
] as const

export function AppHeader({ onOpenCommandPalette }: AppHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [theme, setTheme] = useTheme()
  const currentPath = useRouterState({
    select: (state) => state.location.pathname,
  })

  const toggleTheme = React.useCallback(() => {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'))
  }, [setTheme])

  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [currentPath])

  React.useEffect(() => {
    if (!mobileMenuOpen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [mobileMenuOpen])

  const navClass = (active: boolean) =>
    `group relative inline-flex h-9 items-center gap-2 rounded-md px-3 text-[12px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
      active
        ? 'bg-[var(--bg-surface-raised)] text-[var(--text-primary)]'
        : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-raised)]/70 hover:text-[var(--text-primary)]'
    }`

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[var(--border-color)] bg-[var(--bg-surface)]/90 backdrop-blur-xl supports-[backdrop-filter]:bg-[var(--bg-surface)]/80">
      <div className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand and primary navigation */}
        <div className="flex min-w-0 items-center gap-7">
          <Link
            to="/"
            aria-label="Rivet home"
            className="inline-flex shrink-0 items-center rounded-md outline-none transition-opacity hover:opacity-80 focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          >
            <RivetLogo size={30} showLabel />
          </Link>

          <div className="hidden h-5 w-px bg-[var(--border-color)] md:block" />

          <nav aria-label="Main navigation" className="hidden items-center gap-1 md:flex">
            {navigation.map((item) => {
              const Icon = item.icon
              const active =
                currentPath === item.to || currentPath.startsWith(`${item.to}/`)

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  className={navClass(active)}
                >
                  <Icon
                    aria-hidden="true"
                    className={`size-[14px] transition-colors ${
                      active
                        ? 'text-[var(--accent)]'
                        : 'text-[var(--text-muted)] group-hover:text-[var(--text-secondary)]'
                    }`}
                    strokeWidth={1.8}
                  />
                  <span>{item.label}</span>
                  {active && (
                    <span className="absolute inset-x-3 -bottom-[11px] h-[2px] rounded-full bg-[var(--accent)]" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Utilities */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={onOpenCommandPalette}
            aria-label="Open search and command palette"
            className="group inline-flex h-9 items-center gap-2 rounded-md border border-[var(--border-color)] bg-[var(--bg-app)] px-2.5 text-[12px] text-[var(--text-muted)] transition-colors hover:border-[var(--text-muted)]/50 hover:bg-[var(--bg-surface-raised)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:px-3"
          >
            <Search size={14} strokeWidth={1.8} />
            <span className="hidden sm:inline">Search</span>
            <kbd className="ml-1 hidden items-center gap-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-surface)] px-1.5 py-0.5 font-mono text-[10px] leading-none text-[var(--text-muted)] sm:inline-flex">
              <Command size={10} />
              K
            </kbd>
          </button>

          <div className="mx-0.5 hidden h-5 w-px bg-[var(--border-color)] sm:block" />

          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            {theme === 'dark' ? (
              <Sun className="size-4" strokeWidth={1.8} />
            ) : (
              <Moon className="size-4" strokeWidth={1.8} />
            )}
          </Button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-expanded={mobileMenuOpen}
            aria-controls="rivet-mobile-navigation"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className="inline-flex size-9 items-center justify-center rounded-md text-[var(--text-secondary)] transition-colors hover:bg-[var(--bg-surface-raised)] hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] md:hidden"
          >
            {mobileMenuOpen ? (
              <X size={18} strokeWidth={1.8} />
            ) : (
              <Menu size={18} strokeWidth={1.8} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div
          id="rivet-mobile-navigation"
          className="border-t border-[var(--border-color)] bg-[var(--bg-surface)] px-4 pb-4 pt-3 md:hidden sm:px-6"
        >
          <nav aria-label="Mobile navigation" className="mx-auto max-w-[1440px] space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon
             const active =
                currentPath === item.to || currentPath.startsWith(`${item.to}/`)

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  aria-current={active ? 'page' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex min-h-11 items-center gap-3 rounded-md px-3 text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${
                    active
                      ? 'bg-[var(--bg-surface-raised)] text-[var(--text-primary)]'
                      : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-raised)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  <Icon
                    size={16}
                    strokeWidth={1.8}
                    className={active ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}
                  />
                  <span>{item.label === 'Docs' ? 'Documentation' : item.label}</span>
                  {active && <span className="ml-auto size-1.5 rounded-full bg-[var(--accent)]" />}
                  <ArrowUpRight
                    size={13}
                    className={`ml-auto opacity-0 ${active ? 'hidden' : 'group-hover:opacity-50'}`}
                  />
                </Link>
              )
            })}
          </nav>
          <div className="mx-auto mt-3 max-w-[1440px] border-t border-[var(--border-color)] pt-3">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false)
                onOpenCommandPalette()
              }}
              className="flex min-h-10 w-full items-center gap-3 rounded-md px-3 text-[12px] text-[var(--text-muted)] transition-colors hover:bg-[var(--bg-surface-raised)] hover:text-[var(--text-primary)]"
            >
              <Search size={15} />
              Search Rivet
              <kbd className="ml-auto rounded border border-[var(--border-color)] px-1.5 py-0.5 font-mono text-[10px]">⌘ K</kbd>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
