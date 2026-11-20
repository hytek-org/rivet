import type { HttpResponse } from '@/lib/http/types'
import { MethodBadge, StatusBadge } from '@/components/ui/Badge'

interface ResponseMetadataProps {
  response: HttpResponse
}

export function ResponseMetadata({ response }: ResponseMetadataProps) {
  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  }

  const items = [
    { label: 'Target URL', value: response.requestUrl, mono: true },
    {
      label: 'HTTP Method',
      value: <MethodBadge method={response.requestMethod} size="sm" />,
    },
    {
      label: 'HTTP Status',
      value: (
        <StatusBadge
          status={response.status}
          statusText={response.statusText}
        />
      ),
    },
    {
      label: 'Latency / Duration',
      value: `${response.durationMs} ms`,
      mono: true,
    },
    {
      label: 'Payload Size',
      value: `${formatSize(response.sizeBytes)} (${response.sizeBytes.toLocaleString()} bytes)`,
      mono: true,
    },
    {
      label: 'Content-Type',
      value: response.contentType || 'Not specified',
      mono: true,
    },
    {
      label: 'Timestamp',
      value:
        new Date(response.timestamp).toLocaleTimeString() +
        ` (${new Date(response.timestamp).toISOString()})`,
      mono: true,
    },
  ]

  return (
    <div className="space-y-4">
      <div className="border border-[var(--border-color)] rounded-md overflow-hidden bg-[var(--bg-surface)]">
        <div className="px-3 py-2 bg-[var(--bg-surface-raised)] border-b border-[var(--border-color)] text-xs font-semibold text-[var(--text-primary)]">
          Execution Details
        </div>
        <div className="divide-y divide-[var(--border-color)]">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[140px_1fr] sm:grid-cols-[180px_1fr] gap-3 px-3 py-2 text-xs"
            >
              <span className="text-[var(--text-muted)] font-medium">
                {item.label}
              </span>
              <span
                className={`text-[var(--text-primary)] break-all ${
                  item.mono ? 'font-mono text-[11px]' : ''
                }`}
              >
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Browser Context Explanatory Card */}
      <div className="p-3 bg-[var(--bg-surface-raised)] border border-[var(--border-color)] rounded-md text-[11px] text-[var(--text-muted)] leading-relaxed space-y-1">
        <div className="font-semibold text-[var(--text-primary)]">
          Browser Network Runtime Note
        </div>
        <p>
          Rivet runs client-side in the browser. Network requests are performed
          using the browser&apos;s Fetch standard and are bound by browser CORS
          (Cross-Origin Resource Sharing) policies and security sandboxes.
        </p>
      </div>
    </div>
  )
}
