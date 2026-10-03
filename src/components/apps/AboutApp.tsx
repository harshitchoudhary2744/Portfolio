import React from 'react'
import { siteConfig } from '@/config/site'
import { Mail, FileText, Code2, Award, Terminal } from 'lucide-react'
import { GithubIcon, LinkedinIcon } from '@/components/common/BrandIcons'
import { useWindowManager } from '@/store/windowStore'

export const AboutApp: React.FC = () => {
  const { openWindow } = useWindowManager()

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col space-y-6 text-white max-w-2xl mx-auto w-full select-text">
      {/* Profile Header */}
      <div className="flex items-center space-x-4 border-b border-white/10 pb-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 p-0.5 shadow-lg shrink-0">
          <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center font-bold text-xl text-white">
            H
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-white/95">{siteConfig.about.name}</h2>
          <p className="text-xs text-blue-400 font-medium tracking-wide mt-0.5">
            {siteConfig.about.role}
          </p>
          <p className="text-xs text-white/50 mt-1">{siteConfig.about.education} • {siteConfig.about.location}</p>
        </div>
      </div>

      {/* Bio Statement */}
      <div className="text-sm text-white/80 leading-relaxed bg-white/[0.03] p-4 rounded-xl border border-white/5">
        {siteConfig.about.bio}
      </div>

      {/* Technical Skill Matrix */}
      <div className="space-y-3">
        <h4 className="text-xs font-semibold text-white/50 uppercase tracking-wider flex items-center space-x-1.5">
          <Code2 className="w-3.5 h-3.5" />
          <span>Core Competencies & Tooling</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {siteConfig.about.skills.map((group) => (
            <div
              key={group.category}
              className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex flex-col space-y-2"
            >
              <h5 className="text-xs font-medium text-white/90">{group.category}</h5>
              <div className="flex flex-wrap gap-1.5">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="text-[11px] font-medium bg-white/[0.06] text-white/75 px-2 py-0.5 rounded border border-white/10"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Links */}
      <div className="pt-2 border-t border-white/10 flex flex-wrap gap-2.5 select-none">
        <a
          href={siteConfig.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white text-xs font-medium rounded-lg border border-white/15 transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
        >
          <GithubIcon className="w-3.5 h-3.5" />
          <span>GitHub</span>
        </a>

        <a
          href={siteConfig.links.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3.5 py-2 bg-white/10 hover:bg-white/15 active:bg-white/20 text-white text-xs font-medium rounded-lg border border-white/15 transition-all flex items-center space-x-1.5 cursor-pointer shadow-sm"
        >
          <LinkedinIcon className="w-3.5 h-3.5 text-blue-400" />
          <span>LinkedIn</span>
        </a>

        <button
          onClick={() => openWindow('resume')}
          className="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs font-medium rounded-lg shadow-md shadow-blue-500/25 transition-all flex items-center space-x-1.5 cursor-pointer border border-blue-400/30"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>View Resume</span>
        </button>

        <button
          onClick={() => openWindow('contact')}
          className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-medium rounded-lg border border-white/10 transition-colors flex items-center space-x-1.5 cursor-pointer"
        >
          <Mail className="w-3.5 h-3.5" />
          <span>Contact Me</span>
        </button>
      </div>
    </div>
  )
}
