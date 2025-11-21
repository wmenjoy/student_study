"use client"
import { useEffect, useState } from "react"

type Props = { a: number; b: number; stage: number }

export function SquareSumVisualization({ a, b, stage }: Props) {
  const cellSize = 25
  const padding = 40
  const gap = 60
  
  const maxDimension = Math.max(a, b)
  const svgWidth = padding * 2 + (a + b) * cellSize + gap
  const svgHeight = padding * 2 + maxDimension * cellSize + 80

  const [visibleCellsA, setVisibleCellsA] = useState(0)
  const [visibleCellsB, setVisibleCellsB] = useState(0)
  const [showFormula, setShowFormula] = useState(false)

  const totalCellsA = a * a
  const totalCellsB = b * b

  useEffect(() => {
    if (stage === 0) {
      setVisibleCellsA(0)
      setVisibleCellsB(0)
      setShowFormula(false)
    } else if (stage === 1) {
      // Animate first square
      setVisibleCellsA(0)
      setVisibleCellsB(0)
      setShowFormula(false)
      let count = 0
      const interval = setInterval(() => {
        count += 1
        setVisibleCellsA(count)
        if (count >= totalCellsA) {
          clearInterval(interval)
          // Start second square after first completes
          setTimeout(() => {
            let countB = 0
            const intervalB = setInterval(() => {
              countB += 1
              setVisibleCellsB(countB)
              if (countB >= totalCellsB) {
                clearInterval(intervalB)
              }
            }, 50)
            return () => clearInterval(intervalB)
          }, 300)
        }
      }, 50)
      return () => clearInterval(interval)
    } else if (stage === 2) {
      setVisibleCellsA(totalCellsA)
      setVisibleCellsB(totalCellsB)
      setShowFormula(false)
    } else if (stage >= 3) {
      setVisibleCellsA(totalCellsA)
      setVisibleCellsB(totalCellsB)
      setShowFormula(true)
    }
  }, [stage, totalCellsA, totalCellsB])

  return (
    <svg width={svgWidth} height={svgHeight} className="svg-panel">
      <defs>
        <pattern id="grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
          <rect width={cellSize} height={cellSize} fill="none" stroke="#e5e7eb" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Title */}
      <text x={svgWidth / 2} y={25} textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1f2937">
        平方和几何演示
      </text>

      {/* First Square */}
      <g transform={`translate(${padding}, padding + 40)`}>
        <text x={a * cellSize / 2} y={-10} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#3b82f6">
          正方形 A (边长 = {a})
        </text>
        
        {/* Background grid */}
        <rect
          x={0}
          y={0}
          width={a * cellSize}
          height={a * cellSize}
          fill="url(#grid)"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Animated cells */}
        {Array.from({ length: totalCellsA }).map((_, i) => {
          const row = Math.floor(i / a)
          const col = i % a
          const isVisible = i < visibleCellsA

          return (
            <rect
              key={`a-${i}`}
              x={col * cellSize}
              y={row * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#3b82f6"
              stroke="#fff"
              strokeWidth="1"
              style={{
                opacity: isVisible ? 0.8 : 0,
                transform: isVisible ? "scale(1)" : "scale(0.8)",
                transformOrigin: `${col * cellSize + cellSize / 2}px ${row * cellSize + cellSize / 2}px`,
                transition: "all 0.3s ease"
              }}
            />
          )
        })}

        {/* Area label */}
        {stage >= 2 && (
          <text x={a * cellSize / 2} y={a * cellSize + 20} textAnchor="middle" fontSize="16" fill="#1f2937">
            面积 = {a}² = {a * a}
          </text>
        )}
      </g>

      {/* Second Square */}
      <g transform={`translate(${padding + a * cellSize + gap}, padding + 40)`}>
        <text x={b * cellSize / 2} y={-10} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#10b981">
          正方形 B (边长 = {b})
        </text>
        
        {/* Background grid */}
        <rect
          x={0}
          y={0}
          width={b * cellSize}
          height={b * cellSize}
          fill="url(#grid)"
          stroke="#10b981"
          strokeWidth="2"
        />

        {/* Animated cells */}
        {Array.from({ length: totalCellsB }).map((_, i) => {
          const row = Math.floor(i / b)
          const col = i % b
          const isVisible = i < visibleCellsB

          return (
            <rect
              key={`b-${i}`}
              x={col * cellSize}
              y={row * cellSize}
              width={cellSize}
              height={cellSize}
              fill="#10b981"
              stroke="#fff"
              strokeWidth="1"
              style={{
                opacity: isVisible ? 0.8 : 0,
                transform: isVisible ? "scale(1)" : "scale(0.8)",
                transformOrigin: `${col * cellSize + cellSize / 2}px ${row * cellSize + cellSize / 2}px`,
                transition: "all 0.3s ease"
              }}
            />
          )
        })}

        {/* Area label */}
        {stage >= 2 && (
          <text x={b * cellSize / 2} y={b * cellSize + 20} textAnchor="middle" fontSize="16" fill="#1f2937">
            面积 = {b}² = {b * b}
          </text>
        )}
      </g>

      {/* Formula Display */}
      {showFormula && (
        <g transform={`translate(${svgWidth / 2}, padding + maxDimension * cellSize + 80)`}>
          <rect
            x={-150}
            y={-25}
            width={300}
            height={50}
            fill="#fef3c7"
            stroke="#f59e0b"
            strokeWidth="2"
            rx="8"
          />
          <text x={0} y={5} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1f2937">
            {a}² + {b}² = {a * a} + {b * b} = {a * a + b * b}
          </text>
        </g>
      )}

      {/* Plus sign between squares */}
      {stage >= 3 && (
        <text 
          x={padding + a * cellSize + gap / 2} 
          y={padding + 40 + maxDimension * cellSize / 2} 
          textAnchor="middle" 
          fontSize="24" 
          fontWeight="bold" 
          fill="#1f2937"
        >
          +
        </text>
      )}
    </svg>
  )
}