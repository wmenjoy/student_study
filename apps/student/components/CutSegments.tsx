"use client"
import { useEffect, useState } from "react"

type Props = { cuts: number; segLen: number; timePerCut?: number; stage?: number }

export function CutSegments({ cuts, segLen, timePerCut = 0, stage = 0 }: Props) {
  const width = 640
  const height = 320
  const segments = cuts + 1
  const totalLen = segments * segLen
  const totalTime = cuts * timePerCut

  // Visual parameters
  const startX = 40
  const endX = 600
  const availWidth = endX - startX
  const segWidth = availWidth / segments

  const [cutProgress, setCutProgress] = useState(0)

  useEffect(() => {
    if (stage === 0) {
      setCutProgress(0)
    } else if (stage === 1) {
      // Animate cuts one by one
      let p = 0
      const interval = setInterval(() => {
        p += 1
        setCutProgress(p)
        if (p >= cuts) clearInterval(interval)
      }, 500) // 0.5s per cut
      return () => clearInterval(interval)
    } else if (stage >= 2) {
      setCutProgress(cuts)
    }
  }, [stage, cuts])

  return (
    <svg width={width} height={height} className="svg-panel">
      <defs>
        <linearGradient id="wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d97706" />
          <stop offset="50%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#b45309" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="2" dy="2" result="offsetblur" />
          <feMerge>
            <feMergeNode in="offsetblur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Summary Header */}
      <g>
        <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">锯木头演示</text>
        <text x={24} y={56} fontSize="14" fill="#6b7280">次数 = {cuts}</text>
        <text x={120} y={56} fontSize="14" fill="#6b7280">每段长 = {segLen}</text>
        {stage >= 2 && (
          <>
            <text x={240} y={56} fontSize="14" fontWeight="bold" fill="#ef4444">段数 = {segments}</text>
            <text x={340} y={56} fontSize="14" fill="#6b7280">总长 = {totalLen}</text>
            {timePerCut > 0 && <text x={460} y={56} fontSize="14" fill="#6b7280">总时间 = {totalTime}s</text>}
          </>
        )}
      </g>

      {/* The Log/Rope */}
      <g transform="translate(0, 120)">
        {[...Array(segments)].map((_, i) => {
          // If stage >= 2, separate them slightly
          const gap = stage >= 2 ? 10 : 0
          // Adjust width to account for gaps if separated
          const effectiveSegWidth = stage >= 2 ? (availWidth - (segments - 1) * gap) / segments : segWidth
          const x = startX + i * (effectiveSegWidth + gap)

          return (
            <g key={i} style={{ transition: "all 0.5s ease" }}>
              <rect
                x={x}
                y={0}
                width={effectiveSegWidth}
                height={40}
                rx={2}
                fill="url(#wood)"
                stroke="#92400e"
                strokeWidth="1"
                filter="url(#shadow)"
              />
              {/* Segment Label */}
              <text x={x + effectiveSegWidth / 2} y={25} textAnchor="middle" fill="#fff" fontSize="14" style={{ opacity: stage >= 2 ? 1 : 0, transition: "opacity 0.5s" }}>
                {segLen}
              </text>
              <text x={x + effectiveSegWidth / 2} y={60} textAnchor="middle" fill="#6b7280" fontSize="12">
                第{i + 1}段
              </text>
            </g>
          )
        })}
      </g>

      {/* Cut Points & Animation */}
      <g transform="translate(0, 120)">
        {[...Array(cuts)].map((_, i) => {
          // Position cuts based on unseparated state initially
          const x = startX + (i + 1) * segWidth
          const isCut = i < cutProgress

          return (
            <g key={i}>
              {/* Cut Line (Dashed) */}
              <line
                x1={x} y1={-10} x2={x} y2={50}
                stroke="#ef4444"
                strokeWidth="2"
                strokeDasharray="4 4"
                opacity={stage === 1 ? 0.5 : 0}
              />

              {/* Saw/Scissors Icon */}
              <text
                x={x}
                y={-15}
                textAnchor="middle"
                fontSize="24"
                style={{
                  opacity: stage === 1 && isCut ? 1 : 0,
                  transform: stage === 1 && isCut ? "translateY(10px) rotate(-15deg)" : "translateY(0) rotate(0)",
                  transition: "all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                }}
              >
                🪚
              </text>

              {/* Cut Number */}
              <text
                x={x}
                y={-35}
                textAnchor="middle"
                fill="#ef4444"
                fontSize="12"
                style={{ opacity: stage >= 1 ? 1 : 0 }}
              >
                第{i + 1}次
              </text>
            </g>
          )
        })}
      </g>

      {/* Total Length Brace */}
      {stage >= 2 && (
        <g style={{ opacity: 1, transition: "opacity 0.5s 0.5s" }}>
          <path d={`M${startX},180 v10 h${availWidth} v-10`} fill="none" stroke="#374151" strokeWidth="1.5" />
          <text x={startX + availWidth / 2} y={210} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#374151">
            总长 = {segments} × {segLen} = {totalLen}
          </text>
        </g>
      )}
    </svg>
  )
}