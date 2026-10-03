import React from 'react'
import { motion } from 'framer-motion'
import { siteConfig } from '@/config/site'
import { useWindowManager } from '@/store/windowStore'
import { Folder, ArrowRight } from 'lucide-react'

export const DesktopIntro: React.FC = () => {
  const { openWindow } = useWindowManager()

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-10 px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-center max-w-xl flex flex-col items-center pointer-events-auto"
      >
        {/* Handwritten greeting matching screenshot */}
        <h3 className="font-handwriting text-2xl sm:text-3xl text-white/90 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)] font-bold tracking-wide">
          {siteConfig.headline}
        </h3>

        {/* Display title: PORTFOLIO */}
        <h1 className="font-portfolio text-5xl sm:text-7xl md:text-8xl text-white tracking-wider drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] mt-1 mb-2 font-normal">
          {siteConfig.heroTitle}
        </h1>

        {/* Subtitle badge */}
        <div className="flex items-center space-x-2 text-xs sm:text-sm font-medium text-white/80 bg-black/30 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 shadow-lg drop-shadow">
          <span>{siteConfig.subheading}</span>
        </div>

        {/* Action Button: Open Projects Finder */}
        <motion.button
          onClick={() => openWindow('finder')}
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.96 }}
          className="mt-6 px-5 py-2.5 rounded-2xl bg-white/15 hover:bg-white/20 active:bg-white/25 text-white font-semibold text-xs sm:text-sm flex items-center space-x-2 backdrop-blur-xl border border-white/25 shadow-xl shadow-black/40 cursor-pointer transition-all"
        >
          <Folder className="w-4 h-4 text-sky-400" />
          <span>Explore Projects</span>
          <ArrowRight className="w-3.5 h-3.5 text-white/70" />
        </motion.button>
      </motion.div>
    </div>
  )
}
