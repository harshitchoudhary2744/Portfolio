import React, { useState } from 'react'
import { siteConfig } from '@/config/site'
import { Mail, Send, Copy, Check } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/common/BrandIcons'
import { useDesktop } from '@/store/desktopStore'

export const ContactApp: React.FC = () => {
  const { showToast } = useDesktop()
  const [copied, setCopied] = useState(false)
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')

  const emailAddress = 'harshit@example.com'

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress)
    setCopied(true)
    showToast('Copied', 'Email address copied to clipboard', 'info')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSendEmail = (e: React.FormEvent) => {
    e.preventDefault()
    const mailtoUrl = `mailto:${emailAddress}?subject=${encodeURIComponent(
      subject || 'Inquiry from Portfolio',
    )}&body=${encodeURIComponent(message)}`
    window.location.href = mailtoUrl
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col space-y-6 text-white max-w-lg mx-auto w-full select-text">
      {/* Header */}
      <div className="text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3 shadow-inner">
          <Mail className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-white/95">Get In Touch</h2>
        <p className="text-xs text-white/60 mt-1 max-w-xs mx-auto">
          Feel free to reach out for collaboration opportunities, AI/ML inquiries, or just to say hello.
        </p>
      </div>

      {/* Direct Contact Cards */}
      <div className="space-y-2.5">
        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Mail className="w-4 h-4 text-blue-400" />
            <div>
              <div className="text-xs text-white/50">Email</div>
              <div className="text-xs font-medium text-white/90">{emailAddress}</div>
            </div>
          </div>
          <button
            onClick={handleCopyEmail}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors cursor-pointer border border-white/5"
            title="Copy Email"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <a
            href={siteConfig.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center space-x-2.5 transition-colors cursor-pointer"
          >
            <GithubIcon className="w-4 h-4 text-white/80" />
            <div className="text-xs">
              <div className="text-white/50 text-[10px]">GitHub</div>
              <div className="font-medium text-white/90">@harshit</div>
            </div>
          </a>

          <a
            href={siteConfig.links.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex items-center space-x-2.5 transition-colors cursor-pointer"
          >
            <LinkedinIcon className="w-4 h-4 text-blue-400" />
            <div className="text-xs">
              <div className="text-white/50 text-[10px]">LinkedIn</div>
              <div className="font-medium text-white/90">Harshit Choudhary</div>
            </div>
          </a>
        </div>
      </div>

      {/* Quick Mail composer */}
      <form onSubmit={handleSendEmail} className="space-y-3 pt-2 border-t border-white/10">
        <div>
          <label className="block text-xs font-medium text-white/70 mb-1">Subject</label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Regarding opportunity / collaboration"
            className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/70 mb-1">Message</label>
          <textarea
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message here..."
            className="w-full bg-white/[0.05] border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-white/30 focus:outline-none focus:border-blue-400"
          />
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-md shadow-blue-500/25 transition-all flex items-center justify-center space-x-1.5 cursor-pointer border border-blue-400/30"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Launch Mail Client</span>
        </button>
      </form>
    </div>
  )
}
