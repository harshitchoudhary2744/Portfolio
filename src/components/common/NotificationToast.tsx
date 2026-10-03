import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useDesktop } from '@/store/desktopStore'
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react'

export const NotificationToast: React.FC = () => {
  const { toasts, removeToast } = useDesktop()

  return (
    <div className="fixed top-12 right-4 z-[9999] flex flex-col space-y-2 pointer-events-none max-w-sm w-full">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
            className="pointer-events-auto p-3.5 rounded-xl bg-[#1e2238]/90 border border-white/20 backdrop-blur-2xl shadow-2xl text-white flex items-start space-x-3"
          >
            <div className="mt-0.5 shrink-0">
              {toast.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400" />}
              {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-rose-400" />}
              {toast.type === 'info' && <Info className="w-5 h-5 text-blue-400" />}
            </div>

            <div className="flex-1 min-w-0 pr-1">
              <h4 className="text-xs font-semibold tracking-wide text-white/95">{toast.title}</h4>
              <p className="text-xs text-white/75 mt-0.5 leading-relaxed break-words">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/40 hover:text-white p-0.5 rounded cursor-pointer transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
