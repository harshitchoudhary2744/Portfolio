import React from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'

interface ErrorStateProps {
  message?: string
  onRetry: () => void
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message = "We couldn't load your projects.",
  onRetry,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none min-h-[260px]">
      <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4 text-amber-400">
        <AlertTriangle className="w-7 h-7" />
      </div>
      <h3 className="text-base font-semibold text-white/95 mb-1.5">Something went wrong</h3>
      <p className="text-sm text-white/60 max-w-sm mb-6 leading-relaxed">
        {message}
      </p>
      <button
        onClick={onRetry}
        className="px-4 py-2 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white text-sm font-medium rounded-lg transition-all flex items-center space-x-2 cursor-pointer border border-white/15"
      >
        <RefreshCw className="w-4 h-4" />
        <span>Try Again</span>
      </button>
    </div>
  )
}
