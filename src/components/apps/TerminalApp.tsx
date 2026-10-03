import React, { useState, useRef, useEffect } from 'react'
import { siteConfig } from '@/config/site'
import { useWindowManager } from '@/store/windowStore'
import { useProjects } from '@/hooks/useProjects'

interface TerminalLine {
  id: string
  type: 'input' | 'output' | 'error' | 'system'
  text: string
}

export const TerminalApp: React.FC = () => {
  const { closeWindow, openWindow } = useWindowManager()
  const { projects } = useProjects()

  const [inputVal, setInputVal] = useState('')
  const [history, setHistory] = useState<TerminalLine[]>([
    {
      id: 'init-1',
      type: 'system',
      text: `Last login: ${new Date().toLocaleDateString()} on ttys001`,
    },
    {
      id: 'init-2',
      type: 'system',
      text: 'Harshit macOS Portfolio Shell [Version 1.0.0 (zsh)]',
    },
    {
      id: 'init-3',
      type: 'system',
      text: 'Type "help" to view available terminal commands.',
    },
  ])

  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [history])

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    const nextHistory = [...history, { id: Date.now().toString(), type: 'input' as const, text: `$ ${cmd}` }]

    if (!trimmed) {
      setHistory(nextHistory)
      return
    }

    if (trimmed === 'clear') {
      setHistory([])
      return
    }

    if (trimmed === 'help') {
      nextHistory.push({
        id: Date.now().toString() + '-1',
        type: 'output',
        text: `Available commands:
  help       - Show this command reference
  whoami     - Display portfolio owner information
  projects   - List all dynamic projects fetched from Supabase
  skills     - View technical skill matrix
  contact    - Display contact methods
  resume     - Open or print curriculum vitae
  date       - Show current system date & time
  clear      - Clear the terminal screen
  exit       - Close the terminal window`,
      })
    } else if (trimmed === 'whoami') {
      nextHistory.push({
        id: Date.now().toString() + '-1',
        type: 'output',
        text: `${siteConfig.about.name} — ${siteConfig.about.role}
Location: ${siteConfig.about.location}
Specialization: AI, Deep Learning, Systems Engineering, Modern Web Architecture`,
      })
    } else if (trimmed === 'projects') {
      const list = projects
        .map((p, i) => `[${i + 1}] ${p.title} (${p.category})\n    Tech: ${p.tech_stack.join(', ')}`)
        .join('\n\n')
      nextHistory.push({
        id: Date.now().toString() + '-1',
        type: 'output',
        text: list || 'No projects currently in database. Open Projects to create one.',
      })
    } else if (trimmed === 'skills') {
      const skillsStr = siteConfig.about.skills
        .map((s) => `${s.category}:\n  ${s.items.join(', ')}`)
        .join('\n\n')
      nextHistory.push({
        id: Date.now().toString() + '-1',
        type: 'output',
        text: skillsStr,
      })
    } else if (trimmed === 'contact') {
      nextHistory.push({
        id: Date.now().toString() + '-1',
        type: 'output',
        text: `Email:    harshit@example.com
GitHub:   ${siteConfig.links.github}
LinkedIn: ${siteConfig.links.linkedin}`,
      })
    } else if (trimmed === 'resume' || trimmed === 'cat resume') {
      openWindow('resume')
      nextHistory.push({
        id: Date.now().toString() + '-1',
        type: 'output',
        text: 'Opening Resume window...',
      })
    } else if (trimmed === 'date') {
      nextHistory.push({
        id: Date.now().toString() + '-1',
        type: 'output',
        text: new Date().toString(),
      })
    } else if (trimmed === 'exit') {
      closeWindow('window-terminal')
      return
    } else {
      nextHistory.push({
        id: Date.now().toString() + '-1',
        type: 'error',
        text: `zsh: command not found: ${cmd}. Type "help" for a list of commands.`,
      })
    }

    setHistory(nextHistory)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleCommand(inputVal)
    setInputVal('')
  }

  return (
    <div
      onClick={() => inputRef.current?.focus()}
      className="flex-1 bg-[#0d1017]/95 p-4 font-mono text-xs text-emerald-400 overflow-y-auto flex flex-col space-y-2 select-text"
    >
      {history.map((line) => (
        <div
          key={line.id}
          className={`leading-relaxed whitespace-pre-wrap ${
            line.type === 'input'
              ? 'text-white font-semibold'
              : line.type === 'system'
              ? 'text-white/40'
              : line.type === 'error'
              ? 'text-rose-400'
              : 'text-emerald-300'
          }`}
        >
          {line.text}
        </div>
      ))}

      {/* Current Prompt Line */}
      <form onSubmit={onSubmit} className="flex items-center space-x-2 pt-1">
        <span className="text-blue-400 font-bold shrink-0">harshit@mac:~$</span>
        <input
          ref={inputRef}
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          autoFocus
          className="flex-1 bg-transparent text-white focus:outline-none caret-emerald-400 font-mono text-xs"
        />
      </form>
      <div ref={bottomRef} />
    </div>
  )
}
