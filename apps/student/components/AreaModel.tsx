"use client"
import { useEffect, useState } from "react"

type Props = { a: number; b: number; stage?: number }

export function AreaModel({ a, b, stage = 0 }: Props) {
  const width = 640
  const height = 320
  const cellSize = 30
  const startX = 60
  const startY = 60

  const [visibleCells, setVisibleCells] = useState(0)
  const totalCells = a * b

  useEffect(() => {
    if (stage === 0) {
      setVisibleCells(totalCells)
    } else if (stage === 1) {
      // Animate cells appearing one by one
      setVisibleCells(0)
      let count = 0
      const interval = setInterval(() => {
        count += 1
        setVisibleCells(count)
        if (count >= totalCells) clearInterval(interval)
      }, 50) // Fast fill
      return () => clearInterval(interval)
    } else if (stage >= 2) {
      setVisibleCells(totalCells)
    }
  }, [stage, totalCells])

  return (
    <svg width={width} height={height} className="svg-panel">
      <defs>
        <pattern id="grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
          <rect width={cellSize} height={cellSize} fill="none" stroke="#bfdbfe" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Summary Header */}
      <g>
        <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">面积演示</text>
        <text x={24} y={56} fontSize="14" fill="#6b7280">长 = {a}</text>
        <text x={100} y={56} fontSize="14" fill="#6b7280">宽 = {b}</text>
        {stage >= 2 && (
          <text x={200} y={56} fontSize="16" fontWeight="bold" fill="#2563eb">
            面积 = {a} × {b} = {totalCells}
          </text>
        )}
      </g>

      <g transform={`translate(${startX}, ${startY})`}>
        {/* Background Grid Outline */}
        <rect
          x={0}
          y={0}
          width={a * cellSize}
          height={b * cellSize}
          fill="#f0f9ff"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Animated Cells */}
        <g>
          {Array.from({ length: totalCells }).map((_, i) => {
            const row = Math.floor(i / a)
            const col = i % a
            const isVisible = i < visibleCells

            return (
              <rect
                key={i}
                x={col * cellSize}
                y={row * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#60a5fa"
                stroke="#fff"
                strokeWidth="1"
                style={{
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "scale(1)" : "scale(0.8)",
                  transformOrigin: `${col * cellSize + cellSize / 2}px ${row * cellSize + cellSize / 2}px`,
                  transition: "all 0.2s ease"
                }}
              />
            )
          })}
        </g>

        {/* Labels */}
        {/* Length Label */}
        <g>
          <line x1={0} y1={-10} x2={a * cellSize} y2={-10} stroke="#374151" strokeWidth="1" />
          <line x1={0} y1={-15} x2={0} y2={-5} stroke="#374151" strokeWidth="1" />
          <line x1={a * cellSize} y1={-15} x2={a * cellSize} y2={-5} stroke="#374151" strokeWidth="1" />
          <text x={(a * cellSize) / 2} y={-20} textAnchor="middle" fill="#374151" fontSize="14">长 {a}</text>
        </g>

        {/* Width Label */}
        <g>
          <line x1={-10} y1={0} x2={-10} y2={b * cellSize} stroke="#374151" strokeWidth="1" />
          <line x1={-15} y1={0} x2={-5} y2={0} stroke="#374151" strokeWidth="1" />
          <line x1={-15} y1={b * cellSize} x2={-5} y2={b * cellSize} stroke="#374151" strokeWidth="1" />
          <text x={-25} y={(b * cellSize) / 2} textAnchor="middle" fill="#374151" fontSize="14" transform={`rotate(-90, -25, ${(b * cellSize) / 2})`}>宽 {b}</text>
        </g>

        {/* Cell Count Overlay (Optional, maybe only for small numbers) */}
        {totalCells <= 50 && visibleCells === totalCells && (
          Array.from({ length: totalCells }).map((_, i) => {
            const row = Math.floor(i / a)
            const col = i % a
            return (
              <text
                key={`t-${i}`}
                x={col * cellSize + cellSize / 2}
                y={row * cellSize + cellSize / 2 + 5}
                textAnchor="middle"
                fill="#fff"
                fontSize="10"
                pointerEvents="none"
              >
                {i + 1}
              </text>
            )
          })
        )}
      </g>
    </svg>
  )
}