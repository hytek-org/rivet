import { createFileRoute, Link } from '@tanstack/react-router'
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  Compass,
  Command,
  Globe2,
  LockKeyhole,
  Terminal,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { MethodBadge } from '@/components/ui/Badge'

export const Route = createFileRoute('/')({
  component: IndexPage,
})

const sampleEndpoints = [
  {
    method: 'GET' as const,
    path: 'https://jsonplaceholder.typicode.com/posts/1',
    label: 'Fetch a post',
    detail: 'Retrieve a single resource',
  },
  {
    method: 'POST' as const,
    path: 'https://jsonplaceholder.typicode.com/posts',
    label: 'Create a post',
    detail: 'Send a JSON payload',
  },
  {
    method: 'GET' as const,
    path: 'https://api.open-meteo.com/v1/forecast',
    label: 'Weather forecast',
    detail: 'Explore a public data API',
  },
]

const capabilities = [
  {
    icon: Zap,
    title: 'Send real requests',
    description:
      'Make HTTP calls directly from your browser with the native Fetch API.',
  },
  {
    icon: Activity,
    title: 'Understand every response',
    description:
      'Review status, timing, headers, and formatted response data in one place.',
  },
  {
    icon: LockKeyhole,
    title: 'Keep control of your data',
    description:
      'Work client-side. Request history is stored locally with credentials stripped.',
  },
]

const specifications = [
  'GET, POST, PUT, PATCH, and DELETE',
  'Query parameters and custom headers',
  'Bearer and Basic authentication',
  'JSON body editing and validation',
  'Request cancellation with AbortController',
  'Response headers, status, timing, and size',
  'Local request history',
  'Keyboard command palette',
]

