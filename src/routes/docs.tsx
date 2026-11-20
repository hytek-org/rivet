import { useEffect, useState  } from 'react'
import type {ReactNode} from 'react';
import { createFileRoute, Link } from '@tanstack/react-router'
import { AlertCircle, ArrowUpRight, BookOpen, Lock, Menu, Terminal } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { MethodBadge } from '@/components/ui/Badge'

export const Route = createFileRoute('/docs')({ component: DocsPage })

const sections = [
  { id: 'introduction', n: '01', title: 'Introduction' },
  { id: 'http-methods', n: '02', title: 'HTTP methods' },
  { id: 'query-params', n: '03', title: 'Query parameters' },
  { id: 'headers', n: '04', title: 'Request headers' },
  { id: 'body-editor', n: '05', title: 'Request body' },
  { id: 'authentication', n: '06', title: 'Authentication' },
  { id: 'responses', n: '07', title: 'Responses' },
  { id: 'cors', n: '08', title: 'Browser limitations' },
  { id: 'history', n: '09', title: 'Request history' },
]

function Heading({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <span className="mt-0.5 inline-flex h-6 min-w-7 items-center justify-center rounded-md border border-[var(--border-color)] bg-[var(--bg-surface-raised)] px-1.5 font-mono text-[10px] tabular-nums text-[var(--text-muted)]">{n}</span>
      <h2 className="text-lg font-semibold tracking-[-0.025em] text-[var(--text-primary)] sm:text-xl">{children}</h2>
    </div>
  )
}

function Code({ children }: { children: ReactNode }) {
  return <code className="rounded border border-[var(--border-color)] bg-[var(--bg-surface-raised)] px-1.5 py-0.5 font-mono text-[0.88em] text-[var(--text-primary)]">{children}</code>
}

function Note({ icon, title, children, warning = false }: { icon: ReactNode; title: string; children: ReactNode; warning?: boolean }) {
  return (
    <aside className={`my-6 rounded-lg border border-l-[3px] p-4 ${warning ? 'border-amber-500/30 border-l-amber-500 bg-amber-500/[0.055]' : 'border-[var(--border-color)] border-l-[var(--accent)] bg-[var(--bg-surface-raised)]'}`}>
      <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-[var(--text-primary)]"><span className="text-[var(--accent)]">{icon}</span>{title}</div>
      <div className="space-y-2 text-[13px] leading-6 text-[var(--text-secondary)]">{children}</div>
    </aside>
  )
}

