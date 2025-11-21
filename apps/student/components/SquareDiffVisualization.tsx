"use client"
import { useEffect, useState } from "react"

type Props = { a: number; b: number; stage: number }

export function SquareDiffVisualization({ a, b, stage }: Props) {
  const cellSize = 20
  const padding = 40
  const gap = 80
  
  const svgWidth = padding * 2 + a * cellSize + b * cellSize + gap
  const svgHeight = padding * 2 + a * cellSize + 100

  const [visibleCellsA, setVisibleCellsA] = useState(0)
  const [visibleCellsB, setVisibleCellsB] = useState(0)
  const [showDiff, setShowDiff] = useState(false)
  const [showFormula, setShowFormula] = useState(false)

  const totalCellsA = a * a
  const totalCellsB = b * b

  useEffect(() => {
    if (stage === 0) {
      setVisibleCellsA(0)
      setVisibleCellsB(0)
      setShowDiff(false)
      setShowFormula(false)
    } else if (stage === 1) {
      // Animate both squares
      setVisibleCellsA(0)
      setVisibleCellsB(0)
      setShowDiff(false)
      setShowFormula(false)
      
      let count = 0
      const interval = setInterval(() => {
        count += 1
        setVisibleCellsA(count)
        if (count >= totalCellsA) {
          clearInterval(interval)
          // Start second square
          setTimeout(() => {
            let countB = 0
            const intervalB = setInterval(() => {
              countB += 1
              setVisibleCellsB(countB)
              if (countB >= totalCellsB) {
                clearInterval(intervalB)
              }
            }, 30)
            return () => clearInterval(intervalB)
          }, 300)
        }
      }, 20)
      return () => clearInterval(interval)
    } else if (stage === 2) {
      setVisibleCellsA(totalCellsA)
      setVisibleCellsB(totalCellsB)
      setShowDiff(false)
      setShowFormula(false)
    } else if (stage >= 3) {
      setVisibleCellsA(totalCellsA)
      setVisibleCellsB(totalCellsB)
      setShowDiff(true)
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
        平方差几何演示
      </text>

      {/* Large Square */}
      <g transform={`translate(${padding}, padding + 40)`}>
        <text x={a * cellSize / 2} y={-10} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#dc2626">
          大正方形 (边长 = {a})
        </text>
        
        {/* Background grid */}
        <rect
          x={0}
          y={0}
          width={a * cellSize}
          height={a * cellSize}
          fill="url(#grid)"
          stroke="#dc2626"
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
              fill="#dc2626"
              stroke="#fff"
              strokeWidth="1"
              style={{
                opacity: isVisible ? 0.3 : 0,
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

      {/* Minus sign */}
      {stage >= 3 && (
        <text 
          x={padding + a * cellSize + gap / 2} 
          y={padding + 40 + a * cellSize / 2} 
          textAnchor="middle" 
          fontSize="24" 
          fontWeight="bold" 
          fill="#1f2937"
        >
          −
        </text>
      )}

      {/* Small Square */}
      <g transform={`translate(${padding + a * cellSize + gap}, padding + 40 + (a - b) * cellSize / 2)`}>
        <text x={b * cellSize / 2} y={-10} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#2563eb">
          小正方形 (边长 = {b})
        </text>
        
        {/* Background grid */}
        <rect
          x={0}
          y={0}
          width={b * cellSize}
          height={b * cellSize}
          fill="url(#grid)"
          stroke="#2563eb"
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
              fill="#2563eb"
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

      {/* Difference visualization */}
      {showDiff && (
        <g transform={`translate(${padding}, padding + a * cellSize + 80)`}>
          <rect
            x={-20}
            y={-25}
            width={320}
            height={50}
            fill="#dcfce7"
            stroke="#16a34a"
            strokeWidth="2"
            rx="8"
          />
          <text x={10} y={0} fontSize="16" fontWeight="bold" fill="#1f2937">
            面积差 = {a}² - {b}² = {a * a} - {b * b} = {a * a - b * b}
          </text>
          <text x={10} y={20} fontSize="14" fill="#1f2937">
            因式分解 = ({a}+{b})({a}-{b}) = {a + b} × {a - b} = {(a + b) * (a - b)}
          </text>
        </g>
      )}

      {/* Visual representation of remaining cells */}
      {showDiff && (
        <g transform={`translate(${padding}, padding + 40)}`}>
          {Array.from({ length: totalCellsA }).map((_, i) => {
            const row = Math.floor(i / a)
            const col = i % a
            
            // Check if this cell is in the small square area
            const inSmallSquare = row >= (a - b) / 2 && row < (a + b) / 2 && 
                                 col >= (a - b) / 2 && col < (a + b) / 2
            const smallSquareIndex = inSmallSquare ? 
              (row - Math.floor((a - b) / 2)) * b + (col - Math.floor((a - b) / 2)) : -1
            const isRemoved = inSmallSquare && smallSquareIndex < totalCellsB

            if (isRemoved) return null

            return (
              <rect
                key={`diff-${i}`}
                x={col * cellSize}
                y={row * cellSize}
                width={cellSize}
                height={cellSize}
                fill="#16a34a"
                stroke="#fff"
                strokeWidth="1"
                style={{
                  opacity: 0.6,
                }}
              />
            )
          })}
        </g>
      )}
    </svg>
  )
}