function IndexPage() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Subtle canvas detail */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[620px] bg-[radial-gradient(ellipse_at_50%_0%,rgba(71,118,168,0.10),transparent_65%)]"
      />

      <div className="mx-auto w-full max-w-[1320px] px-5 pb-20 pt-14 sm:px-8 sm:pt-20 lg:px-12 lg:pt-24">
        {/* Hero */}
        <section className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(420px,0.88fr)] lg:gap-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--border-color)] bg-[var(--bg-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] shadow-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-500 opacity-30" />
                <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
              </span>
              A focused workspace for API development
            </div>

            <h1 className="mt-7 max-w-[720px] text-[clamp(2.7rem,6vw,5.25rem)] font-semibold leading-[1.02] tracking-[-0.065em] text-[var(--text-primary)]">
              Make every
              <br />
              request <span className="text-[var(--accent)]">count.</span>
            </h1>

            <p className="mt-6 max-w-xl text-base font-medium leading-7 text-[var(--text-secondary)] sm:text-lg sm:leading-8">
              Build HTTP requests, inspect responses, and explore public APIs
              in a clean workspace that stays out of your way.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button size="lg" className="h-11 rounded-lg px-5 font-semibold" asChild>
                <Link
                  to="/playground"
                  search={{
                    url: 'https://jsonplaceholder.typicode.com/posts/1',
                    method: 'GET',
                    tab: 'params',
                  }}
                >
                  <Terminal className="mr-2 size-4" />
                  Open playground
                  <ArrowUpRight className="ml-2 size-4" />
                </Link>
              </Button>

              <Button
                variant="secondary"
                size="lg"
                className="h-11 rounded-lg px-5 font-semibold"
                asChild
              >
                <Link to="/explore" search={{ q: '', category: 'all', page: 1 }}>
                  <Compass className="mr-2 size-4" />
                  Explore APIs
                </Link>
              </Button>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <Globe2 className="size-3.5" />
                Runs in your browser
              </span>
              <span className="inline-flex items-center gap-1.5">
                <LockKeyhole className="size-3.5" />
                No account required
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Command className="size-3.5" />
                Quick actions with ⌘K
              </span>
            </div>
          </div>

          {/* Product preview */}
          <div className="relative mx-auto w-full max-w-[570px] lg:ml-auto">
            <div
              aria-hidden="true"
              className="absolute -inset-5 -z-10 rounded-[28px] bg-[var(--accent)] opacity-[0.07] blur-2xl"
            />
            <div className="overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] shadow-[0_24px_80px_-32px_rgba(0,0,0,0.28)]">
              <div className="flex items-center justify-between border-b border-[var(--border-color)] bg-[var(--bg-surface-raised)] px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex gap-1.5" aria-hidden="true">
                    <span className="size-2.5 rounded-full bg-[#F26D6D]" />
                    <span className="size-2.5 rounded-full bg-[#E8B85C]" />
                    <span className="size-2.5 rounded-full bg-[#62B88A]" />
                  </div>
                  <span className="ml-1 text-xs font-semibold text-[var(--text-secondary)]">
                    Request workspace
                  </span>
                </div>
                <span className="rounded-md border border-[var(--border-color)] px-2 py-1 font-mono text-[10px] font-medium text-[var(--text-muted)]">
                  rivet / playground
                </span>
              </div>

              <div className="space-y-5 p-4 sm:p-5">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--text-muted)]">
                      Request
                    </span>
                    <span className="text-[10px] font-medium text-[var(--text-muted)]">
                      Example preview
                    </span>
                  </div>
                  <div className="flex min-w-0 items-center gap-3 rounded-lg border border-[var(--border-color)] bg-[var(--bg-app)] p-2.5">
                    <span className="rounded-md bg-emerald-500/10 px-2 py-1 font-mono text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      GET
                    </span>
                    <span className="min-w-0 flex-1 truncate font-mono text-[11px] font-medium text-[var(--text-primary)] sm:text-xs">
                      jsonplaceholder.typicode.com/posts/1
                    </span>
                    <ArrowRight className="size-4 shrink-0 text-[var(--text-muted)]" />
                  </div>
                </div>

                <div className="flex items-center gap-4 border-b border-[var(--border-color)] text-xs font-semibold">
                  <span className="border-b-2 border-[var(--accent)] pb-2 text-[var(--text-primary)]">
                    Response
                  </span>
                  <span className="pb-2 text-[var(--text-muted)]">Headers</span>
                  <span className="pb-2 text-[var(--text-muted)]">Cookies</span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                    <Check className="size-3.5" />
                    200 OK
                  </span>
                  <span className="rounded-md bg-[var(--bg-surface-raised)] px-2.5 py-1.5 font-mono text-[10px] font-medium text-[var(--text-secondary)]">
                    184 ms
                  </span>
                  <span className="rounded-md bg-[var(--bg-surface-raised)] px-2.5 py-1.5 font-mono text-[10px] font-medium text-[var(--text-secondary)]">
                    application/json
                  </span>
                </div>

                <div className="overflow-hidden rounded-lg border border-[var(--border-color)] bg-[var(--bg-app)]">
                  <div className="flex items-center justify-between border-b border-[var(--border-color)] px-3 py-2">
                    <span className="text-[10px] font-semibold text-[var(--text-secondary)]">
                      Response body
                    </span>
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      JSON
                    </span>
                  </div>
                  <pre className="overflow-hidden p-3 text-[11px] leading-[1.85] text-[var(--text-secondary)] sm:text-xs">
                    <code>
                      <span className="text-[var(--text-muted)]">{'{'}</span>
                      {'\n  '}
                      <span className="text-[var(--accent)]">"userId"</span>
                      {': '}
                      <span className="text-emerald-600 dark:text-emerald-400">1</span>
                      {',\n  '}
                      <span className="text-[var(--accent)]">"id"</span>
                      {': '}
                      <span className="text-emerald-600 dark:text-emerald-400">1</span>
                      {',\n  '}
                      <span className="text-[var(--accent)]">"title"</span>
                      {': '}
                      <span className="text-amber-700 dark:text-amber-300">
                        "sunt aut facere repellat"
                      </span>
                      {',\n  '}
                      <span className="text-[var(--accent)]">"body"</span>
                      {': '}
                      <span className="text-amber-700 dark:text-amber-300">
                        "quia et suscipit..."
                      </span>
                      {'\n'}
                      <span className="text-[var(--text-muted)]">{'}'}</span>
                    </code>
                  </pre>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--border-color)] pt-3">
                  <span className="text-[10px] font-medium text-[var(--text-muted)]">
                    Illustrative interface preview
                  </span>
                  <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold text-[var(--text-secondary)]">
                    <span className="size-1.5 rounded-full bg-emerald-500" />
                    Ready to inspect
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick starts */}
        <section className="mt-24 border-t border-[var(--border-color)] pt-8 sm:mt-28">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                Get started
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-3xl">
                Start with a request.
              </h2>
              <p className="mt-2 text-sm font-medium text-[var(--text-secondary)]">
                Open an example in the playground and make it your own.
              </p>
            </div>
            <Link
              to="/explore"
              search={{ q: '', category: 'all', page: 1 }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] transition-colors hover:opacity-80"
            >
              Browse API directory <ArrowUpRight className="size-4" />
            </Link>
          </div>

          <div className="grid gap-3 md:grid-cols-3">
            {sampleEndpoints.map((endpoint) => (
              <Link
                key={endpoint.path}
                to="/playground"
                search={{
                  url: endpoint.path,
                  method: endpoint.method,
                  tab: 'params',
                }}
                className="group rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-lg hover:shadow-black/[0.04] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] sm:p-5"
              >
                <div className="flex items-center justify-between">
                  <MethodBadge method={endpoint.method} size="sm" />
                  <ArrowUpRight className="size-4 text-[var(--text-muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" />
                </div>
                <h3 className="mt-4 text-sm font-semibold text-[var(--text-primary)]">
                  {endpoint.label}
                </h3>
                <p className="mt-1 text-xs font-medium text-[var(--text-muted)]">
                  {endpoint.detail}
                </p>
                <p className="mt-4 truncate rounded-md bg-[var(--bg-app)] px-2.5 py-2 font-mono text-[10px] text-[var(--text-secondary)]">
                  {endpoint.path}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Product principles */}
        <section className="mt-24 sm:mt-28">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
              Built for the workflow
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-3xl">
              Everything you need.
              <br className="hidden sm:block" /> Nothing in the way.
            </h2>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {capabilities.map(({ icon: Icon, title, description }, index) => (
              <article
                key={title}
                className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-5 sm:p-6"
              >
                <div className="flex size-10 items-center justify-center rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface-raised)] text-[var(--accent)]">
                  <Icon className="size-[18px]" strokeWidth={1.8} />
                </div>
                <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  0{index + 1}
                </p>
                <h3 className="mt-1 text-base font-semibold tracking-tight text-[var(--text-primary)]">
                  {title}
                </h3>
                <p className="mt-2 text-sm font-medium leading-6 text-[var(--text-secondary)]">
                  {description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Capabilities */}
        <section className="mt-24 rounded-2xl border border-[var(--border-color)] bg-[var(--bg-surface)] p-6 sm:mt-28 sm:p-8 lg:p-10">
          <div className="flex flex-col justify-between gap-5 border-b border-[var(--border-color)] pb-6 sm:flex-row sm:items-end">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">
                The essentials
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                A capable HTTP toolkit.
              </h2>
              <p className="mt-2 text-sm font-medium text-[var(--text-secondary)]">
                Practical tools for the everyday API workflow.
              </p>
            </div>
            <Button variant="outline"  className="w-fit font-semibold" asChild>
              <Link to="/docs">
                Read the docs <BookOpen className="ml-2 size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-x-8 gap-y-4 pt-6 sm:grid-cols-2">
            {specifications.map((item) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Check className="size-3" strokeWidth={2.5} />
                </span>
                <span className="text-sm font-medium leading-6 text-[var(--text-secondary)]">
                  {item}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Closing CTA */}
        <section className="mt-20 flex flex-col items-start justify-between gap-6 rounded-2xl bg-[#17191D] px-6 py-8 text-white sm:mt-24 sm:flex-row sm:items-center sm:px-9 sm:py-10">
          <div className="max-w-xl">
            <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#9BB9D8]">
              Your next request starts here
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">
              Get straight to the response.
            </h2>
            <p className="mt-2 text-sm font-medium leading-6 text-white/65">
              Open the playground and put an endpoint to work.
            </p>
          </div>
          <Button
            size="lg"
            className="h-11 shrink-0 rounded-lg bg-white px-5 font-semibold text-[#17191D] hover:bg-white/90"
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
              Launch Rivet <ArrowDown className="ml-2 size-4 rotate-[-45deg]" />
            </Link>
          </Button>
        </section>
      </div>
    </div>
  )
}
