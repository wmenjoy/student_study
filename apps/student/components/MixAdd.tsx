"use client"
import { useEffect, useState } from "react"

type Props = { inMorning: number; outAfternoon: number; start: number; stage?: number }

export function MixAdd({ inMorning, outAfternoon, start, stage = 0 }: Props) {
  const width = 640
  const height = 320

  // Dynamic scaling
  const maxVal = Math.max(start + inMorning, start)
  const scale = Math.min(10, (width - 100) / maxVal)

  const startW = start * scale
  const inW = inMorning * scale
  const outW = outAfternoon * scale
  const afterInW = startW + inW
  const finalW = afterInW - outW

  const [animIn, setAnimIn] = useState(0)
  const [animOut, setAnimOut] = useState(0)

  useEffect(() => {
    if (stage === 0) {
      setAnimIn(0)
      setAnimOut(0)
    } else if (stage === 1) {
      setAnimIn(1)
      setAnimOut(0)
    } else if (stage === 2) {
      setAnimIn(1)
      setAnimOut(1)
    }
  }, [stage])

  return (
    <svg width={width} height={height} className="svg-panel">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#6b7280" />
        </marker>
        <pattern id="stripe" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="4" height="8" transform="translate(0,0)" fill="#ef4444" opacity="0.3" />
        </pattern>
      </defs>

      {/* Summary Text */}
      <g>
        <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">库存变化</text>
        <text x={24} y={56} fontSize="14" fill="#6b7280">初始: {start}</text>
        <text x={120} y={56} fontSize="14" fill="#6b7280">入库: +{inMorning}</text>
        <text x={220} y={56} fontSize="14" fill="#6b7280">出库: -{outAfternoon}</text>
        {stage >= 2 && (
          <text x={340} y={56} fontSize="16" fontWeight="bold" fill="#2563eb">
            最终: {start + inMorning - outAfternoon}
          </text>
        )}
      </g>

      {/* Main Visualization Area */}
      <g transform="translate(40, 100)">

        {/* 1. Initial Stock */}
        <g>
          <rect x={0} y={0} width={startW} height={40} rx={4} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" />
          <text x={startW / 2} y={25} textAnchor="middle" fill="#4b5563" fontSize="14">初始 {start}</text>
          <line x1={0} y1={45} x2={0} y2={55} stroke="#9ca3af" />
          <line x1={startW} y1={45} x2={startW} y2={55} stroke="#9ca3af" />
          <text x={startW / 2} y={65} textAnchor="middle" fill="#9ca3af" fontSize="12">{start}</text>
        </g>

        {/* 2. Add In-Stock */}
        <g style={{ opacity: stage >= 1 ? 1 : 0, transition: "opacity 0.5s" }}>
          <rect
            x={startW}
            y={0}
            width={inW}
            height={40}
            rx={4}
            fill="#93c5fd"
            stroke="#3b82f6"
            strokeWidth="2"
            style={{
              transformOrigin: `${startW}px center`,
              transform: `scaleX(${animIn})`,
              transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)"
            }}
          />
          <text
            x={startW + inW / 2}
            y={-10}
            textAnchor="middle"
            fill="#2563eb"
            fontSize="14"
            style={{ opacity: animIn, transition: "opacity 0.5s 0.5s" }}
          >
            +{inMorning}
          </text>
        </g>

        {/* 3. Subtract Out-Stock */}
        {stage >= 2 && (
          <g>
            {/* Brace showing the removal */}
            <path
              d={`M${afterInW},80 v10 h-${outW} v-10`}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              style={{ opacity: animOut, transition: "opacity 0.5s" }}
            />
            <text
              x={afterInW - outW / 2}
              y={110}
              textAnchor="middle"
              fill="#ef4444"
              fontSize="14"
              style={{ opacity: animOut, transition: "opacity 0.5s" }}
            >
              -{outAfternoon}
            </text>

            {/* Visual "Cut" or "Mask" */}
            <rect
              x={afterInW - outW}
              y={0}
              width={outW}
              height={40}
              fill="url(#stripe)"
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="4 4"
              style={{ opacity: animOut, transition: "opacity 0.5s 0.3s" }}
            />
          </g>
        )}

        {/* Final Result Line */}
        {stage >= 2 && (
          <g style={{ opacity: animOut, transition: "opacity 0.5s 0.8s" }}>
            <line x1={0} y1={140} x2={finalW} y2={140} stroke="#2563eb" strokeWidth="4" markerEnd="url(#arrow)" />
            <line x1={0} y1={135} x2={0} y2={145} stroke="#2563eb" strokeWidth="2" />
            <text x={finalW / 2} y={160} textAnchor="middle" fill="#2563eb" fontWeight="bold">
              剩余 = {start + inMorning - outAfternoon}
            </text>
          </g>
        )}

      </g>
    </svg>
  )
}