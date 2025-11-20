"use client"
import { useEffect, useState } from "react"

type Props = {
  daysA: number      // Days for A to complete alone
  daysB: number      // Days for B to complete alone
  stage?: number
}

export function EngineeringViz({ daysA, daysB, stage = 0 }: Props) {
  const width = 640
  const height = 450

  // Calculate work rates and combined time
  const rateA = 1 / daysA  // Work done per day by A
  const rateB = 1 / daysB  // Work done per day by B
  const combinedRate = rateA + rateB
  const combinedDays = 1 / combinedRate

  const [animProgress, setAnimProgress] = useState(0)

  useEffect(() => {
    if (stage >= 2) {
      // Animate progress bar
      let progress = 0
      const interval = setInterval(() => {
        progress += 0.02
        setAnimProgress(Math.min(progress, 1))
        if (progress >= 1) clearInterval(interval)
      }, 30)
      return () => clearInterval(interval)
    } else {
      setAnimProgress(0)
    }
  }, [stage])

  const barWidth = 400
  const barHeight = 30

  return (
    <svg width={width} height={height} className="svg-panel">
      <defs>
        <linearGradient id="progress-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>

      {/* Title */}
      <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">工程问题图解</text>

      {/* Info Display */}
      <g transform="translate(24, 50)">
        <text fontSize="13" fill="#6b7280">
          甲: {daysA}天完成 | 乙: {daysB}天完成 | 合作: {combinedDays.toFixed(1)}天
        </text>
      </g>

      {/* Worker A visualization */}
      <g transform="translate(40, 90)">
        <text x={0} y={0} fontSize="14" fontWeight="bold" fill="#3b82f6">甲单独做</text>

        {/* Progress bar background */}
        <rect x={0} y={15} width={barWidth} height={barHeight} rx={6} fill="#e5e7eb" />

        {/* Daily progress segments */}
        {Array.from({ length: daysA }).map((_, i) => (
          <g key={i}>
            <rect
              x={i * (barWidth / daysA)}
              y={15}
              width={barWidth / daysA - 1}
              height={barHeight}
              rx={i === 0 ? 6 : 0}
              fill="#93c5fd"
              stroke="#3b82f6"
              strokeWidth="1"
              style={{
                opacity: stage >= 1 ? 1 : 0.3,
                transition: `opacity 0.3s ${i * 0.1}s`
              }}
            />
            <text
              x={i * (barWidth / daysA) + (barWidth / daysA) / 2}
              y={35}
              textAnchor="middle"
              fontSize="9"
              fill="#1e40af"
            >
              {i + 1}
            </text>
          </g>
        ))}

        {/* Rate label */}
        <text x={barWidth + 15} y={35} fontSize="12" fill="#3b82f6">
          每天: 1/{daysA}
        </text>
      </g>

      {/* Worker B visualization */}
      <g transform="translate(40, 160)">
        <text x={0} y={0} fontSize="14" fontWeight="bold" fill="#f59e0b">乙单独做</text>

        {/* Progress bar background */}
        <rect x={0} y={15} width={barWidth} height={barHeight} rx={6} fill="#e5e7eb" />

        {/* Daily progress segments */}
        {Array.from({ length: daysB }).map((_, i) => (
          <g key={i}>
            <rect
              x={i * (barWidth / daysB)}
              y={15}
              width={barWidth / daysB - 1}
              height={barHeight}
              rx={i === 0 ? 6 : 0}
              fill="#fde68a"
              stroke="#f59e0b"
              strokeWidth="1"
              style={{
                opacity: stage >= 1 ? 1 : 0.3,
                transition: `opacity 0.3s ${i * 0.1}s`
              }}
            />
            <text
              x={i * (barWidth / daysB) + (barWidth / daysB) / 2}
              y={35}
              textAnchor="middle"
              fontSize="9"
              fill="#92400e"
            >
              {i + 1}
            </text>
          </g>
        ))}

        {/* Rate label */}
        <text x={barWidth + 15} y={35} fontSize="12" fill="#f59e0b">
          每天: 1/{daysB}
        </text>
      </g>

      {/* Combined work visualization */}
      {stage >= 2 && (
        <g transform="translate(40, 230)" style={{ opacity: stage >= 2 ? 1 : 0, transition: "opacity 0.5s" }}>
          <text x={0} y={0} fontSize="14" fontWeight="bold" fill="#8b5cf6">甲乙合作</text>

          {/* Progress bar background */}
          <rect x={0} y={15} width={barWidth} height={barHeight} rx={6} fill="#e5e7eb" />

          {/* Animated progress */}
          <rect
            x={0}
            y={15}
            width={barWidth * animProgress}
            height={barHeight}
            rx={6}
            fill="url(#progress-gradient)"
          />

          {/* Combined rate label */}
          <text x={barWidth + 15} y={35} fontSize="12" fill="#8b5cf6">
            每天: 1/{daysA} + 1/{daysB}
          </text>
        </g>
      )}

      {/* Formula explanation */}
      {stage >= 3 && (
        <g transform="translate(40, 300)" style={{ opacity: stage >= 3 ? 1 : 0, transition: "opacity 0.5s" }}>
          <rect x={0} y={0} width={barWidth + 80} height={60} rx={8} fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
          <text x={20} y={22} fill="#166534" fontSize="13" fontWeight="bold">公式推导:</text>
          <text x={20} y={44} fill="#166534" fontSize="12">
            合作效率 = 1/{daysA} + 1/{daysB} = {(rateA + rateB).toFixed(4)}  →  合作时间 = 1 ÷ {(rateA + rateB).toFixed(4)} ≈ {combinedDays.toFixed(1)}天
          </text>
        </g>
      )}

      {/* Result */}
      {stage >= 3 && (
        <g transform="translate(40, 375)" style={{ opacity: stage >= 3 ? 1 : 0, transition: "opacity 0.5s" }}>
          <rect x={0} y={0} width={barWidth + 80} height={50} rx={8} fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
          <text x={20} y={32} fill="#1e40af" fontSize="14" fontWeight="bold">
            答案: 甲乙合作需要 {combinedDays.toFixed(1)} 天完成工程
          </text>
        </g>
      )}

      {/* Visual tip */}
      {stage >= 2 && (
        <g transform={`translate(${width - 100}, 90)`}>
          <circle cx={0} cy={0} r={25} fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
          <text x={0} y={6} textAnchor="middle" fontSize="20">⚡</text>
        </g>
      )}
    </svg>
  )
}
