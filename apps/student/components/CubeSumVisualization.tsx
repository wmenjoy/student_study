"use client"
import { useEffect, useState } from "react"

type Props = { a: number; b: number; stage: number }

export function CubeSumVisualization({ a, b, stage }: Props) {
  const cellSize = 15
  const padding = 40
  const gap = 100
  
  const maxDimension = Math.max(a, b)
  const svgWidth = padding * 2 + (a + b) * cellSize + gap
  const svgHeight = padding * 2 + maxDimension * cellSize * 2 + 120

  const [visibleCubesA, setVisibleCubesA] = useState(0)
  const [visibleCubesB, setVisibleCubesB] = useState(0)
  const [showFormula, setShowFormula] = useState(false)

  const totalCubesA = a * a * a
  const totalCubesB = b * b * b

  // Generate 3D cube coordinates
  const generateCubeCoords = (size: number) => {
    const coords = []
    for (let z = 0; z < size; z++) {
      for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
          coords.push({ x, y, z })
        }
      }
    }
    return coords
  }

  const coordsA = generateCubeCoords(a)
  const coordsB = generateCubeCoords(b)

  // Convert 3D coordinates to 2D isometric projection
  const toIsometric = (x: number, y: number, z: number, offsetX: number, offsetY: number) => {
    const isoX = (x - z) * cellSize * 0.866 + offsetX
    const isoY = (x + z) * cellSize * 0.5 - y * cellSize + offsetY
    return { x: isoX, y: isoY }
  }

  useEffect(() => {
    if (stage === 0) {
      setVisibleCubesA(0)
      setVisibleCubesB(0)
      setShowFormula(false)
    } else if (stage === 1) {
      // Animate first cube
      setVisibleCubesA(0)
      setVisibleCubesB(0)
      setShowFormula(false)
      let count = 0
      const interval = setInterval(() => {
        count += 1
        setVisibleCubesA(count)
        if (count >= totalCubesA) {
          clearInterval(interval)
          // Start second cube after first completes
          setTimeout(() => {
            let countB = 0
            const intervalB = setInterval(() => {
              countB += 1
              setVisibleCubesB(countB)
              if (countB >= totalCubesB) {
                clearInterval(intervalB)
              }
            }, 30)
            return () => clearInterval(intervalB)
          }, 500)
        }
      }, 20)
      return () => clearInterval(interval)
    } else if (stage === 2) {
      setVisibleCubesA(totalCubesA)
      setVisibleCubesB(totalCubesB)
      setShowFormula(false)
    } else if (stage >= 3) {
      setVisibleCubesA(totalCubesA)
      setVisibleCubesB(totalCubesB)
      setShowFormula(true)
    }
  }, [stage, totalCubesA, totalCubesB])

  const drawCube = (coord: { x: number; y: number; z: number }, offsetX: number, offsetY: number, color: string, isVisible: boolean) => {
    const { x, y } = toIsometric(coord.x, coord.y, coord.z, offsetX, offsetY)
    
    // Calculate visible faces based on position
    const showTop = coord.z === 0
    const showFront = coord.y === 0
    const showRight = coord.x === 0

    return (
      <g key={`${coord.x}-${coord.y}-${coord.z}`} style={{ opacity: isVisible ? 1 : 0 }}>
        {/* Top face */}
        {showTop && (
          <path
            d={`M ${x} ${y} L ${x + cellSize * 0.866} ${y - cellSize * 0.5} L ${x} ${y - cellSize} L ${x - cellSize * 0.866} ${y - cellSize * 0.5} Z`}
            fill={color}
            stroke="#fff"
            strokeWidth="1"
            style={{ transition: "all 0.3s ease" }}
          />
        )}
        {/* Front face */}
        {showFront && (
          <path
            d={`M ${x - cellSize * 0.866} ${y - cellSize * 0.5} L ${x} ${y - cellSize} L ${x} ${y} L ${x - cellSize * 0.866} ${y - cellSize * 0.5 + cellSize} Z`}
            fill={color}
            stroke="#fff"
            strokeWidth="1"
            opacity="0.8"
            style={{ transition: "all 0.3s ease" }}
          />
        )}
        {/* Right face */}
        {showRight && (
          <path
            d={`M ${x} ${y - cellSize} L ${x + cellSize * 0.866} ${y - cellSize * 0.5} L ${x + cellSize * 0.866} ${y - cellSize * 0.5 + cellSize} L ${x} ${y} Z`}
            fill={color}
            stroke="#fff"
            strokeWidth="1"
            opacity="0.6"
            style={{ transition: "all 0.3s ease" }}
          />
        )}
      </g>
    )
  }

  return (
    <svg width={svgWidth} height={svgHeight} className="svg-panel">
      {/* Title */}
      <text x={svgWidth / 2} y={25} textAnchor="middle" fontSize="20" fontWeight="bold" fill="#1f2937">
        立方和3D演示
      </text>

      {/* First Cube */}
      <g transform={`translate(${padding}, ${padding + 40})`}>
        <text x={a * cellSize * 0.866 / 2} y={-10} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#7c3aed">
          立方体 A (边长 = {a})
        </text>
        
        {/* Draw all cubes */}
        {coordsA.map((coord, i) => 
          drawCube(coord, 50, 50, "#7c3aed", i < visibleCubesA)
        )}

        {/* Volume label */}
        {stage >= 2 && (
          <text x={50} y={a * cellSize * 1.5 + 80} textAnchor="middle" fontSize="16" fill="#1f2937">
            体积 = {a}³ = {a * a * a}
          </text>
        )}
      </g>

      {/* Second Cube */}
      <g transform={`translate(${padding + a * cellSize * 1.5 + gap}, ${padding + 40})`}>
        <text x={b * cellSize * 0.866 / 2} y={-10} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0891b2">
          立方体 B (边长 = {b})
        </text>
        
        {/* Draw all cubes */}
        {coordsB.map((coord, i) => 
          drawCube(coord, 50, 50, "#0891b2", i < visibleCubesB)
        )}

        {/* Volume label */}
        {stage >= 2 && (
          <text x={50} y={b * cellSize * 1.5 + 80} textAnchor="middle" fontSize="16" fill="#1f2937">
            体积 = {b}³ = {b * b * b}
          </text>
        )}
      </g>

      {/* Formula Display */}
      {showFormula && (
        <g transform={`translate(${svgWidth / 2}, padding + maxDimension * cellSize * 2 + 80)`}>
          <rect
            x={-180}
            y={-25}
            width={360}
            height={50}
            fill="#fce7f3"
            stroke="#ec4899"
            strokeWidth="2"
            rx="8"
          />
          <text x={0} y={0} textAnchor="middle" fontSize="18" fontWeight="bold" fill="#1f2937">
            {a}³ + {b}³ = {a * a * a} + {b * b * b} = {a * a * a + b * b * b}
          </text>
          <text x={0} y={20} textAnchor="middle" fontSize="14" fill="#1f2937">
            = ({a}+{b})({a}²-{a}{b}+{b}²)
          </text>
        </g>
      )}

      {/* Plus sign between cubes */}
      {stage >= 3 && (
        <text 
          x={padding + a * cellSize * 1.5 + gap / 2} 
          y={padding + 40 + maxDimension * cellSize * 0.75} 
          textAnchor="middle" 
          fontSize="24" 
          fontWeight="bold" 
          fill="#1f2937"
        >
          +
        </text>
      )}

      {/* Legend */}
      <g transform={`translate(${padding}, ${svgHeight - 30})`}>
        <rect x={0} y={0} width={12} height={12} fill="#7c3aed" />
        <text x={18} y={10} fontSize="12" fill="#6b7280">立方体 A</text>
        
        <rect x={100} y={0} width={12} height={12} fill="#0891b2" />
        <text x={118} y={10} fontSize="12" fill="#6b7280">立方体 B</text>
      </g>
    </svg>
  )
}