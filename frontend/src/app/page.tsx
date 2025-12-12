'use client'

import { useState } from 'react'
import Header from '@/components/Header'
import InputCard from '@/components/InputCard'
import PreprocessingView from '@/components/PreprocessingView'
import VerdictCard from '@/components/VerdictCard'
import ConfidenceMeter from '@/components/ConfidenceMeter'
import KeyIndicators from '@/components/KeyIndicators'
import LoadingOverlay from '@/components/LoadingOverlay'

export interface PredictionResult {
  is_fake: boolean
  prediction: string
  confidence: number
  fake_probability: number
  real_probability: number
  risk_level: string
}

export interface JobInput {
  title: string
  company: string
  description: string
}

// Mock preprocessing function (simulates backend NLP)
function preprocessText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\b(the|a|an|is|are|was|were|be|been|being|have|has|had|do|does|did|will|would|could|should|may|might|must|shall|can|need|dare|ought|used|to|of|in|for|on|with|at|by|from|as|into|through|during|before|after|above|below|between|under|again|further|then|once|here|there|when|where|why|how|all|each|few|more|most|other|some|such|no|nor|not|only|own|same|so|than|too|very|just|also)\b/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

// Mock suspicious keywords detection
function detectSuspiciousKeywords(text: string): { keyword: string; count: number; risk: number }[] {
  const suspiciousPatterns = [
    { keyword: 'wire transfer', risk: 95 },
    { keyword: 'no interview', risk: 90 },
    { keyword: 'quick cash', risk: 88 },
    { keyword: 'work from home', risk: 45 },
    { keyword: 'immediate start', risk: 60 },
    { keyword: 'no experience', risk: 55 },
    { keyword: 'bank account', risk: 85 },
    { keyword: 'personal information', risk: 75 },
    { keyword: 'upfront payment', risk: 92 },
    { keyword: 'guaranteed income', risk: 80 },
    { keyword: 'data entry', risk: 40 },
    { keyword: 'confidential', risk: 35 },
  ]

  const lowerText = text.toLowerCase()
  const found: { keyword: string; count: number; risk: number }[] = []

  suspiciousPatterns.forEach(pattern => {
    const regex = new RegExp(pattern.keyword, 'gi')
    const matches = lowerText.match(regex)
    if (matches && matches.length > 0) {
      found.push({
        keyword: pattern.keyword,
        count: matches.length,
        risk: pattern.risk
      })
    }
  })

  return found.sort((a, b) => b.risk - a.risk).slice(0, 6)
}

export default function Home() {
  const [jobInput, setJobInput] = useState<JobInput>({
    title: '',
    company: '',
    description: ''
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [rawText, setRawText] = useState('')
  const [cleanedText, setCleanedText] = useState('')
  const [suspiciousKeywords, setSuspiciousKeywords] = useState<{ keyword: string; count: number; risk: number }[]>([])
  const [showResults, setShowResults] = useState(false)

  const handleAnalyze = async () => {
    if (!jobInput.title && !jobInput.description) return

    setIsAnalyzing(true)
    setShowResults(false)

    // Combine text for analysis
    const combinedText = `${jobInput.title} ${jobInput.company} ${jobInput.description}`
    setRawText(combinedText)

    // Simulate preprocessing delay
    await new Promise(resolve => setTimeout(resolve, 800))
    const cleaned = preprocessText(combinedText)
    setCleanedText(cleaned)

    // Detect suspicious keywords
    const keywords = detectSuspiciousKeywords(combinedText)
    setSuspiciousKeywords(keywords)

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1200))

    try {
      // Call the backend API
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const response = await fetch(`${apiUrl}/api/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: jobInput.title,
          company_profile: jobInput.company,
          description: jobInput.description,
          requirements: '',
          benefits: '',
          has_company_logo: jobInput.company ? 1 : 0,
          has_questions: 0,
          telecommuting: jobInput.description.toLowerCase().includes('remote') ? 1 : 0
        })
      })

      if (response.ok) {
        const data = await response.json()
        setResult(data)
      } else {
        // Fallback mock result if API fails
        const avgRisk = keywords.length > 0 
          ? keywords.reduce((sum, k) => sum + k.risk, 0) / keywords.length 
          : 20
        const isFake = avgRisk > 50

        setResult({
          is_fake: isFake,
          prediction: isFake ? 'FAKE' : 'REAL',
          confidence: isFake ? avgRisk : 100 - avgRisk,
          fake_probability: avgRisk,
          real_probability: 100 - avgRisk,
          risk_level: avgRisk > 70 ? 'Critical' : avgRisk > 50 ? 'High' : avgRisk > 30 ? 'Moderate' : 'Low'
        })
      }
    } catch {
      // Fallback mock result if API is not available
      const avgRisk = keywords.length > 0 
        ? keywords.reduce((sum, k) => sum + k.risk, 0) / keywords.length 
        : 20
      const isFake = avgRisk > 50

      setResult({
        is_fake: isFake,
        prediction: isFake ? 'FAKE' : 'REAL',
        confidence: isFake ? avgRisk : 100 - avgRisk,
        fake_probability: avgRisk,
        real_probability: 100 - avgRisk,
        risk_level: avgRisk > 70 ? 'Critical' : avgRisk > 50 ? 'High' : avgRisk > 30 ? 'Moderate' : 'Low'
      })
    }

    setIsAnalyzing(false)
    setShowResults(true)
  }

  const handleReset = () => {
    setJobInput({ title: '', company: '', description: '' })
    setResult(null)
    setRawText('')
    setCleanedText('')
    setSuspiciousKeywords([])
    setShowResults(false)
  }

  return (
    <main className="min-h-screen bg-[#0a0e17] grid-bg">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Input */}
          <div className="space-y-6">
            <InputCard 
              jobInput={jobInput}
              setJobInput={setJobInput}
              onAnalyze={handleAnalyze}
              onReset={handleReset}
              isAnalyzing={isAnalyzing}
            />
          </div>

          {/* Right Column - Pipeline Results */}
          <div className="space-y-6 relative">
            {isAnalyzing && <LoadingOverlay />}
            
            {showResults && result && (
              <div className="space-y-6 stagger-children">
                {/* Step 1: Preprocessing */}
                <PreprocessingView 
                  rawText={rawText}
                  cleanedText={cleanedText}
                />

                {/* Step 2: Verdict */}
                <VerdictCard 
                  isFake={result.is_fake}
                  riskLevel={result.risk_level}
                />

                {/* Step 3: Confidence Meter */}
                <ConfidenceMeter 
                  fakeProb={result.fake_probability}
                  realProb={result.real_probability}
                  confidence={result.confidence}
                />

                {/* Step 4: Key Indicators */}
                <KeyIndicators keywords={suspiciousKeywords} />
              </div>
            )}

            {!showResults && !isAnalyzing && (
              <div className="glass-card rounded-2xl p-12 text-center border border-gray-800">
                <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-800/50 flex items-center justify-center">
                  <svg className="w-12 h-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-400 mb-2">Pipeline Ready</h3>
                <p className="text-gray-500">Enter job details and click &quot;Run Detection&quot; to analyze</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

