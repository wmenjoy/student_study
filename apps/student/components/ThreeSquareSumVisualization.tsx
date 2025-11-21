"use client"
import { useEffect, useState } from "react"

type Props = { a: number; b: number; c: number; stage: number }

export function ThreeSquareSumVisualization({ a, b, c, stage }: Props) {
  const cellSize = 18
  const padding = 30
  const gap = 40
  
  const maxDimension = Math.max(a, b, c)
  const svgWidth = padding * 2 + (a + b + c) * cellSize + gap * 2
  const svgHeight = padding * 2 + maxDimension * cellSize + 100

  const [visibleCellsA, setVisibleCellsA] = useState(0)
  const [visibleCellsB, setVisibleCellsB] = useState(0)
  const [visibleCellsC, setVisibleCellsC] = useState(0)
  const [showFormula, setShowFormula] = useState(false)

  const totalCellsA = a * a
  const totalCellsB = b * b
  const totalCellsC = c * c

  useEffect(() => {
    if (stage === 0) {
      setVisibleCellsA(0)
      setVisibleCellsB(0)
      setVisibleCellsC(0)
      setShowFormula(false)
    } else if (stage === 1) {
      // Animate all three squares
      setVisibleCellsA(0)
      setVisibleCellsB(0)
      setVisibleCellsC(0)
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
                // Start third square
                setTimeout(() => {
                  let countC = 0
                  const intervalC = setInterval(() => {
                    countC += 1
                    setVisibleCellsC(countC)
                    if (countC >= totalCellsC) {
                      clearInterval(intervalC)
                    }
                  }, 30)
                  return () => clearInterval(intervalC)
                }, 300)
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
      setVisibleCellsC(totalCellsC)
      setShowFormula(false)
    } else if (stage >= 3) {
      setVisibleCellsA(totalCellsA)
      setVisibleCellsB(totalCellsB)
      setVisibleCellsC(totalCellsC)
      setShowFormula(true)
    }
  }, [stage, totalCellsA, totalCellsB, totalCellsC])

  // Check if it's a Pythagorean triple
  const isPythagorean = (a * a + b * b === c * c) || (a * a + c * c === b * b) || (b * b + c * c === a * a)

  return (
    <svg width={svgWidth} height={svgHeight} className="svg-panel">
      <defs>
        <pattern id="grid" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
          <rect width={cellSize} height={cellSize} fill="none" stroke="#e5e7eb" strokeWidth="1" />
        </pattern>
      </defs>

      {/* Title */}
      <text x={svgWidth / 2} y={25} textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1f2937">
        三个数平方和几何演示
      </text>

      {/* First Square */}
      <g transform={`translate(${padding}, padding + 40)`}>
        <text x={a * cellSize / 2} y={-10} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#7c3aed">
          正方形 A (边长 = {a})
        </text>
        
        {/* Background grid */}
        <rect
          x={0}
          y={0}
          width={a * cellSize}
          height={a * cellSize}
          fill="url(#grid)"
          stroke="#7c3aed"
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
              fill="#7c3aed"
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
        <text x={b * cellSize / 2} y={-10} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0891b2">
          正方形 B (边长 = {b})
        </text>
        
        {/* Background grid */}
        <rect
          x={0}
          y={0}
          width={b * cellSize}
          height={b * cellSize}
          fill="url(#grid)"
          stroke="#0891b2"
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
              fill="#0891b2"
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

      {/* Third Square */}
      <g transform={`translate(${padding + a * cellSize + b * cellSize + gap * 2}, padding + 40)`}>
        <text x={c * cellSize / 2} y={-10} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#dc2626">
          正方形 C (边长 = {c})
        </text>
        
        {/* Background grid */}
        <rect
          x={0}
          y={0}
          width={c * cellSize}
          height={c * cellSize}
          fill="url(#grid)"
          stroke={isPythagorean ? "#f59e0b" : "#dc2626"}
          strokeWidth="2"
        />

        {/* Animated cells */}
        {Array.from({ length: totalCellsC }).map((_, i) => {
          const row = Math.floor(i / c)
          const col = i % c
          const isVisible = i < visibleCellsC

          return (
            <rect
              key={`c-${i}`}
              x={col * cellSize}
              y={row * cellSize}
              width={cellSize}
              height={cellSize}
              fill={isPythagorean ? "#f59e0b" : "#dc2626"}
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
          <text x={c * cellSize / 2} y={c * cellSize + 20} textAnchor="middle" fontSize="16" fill="#1f2937">
            面积 = {c}² = {c * c}
            {isPythagorean && " ⭐"}
          </text>
        )}
      </g>

      {/* Plus signs */}
      {stage >= 3 && (
        <>
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
          <text 
            x={padding + a * cellSize + b * cellSize + gap * 1.5} 
            y={padding + 40 + maxDimension * cellSize / 2} 
            textAnchor="middle" 
            fontSize="24" 
            fontWeight="bold" 
            fill="#1f2937"
          >
            +
          </text>
        </>
      )}

      {/* Formula Display */}
      {showFormula && (
        <g transform={`translate(${svgWidth / 2}, padding + maxDimension * cellSize + 80)`}>
          <rect
            x={-200}
            y={-35}
            width={400}
            height={70}
            fill="#fef3c7"
            stroke="#f59e0b"
            strokeWidth="2"
            rx="8"
          />
          <text x={0} y={-5} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1f2937">
            {a}² + {b}² + {c}² = {a * a} + {b * b} + {c * c} = {a * a + b * b + c * c}
          </text>
          {isPythagorean && (
            <text x={0} y={20} textAnchor="middle" fontSize="14" fill="#f59e0b" fontWeight="bold">
              ⭐ 勾股定理特例：可构成直角三角形！
            </text>
          )}
        </g>
      )}

      {/* Legend */}
      <g transform={`translate(${padding}, ${svgHeight - 30})`}>
        <rect x={0} y={0} width={12} height={12} fill="#7c3aed" />
        <text x={18} y={10} fontSize="12" fill="#6b7280">正方形 A</text>
        
        <rect x={100} y={0} width={12} height={12} fill="#0891b2" />
        <text x={118} y={10} fontSize="12" fill="#6b7280">正方形 B</text>
        
        <rect x={200} y={0} width={12} height={12} fill={isPythagorean ? "#f59e0b" : "#dc2626"} />
        <text x={218} y={10} fontSize="12" fill="#6b7280">
          正方形 C {isPythagorean && "(勾股)"}
        </text>
      </g>
    </svg>
  )
}