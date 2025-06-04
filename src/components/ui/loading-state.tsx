import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'

interface LoadingStateProps {
  variant?: 'spinner' | 'skeleton' | 'progress'
  size?: 'sm' | 'md' | 'lg'
  message?: string
  className?: string
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-8 w-8',
  lg: 'h-12 w-12'
}

const skeletonSizeClasses = {
  sm: 'h-8',
  md: 'h-16',
  lg: 'h-24'
}

export function LoadingState({ 
  variant = 'spinner', 
  size = 'md', 
  message,
  className 
}: LoadingStateProps) {
  if (variant === 'spinner') {
    return (
      <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
        <Loader2 className={cn("animate-spin text-blue-600", sizeClasses[size])} />
        {message && (
          <p className="text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    )
  }

  if (variant === 'skeleton') {
    return (
      <div className={cn("space-y-4", className)}>
        <div className={cn("animate-pulse bg-gray-200 rounded", skeletonSizeClasses[size])} />
        <div className={cn("animate-pulse bg-gray-200 rounded", skeletonSizeClasses[size])} />
        <div className={cn("animate-pulse bg-gray-200 rounded w-3/4", skeletonSizeClasses[size])} />
      </div>
    )
  }

  if (variant === 'progress') {
    return (
      <div className={cn("w-full", className)}>
        {message && (
          <p className="text-sm text-muted-foreground mb-2">{message}</p>
        )}
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div className="bg-blue-600 h-2 rounded-full animate-progress" />
        </div>
      </div>
    )
  }

  return null
}