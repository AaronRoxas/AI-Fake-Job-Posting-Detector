'use client'

import { ArrowRight, Sparkles, FileCode } from 'lucide-react'

interface PreprocessingViewProps {
  rawText: string
  cleanedText: string
}

export default function PreprocessingView({ rawText, cleanedText }: PreprocessingViewProps) {
  const wordCountRaw = rawText.split(/\s+/).filter(Boolean).length
  const wordCountClean = cleanedText.split(/\s+/).filter(Boolean).length
  const reduction = Math.round((1 - wordCountClean / wordCountRaw) * 100)

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-gray-800">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-violet-500/10 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-violet-400">1</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Text Preprocessing</h3>
              <p className="text-xs text-gray-500">NLP cleaning pipeline</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <FileCode className="w-4 h-4" />
            {reduction}% reduced
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Raw Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-gray-400 uppercase tracking-wider">Raw Input</span>
              <span className="text-xs text-gray-600">{wordCountRaw} words</span>
            </div>
            <div className="p-4 bg-gray-900/70 rounded-xl border border-gray-700 h-32 overflow-y-auto">
              <p className="text-sm text-gray-400 font-mono leading-relaxed">
                {rawText.slice(0, 300)}{rawText.length > 300 && '...'}
              </p>
            </div>
          </div>

          {/* Arrow */}
          <div className="hidden md:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-10 h-10 bg-violet-500/20 rounded-full flex items-center justify-center">
              <ArrowRight className="w-5 h-5 text-violet-400" />
            </div>
          </div>

          {/* Cleaned Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Cleaned
              </span>
              <span className="text-xs text-gray-600">{wordCountClean} words</span>
            </div>
            <div className="p-4 bg-emerald-500/5 rounded-xl border border-emerald-500/20 h-32 overflow-y-auto">
              <p className="text-sm text-emerald-300/80 font-mono leading-relaxed">
                {cleanedText.slice(0, 300)}{cleanedText.length > 300 && '...'}
              </p>
            </div>
          </div>
        </div>

        {/* Processing Steps */}
        <div className="mt-4 flex flex-wrap gap-2">
          {['Lowercase', 'Remove URLs', 'Strip Punctuation', 'Remove Stopwords', 'Lemmatization'].map((step, i) => (
            <span key={i} className="px-2 py-1 bg-gray-800/50 text-gray-500 text-xs rounded-md border border-gray-700/50">
              {step}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}