function DocsPage() {
  const [active, setActive] = useState('introduction')
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    const nodes = sections.map((s) => document.getElementById(s.id)).filter((node): node is HTMLElement => Boolean(node))
    if (!('IntersectionObserver' in window)) return
    const observer = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0]
       setActive(current.target.id)
    }, { rootMargin: '-18% 0px -68% 0px' })
    nodes.forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [])

  const goTo = (id: string) => {
    setActive(id)
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
      block: 'start',
    })
    window.history.replaceState(null, '', `#${id}`)
  }

  const nav = (compact = false) => (
    <nav aria-label="Documentation sections" className={compact ? 'space-y-1' : 'space-y-1'}>
      {sections.map((s) => (
        <button key={s.id} type="button" onClick={() => goTo(s.id)} aria-current={active === s.id ? 'location' : undefined}
          className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-left text-[12px] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${active === s.id ? 'bg-[var(--bg-surface-raised)] font-medium text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:bg-[var(--bg-surface-raised)] hover:text-[var(--text-primary)]'}`}>
          <span className={`w-5 font-mono text-[10px] ${active === s.id ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`}>{s.n}</span>
          {s.title}
          {active === s.id && <span className="ml-auto size-1.5 rounded-full bg-[var(--accent)]" />}
        </button>
      ))}
    </nav>
  )

  return (
    <div className="min-h-full bg-[var(--bg-app)] text-[var(--text-primary)]">
      <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-6 sm:px-6 lg:px-8 lg:pt-10">
        <div className="mb-6 flex items-center justify-between border-b border-[var(--border-color)] pb-4 lg:hidden">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex size-8 items-center justify-center rounded-lg bg-[#17191D] text-sm font-semibold text-white">R</span>
            <span className="text-sm font-semibold tracking-[-0.03em]">Rivet</span>
            <span className="border-l border-[var(--border-color)] pl-3 text-xs text-[var(--text-muted)]">Docs</span>
          </Link>
          <button type="button" onClick={() => setMobileOpen((v) => !v)} aria-expanded={mobileOpen} aria-label="Toggle documentation navigation"
            className="inline-flex size-9 items-center justify-center rounded-md border border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--bg-surface-raised)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]">
            <Menu size={16} />
          </button>
        </div>

        {mobileOpen && <div className="mb-6 rounded-lg border border-[var(--border-color)] bg-[var(--bg-surface)] p-2 lg:hidden">{nav(true)}</div>}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[205px_minmax(0,720px)] lg:gap-12 xl:grid-cols-[210px_minmax(0,720px)_175px] xl:gap-14">
          <aside className="hidden lg:block">
            <div className="sticky top-8">
              <Link to="/" className="mb-9 flex w-fit items-center gap-2.5">
                <span className="flex size-8 items-center justify-center rounded-lg bg-[#17191D] text-sm font-semibold text-white">R</span>
                <span className="text-[15px] font-semibold tracking-[-0.035em]">Rivet</span>
              </Link>
              <div className="mb-3 flex items-center gap-2 px-2 text-[10px] font-semibold uppercase tracking-[0.14em] text-[var(--text-muted)]"><BookOpen size={12} /> Documentation</div>
              <div className="mb-4 border-t border-[var(--border-color)]" />
              {nav()}
              <div className="mt-7 border-t border-[var(--border-color)] pt-4">
                <Link to="/explore" className="flex items-center gap-2 px-2 text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)]">Explore APIs <ArrowUpRight size={11} className="ml-auto" /></Link>
              </div>
            </div>
          </aside>

          <main className="min-w-0">
            <header className="mb-12 border-b border-[var(--border-color)] pb-9 sm:mb-14 sm:pb-10">
              <div className="mb-5 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-[var(--accent)]"><span className="size-1.5 rounded-full bg-[var(--accent)]" />Technical documentation</div>
              <h1 className="text-[32px] font-semibold leading-[1.12] tracking-[-0.055em] text-[var(--text-primary)] sm:text-[40px]">Rivet Documentation</h1>
              <p className="mt-4 max-w-[610px] text-[14px] leading-7 text-[var(--text-secondary)] sm:text-[15px]">A practical guide to building HTTP requests, inspecting responses, and understanding browser networking constraints.</p>
              <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 border-t border-[var(--border-color)] pt-4 text-[11px] text-[var(--text-muted)]">
                <span className="inline-flex items-center gap-2"><BookOpen size={13} /> Documentation</span>
                <span className="inline-flex items-center gap-2"><Terminal size={13} /> API workspace</span>
                <span className="inline-flex items-center gap-2"><Lock size={13} /> Browser-based HTTP</span>
              </div>
            </header>

            <div className="space-y-12 sm:space-y-14">
              <section id="introduction" className="scroll-mt-10">
                <Heading n="01">Introduction &amp; Philosophy</Heading>
                <div className="space-y-4 text-[13px] leading-7 text-[var(--text-secondary)] sm:text-[14px]">
                  <p>Rivet is a browser-based HTTP inspection environment created for engineers who want to quickly build, inspect, and verify REST APIs without heavy electron wrappers, cloud sync requirements, or simulated fake responses.</p>
                  <p>Unlike tools that run remote proxy servers or simulate success, Rivet executes requests directly in the user agent using native browser APIs (<Code>window.fetch</Code> and <Code>AbortController</Code>).</p>
                </div>
              </section>

              <section id="http-methods" className="scroll-mt-10">
                <Heading n="02">Supported HTTP Methods</Heading>
                <p className="mb-5 text-[13px] leading-7 text-[var(--text-secondary)] sm:text-[14px]">Rivet supports the primary standard HTTP request verbs:</p>
                <div className="overflow-hidden rounded-lg border border-[var(--border-color)]">
                  {([
                    ['GET', 'Retrieves resource representation. Request bodies are intentionally disallowed by the Fetch standard.'],
                    ['POST', 'Submits payload entities for creation. Supports JSON body with automatic Content-Type headers.'],
                    ['PUT', 'Replaces existing entity representation with the supplied payload.'],
                    ['PATCH', 'Applies partial modifications to a specified resource.'],
                    ['DELETE', 'Deletes specified resource from the server.'],
                  ] as const).map(([method, description], i) => (
                    <div key={method} className={`grid grid-cols-[76px_minmax(0,1fr)] items-center gap-4 px-4 py-3.5 sm:grid-cols-[88px_minmax(0,1fr)] ${i ? 'border-t border-[var(--border-color)]' : ''}`}>
                      <MethodBadge method={method} size="sm" />
                      <p className="text-[12px] leading-6 text-[var(--text-secondary)] sm:text-[13px]">{description}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section id="query-params" className="scroll-mt-10">
                <Heading n="03">Query Parameters &amp; URL Sync</Heading>
                <div className="space-y-4 text-[13px] leading-7 text-[var(--text-secondary)] sm:text-[14px]">
                  <p>Rivet parses query parameters into a key-value grid. You can toggle parameters on or off individually, add new pairs, and observe the compiled query string update live.</p>
                  <p>Serialization is conducted via <Code>URLSearchParams</Code>, preventing common issues caused by manual string concatenation and improper URL encoding.</p>
                </div>
              </section>

              <section id="headers" className="scroll-mt-10">
                <Heading n="04">Headers &amp; Browser-Restricted Directives</Heading>
                <p className="text-[13px] leading-7 text-[var(--text-secondary)] sm:text-[14px]">You can configure arbitrary custom request headers. However, because Rivet executes natively in your browser, the W3C Fetch specification forbids frontend code from modifying certain headers:</p>
                <Note warning icon={<AlertCircle size={15} />} title="Restricted headers">
                  <p className="font-mono text-[11px] leading-6 text-[var(--text-primary)]">Host, Cookie, Cookie2, Origin, Referer, User-Agent, Date, Connection, Content-Length, Sec-*, Proxy-*</p>
                  <p>Rivet detects these headers in the editor and surfaces an explanatory warning rather than silently discarding them.</p>
                </Note>
              </section>

              <section id="body-editor" className="scroll-mt-10">
                <Heading n="05">JSON Request Bodies</Heading>
                <div className="space-y-4 text-[13px] leading-7 text-[var(--text-secondary)] sm:text-[14px]">
                  <p>When sending <Code>POST</Code>, <Code>PUT</Code>, or <Code>PATCH</Code> requests, the Body editor provides real-time JSON syntax checking.</p>
                  <ul className="list-disc space-y-2 pl-5 marker:text-[var(--accent)]">
                    <li><strong className="text-[var(--text-primary)]">Prettify JSON:</strong> Formats and indents your JSON payload with 2-space indentation.</li>
                    <li><strong className="text-[var(--text-primary)]">Syntax Feedback:</strong> Displays validation status and points out parse errors.</li>
                    <li><strong className="text-[var(--text-primary)]">Header Handling:</strong> Automatically attaches <Code>Content-Type: application/json; charset=utf-8</Code> when a valid JSON body is active.</li>
                  </ul>
                </div>
              </section>

              <section id="authentication" className="scroll-mt-10">
                <Heading n="06">Authentication &amp; Security</Heading>
                <div className="space-y-4 text-[13px] leading-7 text-[var(--text-secondary)] sm:text-[14px]">
                  <p>Rivet supports standard authentication protocols:</p>
                  <ul className="list-disc space-y-2 pl-5 marker:text-[var(--accent)]">
                    <li><strong className="text-[var(--text-primary)]">Bearer Token:</strong> Formats credentials into <Code>Authorization: Bearer &lt;token&gt;</Code>.</li>
                    <li><strong className="text-[var(--text-primary)]">Basic Auth:</strong> Encodes username and password into base64 as <Code>Authorization: Basic &lt;base64&gt;</Code>.</li>
                  </ul>
                  <Note icon={<Lock size={15} />} title="Zero Secret Persistence">
                    Authentication credentials are sent directly to the destination endpoint and are never written to disk, sent to any intermediary server, or stored in local request history.
                  </Note>
                </div>
              </section>

              <section id="responses" className="scroll-mt-10">
                <Heading n="07">Response Inspection</Heading>
                <div className="space-y-4 text-[13px] leading-7 text-[var(--text-secondary)] sm:text-[14px]">
                  <p>When a response returns, Rivet measures execution time with high precision (<Code>performance.now()</Code>) and calculates actual payload byte sizing.</p>
                  <ul className="list-disc space-y-2 pl-5 marker:text-[var(--accent)]">
                    <li><strong className="text-[var(--text-primary)]">Body:</strong> Supports JSON formatting, raw text viewing, and quick clipboard copying.</li>
                    <li><strong className="text-[var(--text-primary)]">Headers:</strong> Full list of response headers exposed by the remote server, with search filtering and copy actions.</li>
                    <li><strong className="text-[var(--text-primary)]">Metadata:</strong> Detailed breakdown of timestamp, content type, latency, and request context.</li>
                    <li><strong className="text-[var(--text-primary)]">Status Codes:</strong> Visual color-coding categorizes responses into 2xx Success, 3xx Redirect, 4xx Client Error, and 5xx Server Error.</li>
                  </ul>
                </div>
              </section>

              <section id="cors" className="scroll-mt-10">
                <Heading n="08">Browser CORS &amp; Network Constraints</Heading>
                <p className="text-[13px] leading-7 text-[var(--text-secondary)] sm:text-[14px]">Unlike command-line tools like <Code>curl</Code>, browser applications are governed by the Cross-Origin Resource Sharing (CORS) security standard:</p>
                <Note icon={<AlertCircle size={15} />} title="Why do some APIs fail in Rivet?">
                  <ul className="list-disc space-y-2 pl-4">
                    <li><strong className="text-[var(--text-primary)]">Missing CORS headers:</strong> If the destination server does not provide an <Code>Access-Control-Allow-Origin: *</Code> header (or explicitly whitelist your origin), the browser will abort reading the response.</li>
                    <li><strong className="text-[var(--text-primary)]">Mixed Content:</strong> If Rivet is loaded over HTTPS, modern browsers refuse to make unencrypted requests to insecure <Code>http://</Code> endpoints.</li>
                    <li><strong className="text-[var(--text-primary)]">Private Network Access:</strong> Accessing <Code>localhost</Code> or private IP addresses from an external HTTPS domain is subject to Private Network Access checks in Chrome.</li>
                  </ul>
                </Note>
                <p className="text-[13px] leading-7 text-[var(--text-secondary)] sm:text-[14px]">When a request is blocked by CORS, Rivet explicitly explains the failure instead of fabricating a mock 200 OK response.</p>
              </section>

              <section id="history" className="scroll-mt-10">
                <Heading n="09">Request History</Heading>
                <div className="space-y-4 text-[13px] leading-7 text-[var(--text-secondary)] sm:text-[14px]">
                  <p>Rivet automatically keeps a bounded local history of your latest 50 requests in your browser&apos;s <Code>localStorage</Code>.</p>
                  <p>You can search history entries, reload any past request back into the playground workspace with one click, or clear history completely at any time.</p>
                </div>
              </section>
            </div>

            <footer className="mt-16 border-t border-[var(--border-color)] pt-8 sm:mt-20">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="max-w-md">
                  <div className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--text-muted)]"><Terminal size={12} /> Continue building</div>
                  <h3 className="text-lg font-semibold tracking-[-0.03em]">Ready to make your first request?</h3>
                  <p className="mt-1.5 text-[13px] leading-6 text-[var(--text-secondary)]">Open the Rivet workspace and inspect an API response.</p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" asChild>
                    <Link to="/playground" search={{ url: 'https://jsonplaceholder.typicode.com/posts/1', method: 'GET', tab: 'params' }}>
                      <Terminal className="mr-1.5 size-3.5" /> Open Playground <ArrowUpRight className="ml-1.5 size-3.5" />
                    </Link>
                  </Button>
                  <Link to="/explore" className="inline-flex h-8 items-center rounded-md border border-[var(--border-color)] px-3 text-xs font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-surface-raised)]">Explore APIs</Link>
                </div>
              </div>
              <div className="mt-9 flex flex-col gap-2 border-t border-[var(--border-color)] pt-4 text-[10px] text-[var(--text-muted)] sm:flex-row sm:items-center sm:justify-between">
                <span>Rivet · API inspection and testing</span>
                <Link to="/" className="w-fit transition-colors hover:text-[var(--text-primary)]">Back to workspace <ArrowUpRight className="inline size-3" /></Link>
              </div>
            </footer>
          </main>

          <aside className="hidden xl:block">
            <div className="sticky top-8 pl-2">
              <div className="mb-4 text-[10px] font-semibold uppercase tracking-[0.13em] text-[var(--text-muted)]">On this page</div>
              <nav aria-label="On this page" className="space-y-1 border-l border-[var(--border-color)]">
                {sections.map((s) => (
                  <button key={s.id} type="button" onClick={() => goTo(s.id)} aria-current={active === s.id ? 'location' : undefined}
                    className={`-ml-px block w-full border-l-2 py-1.5 pl-3 text-left text-[11px] leading-5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] ${active === s.id ? 'border-[var(--accent)] font-medium text-[var(--text-primary)]' : 'border-transparent text-[var(--text-muted)] hover:text-[var(--text-primary)]'}`}>
                    {s.title}
                  </button>
                ))}
              </nav>
              <div className="mt-8 rounded-lg border border-[var(--border-color)] p-3.5">
                <div className="mb-2 text-[11px] font-medium">Need a reference?</div>
                <p className="text-[11px] leading-5 text-[var(--text-muted)]">Browse the API catalogue to find an endpoint to work with.</p>
                <Link to="/explore" className="mt-3 inline-flex items-center gap-1 text-[11px] font-medium text-[var(--accent)] hover:opacity-80">Explore APIs <ArrowUpRight size={11} /></Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
