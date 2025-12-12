'use client'

import { Briefcase, Building2, FileText, Play, RotateCcw, Zap } from 'lucide-react'
import { JobInput } from '@/app/page'

interface InputCardProps {
  jobInput: JobInput
  setJobInput: (input: JobInput) => void
  onAnalyze: () => void
  onReset: () => void
  isAnalyzing: boolean
}

export default function InputCard({ jobInput, setJobInput, onAnalyze, onReset, isAnalyzing }: InputCardProps) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-gray-800">
      {/* Card Header */}
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-cyan-500/10 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Job Analysis Input</h2>
            <p className="text-xs text-gray-500">Enter job posting details to analyze</p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-6 space-y-5">
        {/* Job Title */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <Briefcase className="w-4 h-4 text-gray-500" />
            Job Title
          </label>
          <input
            type="text"
            value={jobInput.title}
            onChange={(e) => setJobInput({ ...jobInput, title: e.target.value })}
            placeholder="e.g., Data Entry Clerk - Work From Home"
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all"
          />
        </div>

        {/* Company Name */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <Building2 className="w-4 h-4 text-gray-500" />
            Company Name
          </label>
          <input
            type="text"
            value={jobInput.company}
            onChange={(e) => setJobInput({ ...jobInput, company: e.target.value })}
            placeholder="e.g., Acme Corporation"
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all"
          />
        </div>

        {/* Job Description */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <FileText className="w-4 h-4 text-gray-500" />
            Job Description
          </label>
          <textarea
            value={jobInput.description}
            onChange={(e) => setJobInput({ ...jobInput, description: e.target.value })}
            placeholder="Paste the full job description here..."
            rows={8}
            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-cyan-500/40 focus:border-cyan-500/40 transition-all resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={onAnalyze}
            disabled={isAnalyzing || (!jobInput.title && !jobInput.description)}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:shadow-none"
          >
            {isAnalyzing ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                Run Detection
              </>
            )}
          </button>
          
          <button
            onClick={onReset}
            className="px-4 py-3.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl transition-all border border-gray-700"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Quick Examples */}
      <div className="px-6 py-4 border-t border-gray-800 bg-gray-900/30">
        <p className="text-xs text-gray-500 mb-3">Quick test examples:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setJobInput({
              title: 'Data Entry - WORK FROM HOME - $500/DAY',
              company: 'Confidential',
              description: 'Earn quick cash! No interview required. Just process payments and earn $500 daily. Must have bank account. Wire transfer experience a plus.'
            })}
            className="px-3 py-1.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg hover:bg-rose-500/20 transition-all"
          >
            🚨 Scam Example
          </button>
          <button
            onClick={() => setJobInput({
              title: 'Senior Software Engineer',
              company: 'Tech Corp Inc.',
              description: 'We are seeking an experienced software engineer to join our team. Requirements: BS in Computer Science, 5+ years experience with Python and AWS. Benefits include health insurance, 401k matching, and flexible PTO.'
            })}
            className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-lg hover:bg-emerald-500/20 transition-all"
          >
            ✓ Legit Example
          </button>
        </div>
      </div>
    </div>
  )
}



