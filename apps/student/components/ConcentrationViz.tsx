"use client"
import { useEffect, useState } from "react"

type Props = {
  saltWeight: number
  waterWeight: number
  stage?: number
}

export function ConcentrationViz({ saltWeight, waterWeight, stage = 0 }: Props) {
  const width = 640
  const height = 450

  const totalWeight = saltWeight + waterWeight
  const concentration = (saltWeight / totalWeight) * 100

  const [animLevel, setAnimLevel] = useState(0)

  useEffect(() => {
    if (stage >= 1) {
      let level = 0
      const interval = setInterval(() => {
        level += 0.03
        setAnimLevel(Math.min(level, 1))
        if (level >= 1) clearInterval(interval)
      }, 30)
      return () => clearInterval(interval)
    } else {
      setAnimLevel(0)
    }
  }, [stage])

  // Beaker dimensions
  const beakerWidth = 120
  const beakerHeight = 200
  const beakerX = 100
  const beakerY = 100

  // Water level based on total
  const maxLevel = 180
  const waterLevel = (totalWeight / 500) * maxLevel * animLevel
  const saltLevel = (saltWeight / 500) * maxLevel * animLevel

  return (
    <svg width={width} height={height} className="svg-panel">
      <defs>
        <linearGradient id="water-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id="salt-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
      </defs>

      {/* Title */}
      <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">浓度问题图解</text>

      {/* Info Display */}
      <g transform="translate(24, 50)">
        <text fontSize="13" fill="#6b7280">
          盐: {saltWeight}克 | 水: {waterWeight}克 | 总重: {totalWeight}克 | 浓度: {concentration.toFixed(1)}%
        </text>
      </g>

      {/* Beaker */}
      <g transform={`translate(${beakerX}, ${beakerY})`}>
        {/* Beaker outline */}
        <path
          d={`M0,0 L0,${beakerHeight} Q0,${beakerHeight + 10} 10,${beakerHeight + 10}
              L${beakerWidth - 10},${beakerHeight + 10} Q${beakerWidth},${beakerHeight + 10} ${beakerWidth},${beakerHeight}
              L${beakerWidth},0`}
          fill="none"
          stroke="#6b7280"
          strokeWidth="3"
        />

        {/* Solution (water + dissolved salt) */}
        {stage >= 1 && (
          <rect
            x={3}
            y={beakerHeight - waterLevel}
            width={beakerWidth - 6}
            height={waterLevel}
            fill="url(#water-gradient)"
            style={{ transition: "height 0.5s, y 0.5s" }}
          />
        )}

        {/* Salt particles visual */}
        {stage >= 1 && animLevel > 0.5 && (
          <g>
            {Array.from({ length: Math.min(Math.floor(saltWeight / 5), 20) }).map((_, i) => (
              <circle
                key={i}
                cx={10 + (i % 5) * 22}
                cy={beakerHeight - 10 - Math.floor(i / 5) * 15}
                r={3}
                fill="#fbbf24"
                opacity={0.8}
              />
            ))}
          </g>
        )}

        {/* Measurement lines */}
        {[0.25, 0.5, 0.75, 1].map((ratio, i) => (
          <g key={i}>
            <line
              x1={beakerWidth - 10}
              y1={beakerHeight - maxLevel * ratio}
              x2={beakerWidth}
              y2={beakerHeight - maxLevel * ratio}
              stroke="#9ca3af"
              strokeWidth="1"
            />
            <text
              x={beakerWidth + 5}
              y={beakerHeight - maxLevel * ratio + 4}
              fontSize="10"
              fill="#9ca3af"
            >
              {Math.round(500 * ratio)}
            </text>
          </g>
        ))}

        {/* Labels */}
        <text x={beakerWidth / 2} y={beakerHeight + 30} textAnchor="middle" fontSize="12" fill="#4b5563">
          盐水溶液
        </text>
      </g>

      {/* Component breakdown */}
      <g transform="translate(280, 100)">
        <text x={0} y={0} fontSize="14" fontWeight="bold" fill="#374151">成分分析</text>

        {/* Salt */}
        <g transform="translate(0, 30)">
          <rect x={0} y={0} width={40} height={40} rx={4} fill="#fde68a" stroke="#f59e0b" strokeWidth="2" />
          <text x={20} y={25} textAnchor="middle" fontSize="16">🧂</text>
          <text x={55} y={25} fontSize="13" fill="#92400e">盐: {saltWeight}克</text>
        </g>

        {/* Water */}
        <g transform="translate(0, 80)">
          <rect x={0} y={0} width={40} height={40} rx={4} fill="#93c5fd" stroke="#3b82f6" strokeWidth="2" />
          <text x={20} y={25} textAnchor="middle" fontSize="16">💧</text>
          <text x={55} y={25} fontSize="13" fill="#1e40af">水: {waterWeight}克</text>
        </g>

        {/* Total */}
        {stage >= 2 && (
          <g transform="translate(0, 130)" style={{ opacity: stage >= 2 ? 1 : 0, transition: "opacity 0.5s" }}>
            <rect x={0} y={0} width={150} height={40} rx={4} fill="#f3f4f6" stroke="#6b7280" strokeWidth="2" />
            <text x={75} y={25} textAnchor="middle" fontSize="13" fill="#374151">
              总重 = {saltWeight} + {waterWeight} = {totalWeight}克
            </text>
          </g>
        )}
      </g>

      {/* Formula */}
      {stage >= 3 && (
        <g transform="translate(280, 280)" style={{ opacity: stage >= 3 ? 1 : 0, transition: "opacity 0.5s" }}>
          <rect x={0} y={0} width={320} height={60} rx={8} fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
          <text x={20} y={22} fill="#166534" fontSize="13" fontWeight="bold">浓度公式:</text>
          <text x={20} y={45} fill="#166534" fontSize="12">
            浓度 = 盐 ÷ (盐 + 水) × 100% = {saltWeight} ÷ {totalWeight} × 100% = {concentration.toFixed(1)}%
          </text>
        </g>
      )}

      {/* Result */}
      {stage >= 3 && (
        <g transform="translate(280, 355)" style={{ opacity: stage >= 3 ? 1 : 0, transition: "opacity 0.5s" }}>
          <rect x={0} y={0} width={320} height={50} rx={8} fill="#eff6ff" stroke="#3b82f6" strokeWidth="2" />
          <text x={160} y={32} textAnchor="middle" fill="#1e40af" fontSize="16" fontWeight="bold">
            这杯盐水的浓度是 {concentration.toFixed(1)}%
          </text>
        </g>
      )}

      {/* Visual percentage circle */}
      {stage >= 3 && (
        <g transform="translate(80, 350)">
          <circle cx={30} cy={30} r={28} fill="#f3f4f6" stroke="#e5e7eb" strokeWidth="2" />
          <path
            d={`M30,30 L30,2 A28,28 0 ${concentration > 50 ? 1 : 0},1 ${30 + 28 * Math.sin(concentration / 100 * 2 * Math.PI)},${30 - 28 * Math.cos(concentration / 100 * 2 * Math.PI)} Z`}
            fill="#3b82f6"
            opacity="0.7"
          />
          <text x={30} y={35} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#1e40af">
            {concentration.toFixed(0)}%
          </text>
        </g>
      )}
    </svg>
  )
}
