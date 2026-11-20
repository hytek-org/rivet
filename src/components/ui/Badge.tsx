import * as React from 'react'
import { cn } from '@/lib/utils'
import type { HttpMethod } from '@/lib/http/types'

export interface MethodBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  method: HttpMethod
  size?: 'sm' | 'default'
}

export function MethodBadge({
  method,
  size = 'default',
  className,
  ...props
}: MethodBadgeProps) {
  const methodStyles: Record<HttpMethod, string> = {
    GET: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    POST: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    PUT: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    PATCH:
      'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    DELETE: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center font-mono font-semibold border rounded',
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs',
        methodStyles[method] || 'bg-muted text-foreground border-border',
        className,
      )}
      {...props}
    >
      {method}
    </span>
  )
}

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status?: number
  statusText?: string
  error?: boolean
}

export function StatusBadge({
  status,
  statusText,
  error,
  className,
  ...props
}: StatusBadgeProps) {
  if (error || status === undefined || status === 0) {
    return (
      <span
        className={cn(
          'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-semibold border bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
          className,
        )}
        {...props}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
        {status ? `${status} Error` : 'Network Error'}
      </span>
    )
  }

  let colorClasses = 'bg-muted text-muted-foreground border-border'
  let dotColor = 'bg-muted-foreground'

  if (status >= 200 && status < 300) {
    colorClasses =
      'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    dotColor = 'bg-emerald-500'
  } else if (status >= 300 && status < 400) {
    colorClasses =
      'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20'
    dotColor = 'bg-sky-500'
  } else if (status >= 400 && status < 500) {
    colorClasses =
      'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    dotColor = 'bg-amber-500'
  } else if (status >= 500) {
    colorClasses =
      'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
    dotColor = 'bg-red-500'
  }

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-xs font-mono font-semibold border',
        colorClasses,
        className,
      )}
      {...props}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', dotColor)} />
      <span>
        {status} {statusText || ''}
      </span>
    </span>
  )
}
