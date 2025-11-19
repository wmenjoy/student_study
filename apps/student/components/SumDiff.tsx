"use client"
import { useEffect, useState } from "react"

type Props = { total: number; diff: number; stage?: number }

export function SumDiff({ total, diff, stage = 0 }: Props) {
  const a = (total + diff) / 2
  const b = (total - diff) / 2
  const width = 640
  const height = 320

  // Scale logic
  const maxVal = Math.max(total, a)
  const scale = Math.min(5, (width - 150) / maxVal)

  const startX = 60
  const startY = 80

  const [showBars, setShowBars] = useState(0)
  const [showDiff, setShowDiff] = useState(0)
  const [showSum, setShowSum] = useState(0)
  const [showFormula, setShowFormula] = useState(0)

  useEffect(() => {
    if (stage === 0) {
      setShowBars(1)
      setShowDiff(0)
      setShowSum(0)
      setShowFormula(0)
    } else if (stage === 1) {
      setShowBars(1)
      setShowDiff(1)
      setShowSum(1)
      setShowFormula(1)
    } else if (stage >= 2) {
      setShowBars(1)
      setShowDiff(1)
      setShowSum(1)
      setShowFormula(2) // Show second formula
    }
  }, [stage])

  const aWidth = a * scale
  const bWidth = b * scale
  const diffWidth = diff * scale

  return (
    <svg width={width} height={height} className="svg-panel">
      <defs>
        <linearGradient id="blueGradSD" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="orangeGradSD" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
        </marker>
      </defs>

      {/* Summary Header */}
      <g>
        <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">和差问题</text>
        <text x={24} y={56} fontSize="14" fill="#6b7280">总和 = {total}</text>
        <text x={140} y={56} fontSize="14" fill="#6b7280">差 = {diff}</text>
        {stage >= 1 && (
          <>
            <text x={260} y={56} fontSize="14" fontWeight="bold" fill="#2563eb" style={{ opacity: showFormula ? 1 : 0, transition: "opacity 0.5s" }}>
              A = {a}
            </text>
            <text x={360} y={56} fontSize="14" fontWeight="bold" fill="#f97316" style={{ opacity: showFormula >= 2 ? 1 : 0, transition: "opacity 0.5s" }}>
              B = {b}
            </text>
          </>
        )}
      </g>

      <g transform={`translate(${startX}, ${startY})`}>
        {/* Bar A (larger) */}
        <g style={{ opacity: showBars, transition: "opacity 0.5s" }}>
          <rect
            x={0}
            y={0}
            width={aWidth}
            height={40}
            rx={4}
            fill="url(#blueGradSD)"
            stroke="#2563eb"
            strokeWidth="2"
            style={{ transition: "width 0.5s ease" }}
          />
          <text x={aWidth / 2} y={25} textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">
            A
          </text>

          {/* Length bracket */}
          <g style={{ opacity: showFormula ? 1 : 0, transition: "opacity 0.5s 0.2s" }}>
            <text x={aWidth + 10} y={25} fill="#2563eb" fontSize="16" fontWeight="bold">{a}</text>
          </g>
        </g>

        {/* Bar B (smaller) */}
        <g transform="translate(0, 80)" style={{ opacity: showBars, transition: "opacity 0.5s 0.1s" }}>
          <rect
            x={0}
            y={0}
            width={bWidth}
            height={40}
            rx={4}
            fill="url(#orangeGradSD)"
            stroke="#f97316"
            strokeWidth="2"
            style={{ transition: "width 0.5s ease" }}
          />
          <text x={bWidth / 2} y={25} textAnchor="middle" fill="#fff" fontSize="16" fontWeight="bold">
            B
          </text>

          {/* Length bracket */}
          <g style={{ opacity: showFormula >= 2 ? 1 : 0, transition: "opacity 0.5s 0.2s" }}>
            <text x={bWidth + 10} y={25} fill="#f97316" fontSize="16" fontWeight="bold">{b}</text>
          </g>
        </g>

        {/* Difference visualization */}
        <g style={{ opacity: showDiff, transition: "opacity 0.5s 0.3s" }}>
          {/* Dashed extension on B to match A */}
          <rect
            x={bWidth}
            y={80}
            width={diffWidth}
            height={40}
            fill="none"
            stroke="#ef4444"
            strokeWidth="2"
            strokeDasharray="4 4"
            rx={4}
          />
          {/* Vertical alignment lines */}
          <line x1={bWidth} y1={40} x2={bWidth} y2={80} stroke="#9ca3af" strokeDasharray="2 2" />
          <line x1={aWidth} y1={40} x2={aWidth} y2={80} stroke="#9ca3af" strokeDasharray="2 2" />

          {/* Brace */}
          <path d={`M${bWidth},130 L${aWidth},130`} stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
          <text x={bWidth + diffWidth / 2} y={150} textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="bold">
            差 = {diff}
          </text>
        </g>

        {/* Sum visualization */}
        <g style={{ opacity: showSum, transition: "opacity 0.5s 0.5s" }}>
          <path d={`M-10,0 L-10,120`} stroke="#374151" strokeWidth="2" />
          <line x1="-10" y1="0" x2="0" y2="0" stroke="#374151" strokeWidth="2" />
          <line x1="-10" y1="120" x2="0" y2="120" stroke="#374151" strokeWidth="2" />

          <text x={-20} y={60} textAnchor="end" fontSize="16" fontWeight="bold" fill="#374151">
            总和 {total}
          </text>
        </g>
      </g>

      {/* Formula display */}
      <g transform="translate(20, 250)">
        {/* Formula 1: A */}
        <g style={{ opacity: showFormula ? 1 : 0, transform: `translateY(${showFormula ? 0 : 20}px)`, transition: "all 0.5s 0.6s" }}>
          <rect x={0} y={0} width={600} height={40} rx={8} fill="#eff6ff" stroke="#bfdbfe" strokeWidth="1" />
          <text x={15} y={26} fontSize="16" fill="#1e3a8a">
            <tspan fontWeight="bold" fill="#2563eb">A</tspan> = (总和 + 差) ÷ 2 = ({total} + {diff}) ÷ 2 = <tspan fontWeight="bold" fontSize="18">{a}</tspan>
          </text>
        </g>

        {/* Formula 2: B */}
        <g style={{ opacity: showFormula >= 2 ? 1 : 0, transform: `translateY(${showFormula >= 2 ? 50 : 70}px)`, transition: "all 0.5s 0.8s" }}>
          <rect x={0} y={0} width={600} height={40} rx={8} fill="#fff7ed" stroke="#fed7aa" strokeWidth="1" />
          <text x={15} y={26} fontSize="16" fill="#7c2d12">
            <tspan fontWeight="bold" fill="#f97316">B</tspan> = (总和 - 差) ÷ 2 = ({total} - {diff}) ÷ 2 = <tspan fontWeight="bold" fontSize="18">{b}</tspan>
          </text>
        </g>
      </g>
    </svg>
  )
}