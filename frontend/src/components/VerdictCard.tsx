'use client'

import { Shield, ShieldAlert, CheckCircle2, XCircle } from 'lucide-react'
import clsx from 'clsx'

interface VerdictCardProps {
  isFake: boolean
  riskLevel: string
}

export default function VerdictCard({ isFake, riskLevel }: VerdictCardProps) {
  return (
    <div 
      className={clsx(
        'relative rounded-2xl overflow-hidden border transition-all',
        isFake 
          ? 'bg-gradient-to-br from-rose-950/50 to-rose-900/30 border-rose-500/30' 
          : 'bg-gradient-to-br from-emerald-950/50 to-emerald-900/30 border-emerald-500/30'
      )}
    >
      {/* Animated Background Glow */}
      <div 
        className={clsx(
          'absolute inset-0 opacity-20',
          isFake ? 'bg-rose-500' : 'bg-emerald-500'
        )} 
        style={{
          background: isFake 
            ? 'radial-gradient(circle at 50% 0%, rgba(244, 63, 94, 0.3), transparent 70%)'
            : 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.3), transparent 70%)'
        }}
      />

      {/* Header */}
      <div className={clsx(
        'px-6 py-4 border-b',
        isFake ? 'border-rose-500/20 bg-rose-950/30' : 'border-emerald-500/20 bg-emerald-950/30'
      )}>
        <div className="flex items-center gap-3">
          <div className={clsx(
            'w-8 h-8 rounded-lg flex items-center justify-center',
            isFake ? 'bg-rose-500/20' : 'bg-emerald-500/20'
          )}>
            <span className={clsx('text-sm font-bold', isFake ? 'text-rose-400' : 'text-emerald-400')}>2</span>
          </div>
          <div>
            <h3 className="font-semibold text-white">Model Verdict</h3>
            <p className="text-xs text-gray-500">Classification result</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative p-8 text-center">
        {/* Icon */}
        <div className={clsx(
          'w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center',
          isFake 
            ? 'bg-rose-500/20 shadow-lg shadow-rose-500/20' 
            : 'bg-emerald-500/20 shadow-lg shadow-emerald-500/20'
        )}>
          <div className="pulse-ring absolute w-20 h-20 rounded-full border-2 border-current opacity-30" 
               style={{ borderColor: isFake ? '#f43f5e' : '#10b981' }} />
          {isFake ? (
            <ShieldAlert className="w-10 h-10 text-rose-400" />
          ) : (
            <Shield className="w-10 h-10 text-emerald-400" />
          )}
        </div>

        {/* Title */}
        <h2 className={clsx(
          'text-2xl font-bold mb-2',
          isFake ? 'text-rose-400' : 'text-emerald-400'
        )}>
          {isFake ? 'Potential Fraud Detected' : 'Legitimate Job'}
        </h2>

        {/* Subtitle */}
        <p className="text-gray-400 mb-4">
          {isFake 
            ? 'This job posting shows signs of being fraudulent' 
            : 'This job posting appears to be genuine'}
        </p>

        {/* Risk Badge */}
        <div className={clsx(
          'inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium',
          isFake 
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30' 
            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
        )}>
          {isFake ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
          Risk Level: {riskLevel}
        </div>
      </div>
    </div>
  )
}



