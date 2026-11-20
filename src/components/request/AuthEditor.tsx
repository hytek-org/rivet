import * as React from 'react'
import { ShieldCheck, Eye, EyeOff } from 'lucide-react'
import type { AuthConfig } from '@/lib/http/types'

interface AuthEditorProps {
  auth: AuthConfig
  onChange: (auth: AuthConfig) => void
}

export function AuthEditor({ auth, onChange }: AuthEditorProps) {
  const [showSecret, setShowSecret] = React.useState(false)

  const handleTypeChange = (type: 'none' | 'bearer' | 'basic') => {
    if (type === 'none') {
      onChange({ type: 'none' })
    } else if (type === 'bearer') {
      onChange({ type: 'bearer', token: '' })
    } else {
      onChange({ type: 'basic', username: '', password: '' })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-[var(--text-secondary)]">
          Authentication Method
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => handleTypeChange('none')}
          className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
            auth.type === 'none'
              ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-primary)] font-semibold'
              : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          No Auth
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('bearer')}
          className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
            auth.type === 'bearer'
              ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-primary)] font-semibold'
              : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Bearer Token
        </button>
        <button
          type="button"
          onClick={() => handleTypeChange('basic')}
          className={`px-3 py-1.5 text-xs font-medium rounded border transition-colors ${
            auth.type === 'basic'
              ? 'border-[var(--accent)] bg-[var(--accent)]/10 text-[var(--text-primary)] font-semibold'
              : 'border-[var(--border-color)] bg-[var(--bg-surface)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
          }`}
        >
          Basic Auth
        </button>
      </div>

      {auth.type === 'none' && (
        <div className="p-5 border border-dashed border-[var(--border-color)] rounded-md text-center text-xs text-[var(--text-muted)]">
          This request will not attach authorization headers.
        </div>
      )}

      {auth.type === 'bearer' && (
        <div className="space-y-3 p-4 border border-[var(--border-color)] rounded-md bg-[var(--bg-surface)]">
          <div>
            <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1.5">
              Token Value
            </label>
            <div className="relative flex items-center">
              <input
                type={showSecret ? 'text' : 'password'}
                value={auth.token}
                onChange={(e) =>
                  onChange({ type: 'bearer', token: e.target.value })
                }
                placeholder="eyJh..."
                className="w-full h-9 px-3 pr-10 text-xs font-mono bg-[var(--bg-surface-raised)] border border-[var(--border-color)] rounded text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]"
              />
              <button
                type="button"
                onClick={() => setShowSecret(!showSecret)}
                className="absolute right-2.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1"
                aria-label={showSecret ? 'Hide token' : 'Show token'}
              >
                {showSecret ? (
                  <EyeOff className="size-3.5" />
                ) : (
                  <Eye className="size-3.5" />
                )}
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-[var(--text-muted)]">
              Will be appended as:{' '}
              <code className="font-mono text-[var(--text-secondary)]">
                Authorization: Bearer &lt;token&gt;
              </code>
            </p>
          </div>
        </div>
      )}

      {auth.type === 'basic' && (
        <div className="space-y-3 p-4 border border-[var(--border-color)] rounded-md bg-[var(--bg-surface)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1.5">
                Username
              </label>
              <input
                type="text"
                value={auth.username}
                onChange={(e) =>
                  onChange({ ...auth, username: e.target.value })
                }
                placeholder="admin"
                className="w-full h-9 px-3 text-xs font-mono bg-[var(--bg-surface-raised)] border border-[var(--border-color)] rounded text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]"
              />
            </div>
            <div>
              <label className="block text-xs font-mono text-[var(--text-secondary)] mb-1.5">
                Password
              </label>
              <div className="relative flex items-center">
                <input
                  type={showSecret ? 'text' : 'password'}
                  value={auth.password}
                  onChange={(e) =>
                    onChange({ ...auth, password: e.target.value })
                  }
                  placeholder="••••••••"
                  className="w-full h-9 px-3 pr-10 text-xs font-mono bg-[var(--bg-surface-raised)] border border-[var(--border-color)] rounded text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none focus:border-[var(--accent)]"
                />
                <button
                  type="button"
                  onClick={() => setShowSecret(!showSecret)}
                  className="absolute right-2.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] p-1"
                  aria-label={showSecret ? 'Hide password' : 'Show password'}
                >
                  {showSecret ? (
                    <EyeOff className="size-3.5" />
                  ) : (
                    <Eye className="size-3.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <p className="text-[11px] text-[var(--text-muted)]">
            Will be base64-encoded and sent as:{' '}
            <code className="font-mono text-[var(--text-secondary)]">
              Authorization: Basic &lt;base64(username:password)&gt;
            </code>
          </p>
        </div>
      )}

      {/* Security Privacy Note */}
      <div className="flex items-start gap-2.5 p-3 rounded-md bg-[var(--bg-surface-raised)] border border-[var(--border-color)] text-[11px] text-[var(--text-muted)]">
        <ShieldCheck className="size-4 text-[var(--accent)] shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-[var(--text-primary)] font-medium">
            Privacy Notice:
          </strong>{' '}
          Rivet is a client-side developer tool. Credentials are transmitted
          directly to your target endpoint and are never recorded in request
          history or saved in permanent storage.
        </div>
      </div>
    </div>
  )
}
