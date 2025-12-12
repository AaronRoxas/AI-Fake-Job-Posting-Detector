'use client'

import { AlertTriangle, Search, Info } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import clsx from 'clsx'

interface KeyIndicatorsProps {
  keywords: { keyword: string; count: number; risk: number }[]
}

export default function KeyIndicators({ keywords }: KeyIndicatorsProps) {
  // If no keywords found, show a safe message
  if (keywords.length === 0) {
    return (
      <div className="glass-card rounded-2xl overflow-hidden border border-gray-800">
        <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-blue-400">4</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Key Indicators</h3>
              <p className="text-xs text-gray-500">Suspicious pattern analysis</p>
            </div>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-emerald-500/10 rounded-full flex items-center justify-center">
            <Search className="w-8 h-8 text-emerald-400" />
          </div>
          <h4 className="text-lg font-medium text-emerald-400 mb-2">No Suspicious Patterns</h4>
          <p className="text-gray-500 text-sm">No common fraud keywords detected in this posting.</p>
        </div>
      </div>
    )
  }

  // Prepare chart data
  const chartData = keywords.map(k => ({
    name: k.keyword.length > 12 ? k.keyword.slice(0, 12) + '...' : k.keyword,
    fullName: k.keyword,
    risk: k.risk,
    count: k.count
  }))

  // Custom tooltip
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 shadow-xl">
          <p className="text-white font-medium text-sm">{data.fullName}</p>
          <p className="text-gray-400 text-xs">Risk Score: <span className="text-rose-400">{data.risk}%</span></p>
          <p className="text-gray-400 text-xs">Occurrences: {data.count}</p>
        </div>
      )
    }
    return null
  }

  // Get color based on risk level
  const getColor = (risk: number) => {
    if (risk >= 80) return '#f43f5e' // rose-500
    if (risk >= 60) return '#f97316' // orange-500
    if (risk >= 40) return '#eab308' // yellow-500
    return '#22c55e' // green-500
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-gray-800">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-800 bg-gray-900/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-rose-500/10 rounded-lg flex items-center justify-center">
              <span className="text-sm font-bold text-rose-400">4</span>
            </div>
            <div>
              <h3 className="font-semibold text-white">Key Indicators</h3>
              <p className="text-xs text-gray-500">Suspicious pattern analysis</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs text-rose-400 bg-rose-500/10 px-3 py-1 rounded-full">
            <AlertTriangle className="w-3 h-3" />
            {keywords.length} flags detected
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Chart */}
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <XAxis 
                type="number" 
                domain={[0, 100]}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
              />
              <YAxis 
                type="category" 
                dataKey="name" 
                width={100}
                tick={{ fill: '#9ca3af', fontSize: 11 }}
                axisLine={{ stroke: '#374151' }}
                tickLine={{ stroke: '#374151' }}
              />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
              <Bar 
                dataKey="risk" 
                radius={[0, 6, 6, 0]}
                barSize={24}
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={getColor(entry.risk)}
                    style={{ filter: `drop-shadow(0 0 4px ${getColor(entry.risk)}40)` }}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-rose-500"></div>
            <span className="text-gray-400">High Risk (80%+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-orange-500"></div>
            <span className="text-gray-400">Medium (60-79%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-yellow-500"></div>
            <span className="text-gray-400">Low (40-59%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-green-500"></div>
            <span className="text-gray-400">Safe (&lt;40%)</span>
          </div>
        </div>

        {/* Info */}
        <div className="mt-4 p-3 bg-gray-900/50 rounded-lg border border-gray-700/50 flex items-start gap-2">
          <Info className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500">
            Risk scores are based on the frequency of suspicious patterns commonly found in fraudulent job postings. Higher scores indicate stronger correlation with known scam indicators.
          </p>
        </div>
      </div>
    </div>
  )
}



