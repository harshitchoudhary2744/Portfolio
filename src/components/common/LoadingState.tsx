import React from 'react'

interface LoadingStateProps {
  message?: string
}

export const LoadingState: React.FC<LoadingStateProps> = ({ message = 'Loading projects...' }) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none min-h-[240px]">
      <div className="relative w-10 h-10 mb-4">
        {/* macOS style spinning indicator */}
        <div className="w-10 h-10 rounded-full border-2 border-white/10 border-t-blue-400 animate-spin"></div>
      </div>
      <p className="text-sm font-medium text-white/80">{message}</p>
      <p className="text-xs text-white/40 mt-1">Connecting to database...</p>
    </div>
  )
}
