"use client"
import { useEffect, useState } from "react"

type Props = {
  bucketWeight: number
  oilWeight: number
  stage?: number
}

export function ContainerViz({ bucketWeight, oilWeight, stage = 0 }: Props) {
  const width = 640
  const height = 450

  const fullWeight = bucketWeight + oilWeight
  const halfWeight = bucketWeight + oilWeight / 2

  const [animLevel, setAnimLevel] = useState(1)

  useEffect(() => {
    if (stage === 0) {
      setAnimLevel(1)
    } else if (stage === 1) {
      setAnimLevel(0.5)
    } else if (stage >= 2) {
      setAnimLevel(0.5)
    }
  }, [stage])

  const bucketH = 150
  const bucketW = 100
  const maxOilH = 120

  return (
    <svg width={width} height={height} className="svg-panel">
      <defs>
        <linearGradient id="oil-grad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <pattern id="bucket-metal" width="4" height="4" patternUnits="userSpaceOnUse">
          <rect width="4" height="4" fill="#9ca3af" />
          <path d="M0,0 L4,4 M4,0 L0,4" stroke="#6b7280" strokeWidth="0.5" />
        </pattern>
      </defs>

      {/* Title */}
      <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">油桶称重问题图解</text>

      {/* Initial state - Full bucket */}
      <g transform="translate(100, 80)">
        <text x={bucketW / 2} y={-10} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#374151">
          {stage === 0 ? "初始状态" : "满桶"}
        </text>

        {/* Bucket */}
        <rect
          x={0}
          y={bucketH - 10}
          width={bucketW}
          height={15}
          fill="url(#bucket-metal)"
          stroke="#4b5563"
          strokeWidth="2"
        />
        <path
          d={`M10,${bucketH - 10} L0,${bucketH} L0,${bucketH + 15} L${bucketW},${bucketH + 15} L${bucketW},${bucketH} L${bucketW - 10},${bucketH - 10}`}
          fill="#d1d5db"
          stroke="#4b5563"
          strokeWidth="2"
        />

        {/* Oil - full */}
        {stage === 0 && (
          <rect
            x={5}
            y={bucketH - maxOilH}
            width={bucketW - 10}
            height={maxOilH}
            fill="url(#oil-grad)"
            opacity="0.9"
          />
        )}

        {/* Scale display */}
        <g transform={`translate(${bucketW + 30}, ${bucketH / 2})`}>
          <rect x={0} y={0} width={80} height={60} rx={8} fill="#f3f4f6" stroke="#6b7280" strokeWidth="2" />
          <text x={40} y={25} textAnchor="middle" fontSize="12" fill="#6b7280">重量</text>
          <text x={40} y={45} textAnchor="middle" fontSize="20" fontWeight="bold" fill="#dc2626">
            {fullWeight}kg
          </text>
        </g>

        {/* Labels */}
        {stage >= 2 && (
          <g>
            <text x={bucketW / 2} y={bucketH + 40} textAnchor="middle" fontSize="11" fill="#6b7280">
              桶重: {bucketWeight}kg
            </text>
            <text x={bucketW / 2} y={bucketH + 55} textAnchor="middle" fontSize="11" fill="#f59e0b">
              油重: {oilWeight}kg
            </text>
          </g>
        )}
      </g>

      {/* After using half - Half bucket */}
      {stage >= 1 && (
        <g transform="translate(350, 80)">
          <text x={bucketW / 2} y={-10} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#374151">
            用去一半后
          </text>

          {/* Bucket */}
          <rect
            x={0}
            y={bucketH - 10}
            width={bucketW}
            height={15}
            fill="url(#bucket-metal)"
            stroke="#4b5563"
            strokeWidth="2"
          />
          <path
            d={`M10,${bucketH - 10} L0,${bucketH} L0,${bucketH + 15} L${bucketW},${bucketH + 15} L${bucketW},${bucketH} L${bucketW - 10},${bucketH - 10}`}
            fill="#d1d5db"
            stroke="#4b5563"
            strokeWidth="2"
          />

          {/* Oil - half */}
          <rect
            x={5}
            y={bucketH - maxOilH / 2}
            width={bucketW - 10}
            height={maxOilH / 2}
            fill="url(#oil-grad)"
            opacity="0.9"
          />

          {/* Dotted line showing original level */}
          <line
            x1={0}
            y1={bucketH - maxOilH}
            x2={bucketW}
            y2={bucketH - maxOilH}
            stroke="#f59e0b"
            strokeWidth="1"
            strokeDasharray="4 2"
            opacity="0.5"
          />

          {/* Scale display */}
          <g transform={`translate(${bucketW + 30}, ${bucketH / 2})`}>
            <rect x={0} y={0} width={80} height={60} rx={8} fill="#f3f4f6" stroke="#6b7280" strokeWidth="2" />
            <text x={40} y={25} textAnchor="middle" fontSize="12" fill="#6b7280">重量</text>
            <text x={40} y={45} textAnchor="middle" fontSize="20" fontWeight="bold" fill="#dc2626">
              {halfWeight}kg
            </text>
          </g>

          {/* Labels */}
          {stage >= 2 && (
            <g>
              <text x={bucketW / 2} y={bucketH + 40} textAnchor="middle" fontSize="11" fill="#6b7280">
                桶重: {bucketWeight}kg
              </text>
              <text x={bucketW / 2} y={bucketH + 55} textAnchor="middle" fontSize="11" fill="#f59e0b">
                油重: {oilWeight / 2}kg
              </text>
            </g>
          )}
        </g>
      )}

      {/* Explanation */}
      {stage >= 2 && (
        <g transform="translate(40, 280)">
          <rect x={0} y={0} width={560} height={70} rx={8} fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
          <text x={20} y={25} fill="#92400e" fontSize="13" fontWeight="bold">关键发现:</text>
          <text x={20} y={50} fill="#92400e" fontSize="12">
            两次称重的重量差 = 半桶油的重量 → {fullWeight} - {halfWeight} = {oilWeight / 2}千克（半桶油）
          </text>
        </g>
      )}

      {/* Solution */}
      {stage >= 3 && (
        <g transform="translate(40, 365)">
          <rect x={0} y={0} width={560} height={70} rx={8} fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
          <text x={20} y={25} fill="#166534" fontSize="13" fontWeight="bold">计算过程:</text>
          <text x={20} y={50} fill="#166534" fontSize="12">
            半桶油 = {oilWeight / 2}kg → 全桶油 = {oilWeight}kg → 桶重 = {fullWeight} - {oilWeight} = {bucketWeight}kg
          </text>
        </g>
      )}
    </svg>
  )
}
