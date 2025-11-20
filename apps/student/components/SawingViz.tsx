"use client"
import { useEffect, useState } from "react"

type Props = {
  segments: number
  timePerCut: number
  stage?: number
}

export function SawingViz({ segments, timePerCut, stage = 0 }: Props) {
  const width = 640
  const height = 420

  const cuts = segments - 1
  const totalTime = cuts * timePerCut

  // Calculate dimensions
  const logWidth = 500
  const logHeight = 60
  const segmentWidth = logWidth / segments

  const [animCuts, setAnimCuts] = useState(0)

  useEffect(() => {
    if (stage === 0) {
      setAnimCuts(0)
    } else if (stage >= 1) {
      // Animate cuts one by one
      let currentCut = 0
      const interval = setInterval(() => {
        currentCut++
        setAnimCuts(currentCut)
        if (currentCut >= cuts) {
          clearInterval(interval)
        }
      }, 400)
      return () => clearInterval(interval)
    }
  }, [stage, cuts])

  return (
    <svg width={width} height={height} className="svg-panel">
      <defs>
        <linearGradient id="wood-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#d4a373" />
          <stop offset="50%" stopColor="#bc6c25" />
          <stop offset="100%" stopColor="#a3520c" />
        </linearGradient>
        <pattern id="wood-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
          <rect width="20" height="20" fill="#bc6c25" />
          <circle cx="10" cy="10" r="3" fill="#a3520c" opacity="0.3" />
        </pattern>
      </defs>

      {/* Title */}
      <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">锯木头问题图解</text>

      {/* Info */}
      <g transform="translate(24, 50)">
        <text fontSize="14" fill="#6b7280">
          目标段数: {segments}段 | 每锯一次: {timePerCut}分钟 | 锯的次数: {cuts}次 | 总时间: {totalTime}分钟
        </text>
      </g>

      {/* Log visualization */}
      <g transform="translate(70, 100)">
        {/* The log */}
        <rect
          x={0}
          y={0}
          width={logWidth}
          height={logHeight}
          rx={8}
          fill="url(#wood-gradient)"
          stroke="#8b4513"
          strokeWidth="3"
        />

        {/* Wood rings pattern */}
        <ellipse cx={logWidth / 2} cy={logHeight / 2} rx={8} ry={20} fill="#a3520c" opacity="0.3" />

        {/* Cut lines */}
        {stage >= 1 && Array.from({ length: cuts }).map((_, i) => {
          const x = (i + 1) * segmentWidth
          const isCut = animCuts > i

          return (
            <g key={i}>
              {/* Cut line */}
              <line
                x1={x}
                y1={-10}
                x2={x}
                y2={logHeight + 10}
                stroke={isCut ? "#ef4444" : "#fbbf24"}
                strokeWidth={isCut ? "4" : "2"}
                strokeDasharray={isCut ? "none" : "5 3"}
                style={{
                  opacity: stage >= 1 ? 1 : 0,
                  transition: "opacity 0.3s"
                }}
              />

              {/* Saw icon */}
              {!isCut && stage >= 1 && animCuts === i && (
                <g transform={`translate(${x}, -25)`}>
                  <text textAnchor="middle" fontSize="20">🪚</text>
                </g>
              )}

              {/* Cut number */}
              <text
                x={x}
                y={logHeight + 30}
                textAnchor="middle"
                fill={isCut ? "#dc2626" : "#9ca3af"}
                fontSize="12"
                style={{
                  opacity: stage >= 1 ? 1 : 0,
                  transition: `opacity 0.3s ${i * 0.1}s`
                }}
              >
                {i + 1}
              </text>
            </g>
          )
        })}

        {/* Segment labels */}
        {stage >= 2 && Array.from({ length: segments }).map((_, i) => {
          const x = i * segmentWidth + segmentWidth / 2
          return (
            <text
              key={`seg-${i}`}
              x={x}
              y={logHeight / 2 + 5}
              textAnchor="middle"
              fill="white"
              fontSize="14"
              fontWeight="bold"
              style={{
                opacity: animCuts >= cuts ? 1 : 0,
                transition: "opacity 0.5s"
              }}
            >
              {i + 1}
            </text>
          )
        })}
      </g>

      {/* Explanation section */}
      {stage >= 2 && (
        <g transform="translate(70, 200)">
          {/* Key insight */}
          <rect x={0} y={0} width={logWidth} height={50} rx={8} fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
          <text x={20} y={20} fill="#92400e" fontSize="14" fontWeight="bold">关键发现:</text>
          <text x={20} y={40} fill="#92400e" fontSize="13">
            锯成 {segments} 段，需要锯 {cuts} 次！  段数 = 刀数 + 1
          </text>
        </g>
      )}

      {/* Formula */}
      {stage >= 3 && (
        <g transform="translate(70, 265)">
          <rect x={0} y={0} width={logWidth} height={60} rx={8} fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
          <text x={20} y={25} fill="#166534" fontSize="14" fontWeight="bold">公式:</text>
          <text x={20} y={48} fill="#166534" fontSize="13">
            总时间 = (段数 - 1) × 每次时间 = {cuts} × {timePerCut} = {totalTime}分钟
          </text>
        </g>
      )}

      {/* Practice variation */}
      {stage >= 4 && (
        <g transform="translate(70, 340)">
          <rect x={0} y={0} width={logWidth} height={50} rx={8} fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
          <text x={20} y={20} fill="#1e40af" fontSize="14" fontWeight="bold">变形思考:</text>
          <text x={20} y={40} fill="#1e40af" fontSize="12">
            如果要锯成 {segments + 2} 段，需要 {segments + 1} 次，总共 {(segments + 1) * timePerCut} 分钟！
          </text>
        </g>
      )}

      {/* Visual counter */}
      {stage >= 1 && (
        <g transform={`translate(${width - 100}, 100)`}>
          <rect x={0} y={0} width={80} height={80} rx={8} fill="#fef2f2" stroke="#f87171" strokeWidth="2" />
          <text x={40} y={25} textAnchor="middle" fill="#dc2626" fontSize="12" fontWeight="bold">已锯</text>
          <text x={40} y={55} textAnchor="middle" fill="#dc2626" fontSize="24" fontWeight="bold">
            {Math.min(animCuts, cuts)}
          </text>
          <text x={40} y={72} textAnchor="middle" fill="#dc2626" fontSize="12">次</text>
        </g>
      )}
    </svg>
  )
}
