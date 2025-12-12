'use client'

import { Gauge, TrendingUp, TrendingDown } from 'lucide-react'
import clsx from 'clsx'

interface ConfidenceMeterProps {
  fakeProb: number
  realProb: number
  confidence: number
}

export default function ConfidenceMeter({ fakeProb, realProb, confidence }: ConfidenceMeterProps) {
  const isFake = fakeProb > 50
  const displayProb = isFake ? fakeProb : realProb
  
  // Calculate the stroke dash for circular progress
  const radius = 70
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (displayProb / 100) * circumference

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-gray-800">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-amber-400">3</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">Confidence Analysis</h3>
            <p className="text-xs text-gray-500">Probability distribution</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-center gap-8">
          {/* Circular Progress */}
          <div className="relative">
            <svg className="w-44 h-44 -rotate-90">
              {/* Background circle */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                className="text-gray-800"
              />
              {/* Progress circle */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                fill="none"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className={clsx(
                  'transition-all duration-1000 ease-out',
                  isFake ? 'text-rose-500' : 'text-emerald-500'
                )}
                style={{
                  filter: isFake 
                    ? 'drop-shadow(0 0 8px rgba(244, 63, 94, 0.5))' 
                    : 'drop-shadow(0 0 8px rgba(16, 185, 129, 0.5))'
                }}
              />
            </svg>
            
            {/* Center content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Gauge className={clsx(
                'w-6 h-6 mb-1',
                isFake ? 'text-rose-400' : 'text-emerald-400'
              )} />
              <span className={clsx(
                'text-3xl font-bold',
                isFake ? 'text-rose-400' : 'text-emerald-400'
              )}>
                {displayProb.toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500 uppercase tracking-wider">
                Confidence
              </span>
            </div>
          </div>

          {/* Probability Bars */}
          <div className="flex-1 space-y-4 max-w-xs">
            {/* Real Probability */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  Real Job
                </span>
                <span className="text-sm font-mono text-emerald-400">{realProb.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-600 to-emerald-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${realProb}%` }}
                />
              </div>
            </div>

            {/* Fake Probability */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400 flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                  Fake Job
                </span>
                <span className="text-sm font-mono text-rose-400">{fakeProb.toFixed(1)}%</span>
              </div>
              <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-rose-600 to-rose-400 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${fakeProb}%` }}
                />
              </div>
            </div>

            {/* Info text */}
            <p className="text-xs text-gray-600 mt-4">
              Model confidence based on text analysis, metadata features, and pattern matching.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}



