import * as React from 'react'
import { AppHeader } from './AppHeader'
import { CommandPalette } from '@/components/ui/CommandPalette'

import { Command, ShieldCheck } from 'lucide-react'
import { RivetLogo } from './brand/RivetLogo'

interface AppLayoutProps {
  children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  const [commandPaletteOpen, setCommandPaletteOpen] = React.useState(false)

  React.useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === 'k' &&
        !event.repeat &&
        !event.isComposing
      ) {
        event.preventDefault()
        setCommandPaletteOpen((isOpen) => !isOpen)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const openCommandPalette = React.useCallback(() => {
    setCommandPaletteOpen(true)
  }, [])

  const closeCommandPalette = React.useCallback(() => {
    setCommandPaletteOpen(false)
  }, [])

  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-[var(--bg-app)] text-[var(--text-primary)] antialiased">
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-md bg-[var(--bg-surface-raised)] px-3 py-2 text-sm font-medium text-[var(--text-primary)] shadow-lg focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>

      <AppHeader onOpenCommandPalette={openCommandPalette} />

      <main id="main-content" className="relative flex-1">
        {children}
      </main>

      <footer className="mt-auto border-t border-[var(--border-color)] bg-[var(--bg-surface)]">
        <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-4 px-5 py-5 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <RivetLogo />
            <span
              aria-hidden="true"
              className="hidden h-4 w-px bg-[var(--border-color)] sm:block"
            />
            <p className="text-xs leading-5 text-[var(--text-muted)]">
              A focused workspace for inspecting and testing HTTP APIs.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-[11px] font-medium text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-2">
              <span
                aria-hidden="true"
                className="h-1.5 w-1.5 rounded-full bg-emerald-500"
              />
              Runs in your browser
            </span>
            <span className="hidden h-3 w-px bg-[var(--border-color)] sm:block" />
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck size={13} strokeWidth={1.8} />
              No account required
            </span>
            <span className="hidden h-3 w-px bg-[var(--border-color)] sm:block" />
            <button
              type="button"
              onClick={openCommandPalette}
              className="inline-flex items-center gap-1.5 rounded-md transition-colors hover:text-[var(--text-primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              aria-label="Open command palette"
            >
              <Command size={12} strokeWidth={1.8} />
              <span>Quick actions</span>
              <kbd className="ml-0.5 rounded border border-[var(--border-color)] bg-[var(--bg-app)] px-1.5 py-0.5 font-sans text-[10px] text-[var(--text-secondary)]">
                ⌘ K
              </kbd>
            </button>
          </div>
        </div>
      </footer>

      <CommandPalette open={commandPaletteOpen} onClose={closeCommandPalette} />
    </div>
  )
}
