import React, { useState } from 'react'
import { ArrowLeft, ArrowRight, RotateCw, Globe, ExternalLink, ShieldCheck } from 'lucide-react'

interface SafariAppProps {
  initialUrl?: string
}

export const SafariApp: React.FC<SafariAppProps> = ({ initialUrl = 'https://harshit.dev' }) => {
  const [url, setUrl] = useState(initialUrl)
  const [inputUrl, setInputUrl] = useState(initialUrl)

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault()
    let target = inputUrl.trim()
    if (!target.startsWith('http://') && !target.startsWith('https://')) {
      target = 'https://' + target
    }
    setUrl(target)
    setInputUrl(target)
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e2238]/80 text-white overflow-hidden select-none">
      {/* Safari Navigation Bar */}
      <div className="h-11 px-3 bg-white/[0.04] border-b border-white/10 flex items-center space-x-3 text-xs">
        <div className="flex items-center space-x-1">
          <button className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer">
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>
          <button className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer">
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => {
              const current = url
              setUrl('')
              setTimeout(() => setUrl(current), 50)
            }}
            className="p-1 rounded hover:bg-white/10 text-white/50 hover:text-white transition-colors cursor-pointer"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address Bar */}
        <form onSubmit={handleNavigate} className="flex-1 max-w-xl mx-auto">
          <div className="flex items-center bg-white/[0.08] hover:bg-white/[0.12] focus-within:bg-white/[0.15] border border-white/10 rounded-lg px-3 py-1 transition-colors">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0" />
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full bg-transparent text-xs text-white/90 focus:outline-none"
            />
          </div>
        </form>

        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-1 rounded hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
          title="Open in real browser tab"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Browser Viewport */}
      <div className="flex-1 bg-slate-950/80 relative flex items-center justify-center p-6 text-center">
        {url.includes('example.com') || url.includes('harshit.dev') ? (
          <div className="max-w-md p-8 rounded-2xl bg-white/[0.03] border border-white/10 flex flex-col items-center space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white/95">Safari Web Viewer</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Explore live project deployments, API documentation, and interactive prototypes built by Harshit.
            </p>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium rounded-lg shadow-md transition-colors"
            >
              Visit External Page ↗
            </a>
          </div>
        ) : (
          <iframe
            src={url}
            title="Safari Viewer"
            className="w-full h-full border-none rounded-lg bg-white"
            sandbox="allow-scripts allow-same-origin allow-forms"
          />
        )}
      </div>
    </div>
  )
}
