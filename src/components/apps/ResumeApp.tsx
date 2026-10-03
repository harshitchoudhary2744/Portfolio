import React from 'react'
import { siteConfig } from '@/config/site'
import { Download, ExternalLink, Printer, CheckCircle, FileText } from 'lucide-react'
import { useWindowManager } from '@/store/windowStore'

export const ResumeApp: React.FC = () => {
  const { closeWindow } = useWindowManager()

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e2238]/60 text-white overflow-hidden select-text">
      {/* Resume Document Toolbar */}
      <div className="h-10 px-4 bg-white/[0.04] border-b border-white/10 flex items-center justify-between text-xs select-none">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-rose-400" />
          <span className="font-medium text-white/90">Harshit_Choudhary_Resume.pdf</span>
          <span className="text-white/40">• 1 page</span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrint}
            className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Print Resume"
          >
            <Printer className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Print</span>
          </button>

          <a
            href="/Resume.pdf"
            download="Harshit_Choudhary_Resume.pdf"
            className="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white font-medium shadow-sm flex items-center space-x-1.5 transition-colors cursor-pointer border border-blue-400/30"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      {/* Rendered Document Sheet */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-black/40">
        <div className="w-full max-w-2xl bg-[#0f111d] border border-white/10 rounded-xl p-8 md:p-12 shadow-2xl flex flex-col space-y-6 text-slate-100">
          {/* Header */}
          <div className="border-b border-white/15 pb-6 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-white">{siteConfig.about.name}</h1>
              <p className="text-sm font-semibold text-blue-400 mt-1">{siteConfig.about.role}</p>
              <p className="text-xs text-white/50 mt-1">
                India • harshit@example.com • github.com • linkedin.com
              </p>
            </div>
            <div className="text-xs text-white/40 font-mono">Curriculum Vitae</div>
          </div>

          {/* Education */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-white/10 pb-1 mb-2">
              Education
            </h3>
            <div className="flex justify-between items-baseline text-xs">
              <span className="font-semibold text-white/90">Bachelor of Technology (B.Tech) in Computer Science</span>
              <span className="text-white/45">2022 – 2026</span>
            </div>
            <p className="text-xs text-white/60 mt-0.5">Specialization in Artificial Intelligence & Machine Learning</p>
          </div>

          {/* Technical Skills */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-white/10 pb-1 mb-2">
              Technical Skillset
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
              <div>
                <span className="font-semibold text-white/80">Languages:</span>{' '}
                <span className="text-white/60">Python, C++, JavaScript, TypeScript, SQL</span>
              </div>
              <div>
                <span className="font-semibold text-white/80">AI & Machine Learning:</span>{' '}
                <span className="text-white/60">PyTorch, TensorFlow, Transformers, OpenCV, Scikit-Learn</span>
              </div>
              <div>
                <span className="font-semibold text-white/80">Web & Cloud:</span>{' '}
                <span className="text-white/60">React, Tailwind CSS, Next.js, Node.js, Supabase, PostgreSQL</span>
              </div>
              <div>
                <span className="font-semibold text-white/80">Developer Tools:</span>{' '}
                <span className="text-white/60">Git, Docker, Linux, Vite, Vercel, REST APIs</span>
              </div>
            </div>
          </div>

          {/* Key Projects & Experience */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-white/10 pb-1 mb-3">
              Selected Technical Projects
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between font-semibold text-white/95">
                  <span>AI Code Translation & AST Optimizer</span>
                  <span className="text-white/40">PyTorch • Transformers</span>
                </div>
                <p className="text-white/65 mt-1 leading-relaxed">
                  Developed transformer-based code semantics translator supporting C++, Python, and Rust. Integrated AST parsing and unit-test validation engine.
                </p>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-white/95">
                  <span>CoinInsight Real-Time Crypto Analytics</span>
                  <span className="text-white/40">React • TypeScript • PostgreSQL</span>
                </div>
                <p className="text-white/65 mt-1 leading-relaxed">
                  Architected real-time surveillance dashboard processing WebSocket market depth and training predictive LSTM models for order-book volatility.
                </p>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-white/95">
                  <span>Medical Image Segmentation U-Net</span>
                  <span className="text-white/40">Python • PyTorch • OpenCV</span>
                </div>
                <p className="text-white/65 mt-1 leading-relaxed">
                  Trained deep convolutional network with attention gates for dermoscopic lesion segmentation, achieving 0.91 Dice score on clinical benchmarks.
                </p>
              </div>
            </div>
          </div>

          {/* Footnote */}
          <div className="pt-4 border-t border-white/10 text-[11px] text-white/40 flex justify-between">
            <span>Verified Portfolio Curriculum Vitae</span>
            <span>Generated from Harshit&apos;s Portfolio OS</span>
          </div>
        </div>
      </div>
    </div>
  )
}
