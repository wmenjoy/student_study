"use client"
import { useMemo } from "react"

type Props = { left: number[]; right: number[] }

export function BalancedScale({ left, right }: Props) {
  const width = 640
  const height = 320
  const sumL = useMemo(() => left.reduce((a, b) => a + b, 0), [left])
  const sumR = useMemo(() => right.reduce((a, b) => a + b, 0), [right])

  // Calculate tilt angle (max +/- 20 degrees)
  const diff = sumR - sumL
  const tilt = Math.max(-20, Math.min(20, diff * 2))

  // Scale geometry
  const centerX = width / 2
  const pivotY = 100
  const beamLength = 240 // Half length
  const panYOffset = 120

  // Pan positions relative to beam ends
  // When beam tilts by `tilt` degrees:
  // Left end: x = -beamLength * cos(tilt), y = -beamLength * sin(tilt)
  // Right end: x = beamLength * cos(tilt), y = beamLength * sin(tilt)
  // Actually, simpler to use SVG transforms.

  return (
    <svg width={width} height={height} className="svg-panel">
      <defs>
        <linearGradient id="metal" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9ca3af" />
          <stop offset="50%" stopColor="#d1d5db" />
          <stop offset="100%" stopColor="#6b7280" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
          <feOffset dx="2" dy="2" result="offsetblur" />
          <feComponentTransfer>
            <feFuncA type="linear" slope="0.3" />
          </feComponentTransfer>
          <feMerge>
            <feMergeNode in="offsetblur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base & Pillar */}
      <g filter="url(#shadow)">
        <path d={`M${centerX - 40},280 L${centerX + 40},280 L${centerX + 10},100 L${centerX - 10},100 Z`} fill="url(#metal)" />
        <rect x={centerX - 50} y={280} width={100} height={10} rx={2} fill="#4b5563" />
      </g>

      {/* Beam Group (Rotates) */}
      <g transform={`translate(${centerX},${pivotY}) rotate(${tilt})`} style={{ transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
        {/* Beam */}
        <rect x={-beamLength} y={-6} width={beamLength * 2} height={12} rx={4} fill="#4b5563" />
        <circle cx={0} cy={0} r={8} fill="#374151" />

        {/* Left Pan Assembly */}
        {/* We apply a reverse rotation to the pan group so it stays vertical */}
        <g transform={`translate(${-beamLength + 20}, 0)`}>
          {/* String */}
          <line x1={0} y1={0} x2={0} y2={panYOffset} stroke="#9ca3af" strokeWidth="2" />
          {/* Pan (Counter-rotated) */}
          <g transform={`translate(0, ${panYOffset}) rotate(${-tilt})`} style={{ transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
            <path d="M-50,0 Q0,30 50,0" fill="none" stroke="#6ba4ff" strokeWidth="4" />
            <path d="M-50,0 L50,0" stroke="#6ba4ff" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
            {/* Weights Left */}
            <g transform="translate(0, -2)">
              {left.map((w, i) => (
                <rect
                  key={i}
                  x={-15}
                  y={-(i + 1) * 20}
                  width={30}
                  height={18}
                  rx={2}
                  fill="#3b82f6"
                  stroke="#1d4ed8"
                  strokeWidth="1"
                />
              ))}
            </g>
            {/* Total Label */}
            <text x={0} y={30} textAnchor="middle" fontSize="14" fill="#3b82f6" fontWeight="bold">{sumL}</text>
          </g>
        </g>

        {/* Right Pan Assembly */}
        <g transform={`translate(${beamLength - 20}, 0)`}>
          {/* String */}
          <line x1={0} y1={0} x2={0} y2={panYOffset} stroke="#9ca3af" strokeWidth="2" />
          {/* Pan (Counter-rotated) */}
          <g transform={`translate(0, ${panYOffset}) rotate(${-tilt})`} style={{ transition: "transform 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
            <path d="M-50,0 Q0,30 50,0" fill="none" stroke="#f59e0b" strokeWidth="4" />
            <path d="M-50,0 L50,0" stroke="#f59e0b" strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
            {/* Weights Right */}
            <g transform="translate(0, -2)">
              {right.map((w, i) => (
                <rect
                  key={i}
                  x={-15}
                  y={-(i + 1) * 20}
                  width={30}
                  height={18}
                  rx={2}
                  fill="#f59e0b"
                  stroke="#b45309"
                  strokeWidth="1"
                />
              ))}
            </g>
            {/* Total Label */}
            <text x={0} y={30} textAnchor="middle" fontSize="14" fill="#d97706" fontWeight="bold">{sumR}</text>
          </g>
        </g>
      </g>

      {/* Status Text */}
      <text x={centerX} y={40} textAnchor="middle" fontSize="20" fontWeight="bold" fill={sumL === sumR ? "#10b981" : "#ef4444"}>
        {sumL === sumR ? "平衡" : sumL > sumR ? "左边重" : "右边重"}
      </text>
      <text x={centerX} y={65} textAnchor="middle" fontSize="14" fill="#6b7280">
        {sumL} {sumL === sumR ? "=" : sumL > sumR ? ">" : "<"} {sumR}
      </text>
    </svg>
  )
}