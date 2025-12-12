'use client'

import { Brain, Cpu, Database, Sparkles } from 'lucide-react'

export default function LoadingOverlay() {
  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#0a0e17]/80 backdrop-blur-sm rounded-2xl"></div>
      
      {/* Content */}
      <div className="relative text-center">
        {/* Animated Brain Icon */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-cyan-500/30 animate-ping"></div>
          
          {/* Middle ring */}
          <div className="absolute inset-2 rounded-full border-2 border-cyan-500/50 animate-pulse"></div>
          
          {/* Inner circle with icon */}
          <div className="absolute inset-4 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
            <Brain className="w-10 h-10 text-cyan-400 animate-pulse" />
          </div>

          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-cyan-400 rounded-full"></div>
          </div>
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDelay: '1s' }}>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
          AI Analysis in Progress
        </h3>

        {/* Animated steps */}
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex items-center justify-center gap-2 animate-pulse">
            <Database className="w-4 h-4 text-cyan-500" />
            <span>Processing text data...</span>
          </div>
          <div className="flex items-center justify-center gap-2 animate-pulse" style={{ animationDelay: '0.5s' }}>
            <Cpu className="w-4 h-4 text-blue-500" />
            <span>Running ML model...</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-6 w-64 h-1.5 bg-gray-800 rounded-full overflow-hidden mx-auto">
          <div className="h-full w-full bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500 rounded-full animate-pulse"
               style={{
                 backgroundSize: '200% 100%',
                 animation: 'shimmer 1.5s linear infinite'
               }}>
          </div>
        </div>

        <style jsx>{`
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}</style>
      </div>
    </div>
  )
}



