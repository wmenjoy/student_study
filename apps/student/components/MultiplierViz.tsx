"use client"
import { useEffect, useState } from "react"

type Props = {
  smallValue: number
  multiplier: number
  stage?: number
}

export function MultiplierViz({ smallValue, multiplier, stage = 0 }: Props) {
  const width = 640
  const height = 400

  const bigValue = smallValue * multiplier
  const diff = bigValue - smallValue

  // Dynamic scaling
  const maxVal = bigValue
  const scale = Math.min(8, (width - 120) / maxVal)

  const smallW = smallValue * scale
  const bigW = bigValue * scale
  const diffW = diff * scale

  const [animStage, setAnimStage] = useState(0)

  useEffect(() => {
    setAnimStage(stage)
  }, [stage])

  return (
    <svg width={width} height={height} className="svg-panel">
      <defs>
        <marker id="mult-arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#6b7280" />
        </marker>
        <pattern id="mult-stripe" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="4" height="8" transform="translate(0,0)" fill="#f59e0b" opacity="0.5" />
        </pattern>
      </defs>

      {/* Title */}
      <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">倍数问题图解</text>

      {/* Info Display */}
      <g transform="translate(24, 50)">
        <text fontSize="14" fill="#6b7280">
          小数: {smallValue} | 倍数: {multiplier}倍 | 大数: {bigValue} | 差: {diff}
        </text>
      </g>

      {/* Main Visualization */}
      <g transform="translate(40, 100)">

        {/* Small value bar (e.g., chair price) */}
        <g>
          <text x={-10} y={25} textAnchor="end" fill="#4b5563" fontSize="14" fontWeight="bold">小</text>
          <rect x={0} y={0} width={smallW} height={40} rx={4} fill="#93c5fd" stroke="#3b82f6" strokeWidth="2" />
          <text x={smallW / 2} y={25} textAnchor="middle" fill="#1e40af" fontSize="14" fontWeight="bold">
            {smallValue}
          </text>

          {/* Label showing "1份" */}
          {animStage >= 1 && (
            <g style={{ opacity: animStage >= 1 ? 1 : 0, transition: "opacity 0.5s" }}>
              <text x={smallW / 2} y={-8} textAnchor="middle" fill="#3b82f6" fontSize="12">
                1份
              </text>
            </g>
          )}
        </g>

        {/* Big value bar (e.g., table price) */}
        <g transform="translate(0, 70)">
          <text x={-10} y={25} textAnchor="end" fill="#4b5563" fontSize="14" fontWeight="bold">大</text>

          {/* Show the big bar divided into parts */}
          {animStage >= 1 && (
            <g>
              {Array.from({ length: multiplier }).map((_, i) => (
                <rect
                  key={i}
                  x={i * smallW}
                  y={0}
                  width={smallW}
                  height={40}
                  rx={i === 0 ? 4 : 0}
                  fill={i === 0 ? "#93c5fd" : "#fcd34d"}
                  stroke={i === 0 ? "#3b82f6" : "#f59e0b"}
                  strokeWidth="2"
                  style={{
                    opacity: animStage >= 1 ? 1 : 0,
                    transition: `opacity 0.5s ${i * 0.2}s`
                  }}
                />
              ))}

              {/* Labels for each part */}
              {Array.from({ length: multiplier }).map((_, i) => (
                <text
                  key={`label-${i}`}
                  x={i * smallW + smallW / 2}
                  y={-8}
                  textAnchor="middle"
                  fill={i === 0 ? "#3b82f6" : "#d97706"}
                  fontSize="11"
                  style={{
                    opacity: animStage >= 1 ? 1 : 0,
                    transition: `opacity 0.5s ${i * 0.2 + 0.3}s`
                  }}
                >
                  {i + 1}份
                </text>
              ))}
            </g>
          )}

          {/* Total value text */}
          <text x={bigW / 2} y={25} textAnchor="middle" fill="#92400e" fontSize="14" fontWeight="bold">
            {bigValue}
          </text>
        </g>

        {/* Difference highlight */}
        {animStage >= 2 && (
          <g transform="translate(0, 150)">
            <text x={-10} y={25} textAnchor="end" fill="#4b5563" fontSize="14" fontWeight="bold">差</text>

            {/* The difference bar (multiplier - 1 parts) */}
            <rect
              x={0}
              y={0}
              width={diffW}
              height={40}
              rx={4}
              fill="url(#mult-stripe)"
              stroke="#f59e0b"
              strokeWidth="2"
              strokeDasharray="4 4"
              style={{
                opacity: animStage >= 2 ? 1 : 0,
                transition: "opacity 0.5s"
              }}
            />

            <text x={diffW / 2} y={25} textAnchor="middle" fill="#d97706" fontSize="14" fontWeight="bold">
              {diff}
            </text>

            {/* Explanation */}
            <text x={diffW + 20} y={25} fill="#6b7280" fontSize="12">
              = ({multiplier} - 1) 份 = {multiplier - 1} 份
            </text>
          </g>
        )}

        {/* Formula explanation */}
        {animStage >= 3 && (
          <g transform="translate(0, 220)" style={{ opacity: animStage >= 3 ? 1 : 0, transition: "opacity 0.5s" }}>
            <rect x={0} y={0} width={bigW} height={60} rx={8} fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />

            <text x={20} y={25} fill="#166534" fontSize="14" fontWeight="bold">
              公式推导:
            </text>
            <text x={20} y={45} fill="#166534" fontSize="13">
              差 = 小数 × (倍数 - 1)  →  小数 = 差 ÷ (倍数 - 1)
            </text>
          </g>
        )}

        {/* Result calculation */}
        {animStage >= 4 && (
          <g transform="translate(0, 295)" style={{ opacity: animStage >= 4 ? 1 : 0, transition: "opacity 0.5s" }}>
            <rect x={0} y={0} width={bigW} height={50} rx={8} fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />

            <text x={20} y={30} fill="#1e40af" fontSize="14" fontWeight="bold">
              计算: {diff} ÷ {multiplier - 1} = {smallValue}  →  小数 = {smallValue}
            </text>
          </g>
        )}
      </g>

      {/* Fun fact icon */}
      {animStage >= 4 && (
        <g transform={`translate(${width - 100}, 30)`}>
          <circle cx={0} cy={0} r={20} fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
          <text x={0} y={6} textAnchor="middle" fontSize="16">💡</text>
        </g>
      )}
    </svg>
  )
}
