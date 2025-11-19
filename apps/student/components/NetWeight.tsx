"use client"
import { useEffect, useState } from "react"

type Props = {
  grossBefore: number
  grossAfter: number
  stage?: number
}

export function NetWeight({ grossBefore, grossAfter, stage = 0 }: Props) {
  const width = 640
  const height = 320

  // Math
  const half = grossBefore - grossAfter
  const net = half * 2
  const tare = grossBefore - net

  // Scale
  // We want the larger bar (grossBefore) to take up about 70-80% of width
  const maxW = width * 0.75
  const scale = maxW / grossBefore

  const tareW = tare * scale
  const halfW = half * scale
  const beforeW = grossBefore * scale
  const afterW = grossAfter * scale

  // Animation States
  const [showBars, setShowBars] = useState(0)
  const [showDiff, setShowDiff] = useState(0)
  const [showCalc, setShowCalc] = useState(0)

  useEffect(() => {
    if (stage === 0) {
      setShowBars(1)
      setShowDiff(0)
      setShowCalc(0)
    } else if (stage === 1) {
      setShowBars(1)
      setShowDiff(1)
      setShowCalc(0)
    } else if (stage >= 2) {
      setShowBars(1)
      setShowDiff(1)
      setShowCalc(1)
    }
  }, [stage])

  return (
    <svg width={width} height={height} className="svg-panel">
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
        </marker>
        <pattern id="stripe" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="4" height="8" transform="translate(0,0)" fill="#ef4444" opacity="0.2" />
        </pattern>
      </defs>

      {/* Title */}
      <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">对比法求净重</text>

      <g transform="translate(40, 70)">

        {/* Bar 1: Before */}
        <g style={{ opacity: showBars, transition: "opacity 0.5s" }}>
          <text x={0} y={-8} fontSize="14" fill="#4b5563">第一次 (连皮)</text>
          {/* Tare */}
          <rect x={0} y={0} width={tareW} height={36} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" rx={4} />
          <text x={tareW / 2} y={23} textAnchor="middle" fontSize="12" fill="#6b7280">皮</text>

          {/* Half 1 */}
          <rect x={tareW} y={0} width={halfW} height={36} fill="#93c5fd" stroke="#3b82f6" strokeWidth="2" rx={4} />
          <text x={tareW + halfW / 2} y={23} textAnchor="middle" fontSize="12" fill="#1e40af">半</text>

          {/* Half 2 */}
          <rect x={tareW + halfW} y={0} width={halfW} height={36} fill="#60a5fa" stroke="#2563eb" strokeWidth="2" rx={4} />
          <text x={tareW + halfW + halfW / 2} y={23} textAnchor="middle" fontSize="12" fill="#fff">半</text>

          {/* Label */}
          <text x={beforeW + 10} y={23} fontSize="16" fontWeight="bold" fill="#374151">{grossBefore}</text>
        </g>

        {/* Bar 2: After */}
        <g transform="translate(0, 80)" style={{ opacity: showBars, transition: "opacity 0.5s 0.2s" }}>
          <text x={0} y={-8} fontSize="14" fill="#4b5563">第二次 (取出一般)</text>
          {/* Tare */}
          <rect x={0} y={0} width={tareW} height={36} fill="#e5e7eb" stroke="#9ca3af" strokeWidth="2" rx={4} />
          <text x={tareW / 2} y={23} textAnchor="middle" fontSize="12" fill="#6b7280">皮</text>

          {/* Half 1 */}
          <rect x={tareW} y={0} width={halfW} height={36} fill="#93c5fd" stroke="#3b82f6" strokeWidth="2" rx={4} />
          <text x={tareW + halfW / 2} y={23} textAnchor="middle" fontSize="12" fill="#1e40af">半</text>

          {/* Ghost Half 2 */}
          <rect x={tareW + halfW} y={0} width={halfW} height={36} fill="url(#stripe)" stroke="#ef4444" strokeWidth="2" strokeDasharray="4 4" rx={4} opacity="0.5" />

          {/* Label */}
          <text x={afterW + 10} y={23} fontSize="16" fontWeight="bold" fill="#374151">{grossAfter}</text>
        </g>

        {/* Difference Indicator */}
        <g style={{ opacity: showDiff, transition: "opacity 0.5s" }}>
          {/* Vertical dashed lines to show alignment */}
          <line x1={afterW} y1={116} x2={afterW} y2={150} stroke="#ef4444" strokeDasharray="4 4" />
          <line x1={beforeW} y1={36} x2={beforeW} y2={150} stroke="#ef4444" strokeDasharray="4 4" />

          {/* Brace/Arrow */}
          <path d={`M${afterW},140 L${beforeW},140`} stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow)" markerStart="url(#arrow)" />

          <text x={afterW + halfW / 2} y={165} textAnchor="middle" fill="#dc2626" fontWeight="bold" fontSize="14">
            差 = {half} (半袋)
          </text>
        </g>

        {/* Calculation */}
        <g transform="translate(0, 190)" style={{ opacity: showCalc, transition: "opacity 0.5s" }}>
          <rect x={0} y={0} width={width - 80} height={50} fill="#eff6ff" stroke="#bfdbfe" rx={8} />
          <text x={20} y={32} fontSize="16" fill="#1e3a8a">
            原物重 = {half} × 2 = <tspan fontWeight="bold" fontSize="20" fill="#2563eb">{net}</tspan>
          </text>
        </g>

      </g>
    </svg>
  )
}