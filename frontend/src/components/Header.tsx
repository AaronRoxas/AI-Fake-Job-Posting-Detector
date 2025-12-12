'use client'

import { Shield, Sparkles } from 'lucide-react'

export default function Header() {
  return (
    <header className="border-b border-gray-800/50 bg-[#0a0e17]/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Title */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full"></div>
              <div className="relative w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/25">
                <Shield className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Trabaho ba ’To?
                
              </h1>
              <p className="text-xs text-gray-500 -mt-0.5">AI Fake Job Posting Detector</p>
            </div>
          </div>

          {/* Version Badge */}
          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-400">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              System Online
            </div>
            <span className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-mono rounded-full">
              v1.0.0 Alpha
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}



