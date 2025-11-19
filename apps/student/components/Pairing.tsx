"use client"
import { useEffect, useState } from "react"

type Props = {
  a: number
  b: number
  stage?: number
  mode?: "connection" | "grid"
}

export function Pairing({ a, b, stage = 0, mode = "connection" }: Props) {
  const total = a * b
  const width = 640
  const height = 400

  // Determine view mode
  // If explicit mode is grid, use grid.
  // If explicit mode is connection, use connection.
  // (We removed the auto-switch logic to respect the user's choice, 
  //  but the parent component can implement auto-switching if needed)
  const useGrid = mode === "grid"

  // Animation State
  const [visibleCells, setVisibleCells] = useState(0)
  const [showFormula, setShowFormula] = useState(0)

  useEffect(() => {
    if (stage === 0) {
      setVisibleCells(0)
      setShowFormula(0)
    } else if (stage === 1) {
      // Manual stepping: Reset to 0 if entering stage 1, but don't auto-animate
      // We only reset if it was previously full (from stage 2) or empty (from stage 0)
      // Actually, let's just ensure it starts at 0 if we just arrived.
      // But we need to distinguish "just arrived" vs "already counting".
      // For simplicity, if we go back to 0, we reset. If we go to 2, we fill.
      // In stage 1, we rely on user interaction.
      // If we just entered stage 1, reset visibleCells to 0.
      // This check prevents resetting if the user is already interacting in stage 1.
      if (visibleCells !== 0 && visibleCells !== total) {
        // Do nothing, user is interacting
      } else {
        setVisibleCells(0)
      }
      setShowFormula(0)
    } else if (stage >= 2) {
      setVisibleCells(total)
      setShowFormula(1)
    }
  }, [stage, total])

  // Reset when a or b changes
  useEffect(() => {
    setVisibleCells(0)
    setShowFormula(0)
  }, [a, b])

  const handleClick = () => {
    if (stage === 1 && visibleCells < total) {
      setVisibleCells(prev => prev + 1)
    }
  }

  // Logic for "Connection" View
  const currentA = Math.floor(visibleCells / b) // Current item A being processed
  // We want to show lines up to visibleCells.
  // The lines are generated in order: 0-0, 0-1, ... 0-(b-1), 1-0...
  // So visibleCells directly maps to the slice of lines.
  const allLines = Array.from({ length: a * b }, (_, i) => `${Math.floor(i / b)}-${i % b}`)

  // Logic for "Grid" View
  // Same logic, visibleCells determines how many cells are colored.

  const count = visibleCells

  // --- Render: Connection View (Small Numbers) ---
  if (!useGrid) {
    const margin = { top: 100, left: 100, right: 100, bottom: 40 }
    const availH = height - margin.top - margin.bottom

    // Distribute items vertically
    const gapA = availH / Math.max(1, a - 1)
    const gapB = availH / Math.max(1, b - 1)

    // If only 1 item, center it
    const getAy = (i: number) => a === 1 ? margin.top + availH / 2 : margin.top + i * gapA
    const getBy = (i: number) => b === 1 ? margin.top + availH / 2 : margin.top + i * gapB

    return (
      <svg width={width} height={height} className="svg-panel" onClick={handleClick} style={{ cursor: stage === 1 ? "pointer" : "default" }}>
        <defs>
          <marker id="dot" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="8" markerHeight="8">
            <circle cx="5" cy="5" r="5" fill="#3b82f6" />
          </marker>
        </defs>
        <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">搭配连线 (穷举法)</text>
        {stage === 1 && visibleCells < total && (
          <text x={width - 24} y={30} textAnchor="end" fontSize="14" fill="#ef4444" fontWeight="bold">
            👉 点击屏幕连线 ({visibleCells}/{total})
          </text>
        )}

        {/* Lines */}
        <g>
          {allLines.slice(0, visibleCells).map(line => {
            const [ai, bi] = line.split('-').map(Number)
            return (
              <line
                key={line}
                x1={margin.left + 20}
                y1={getAy(ai)}
                x2={width - margin.right - 20}
                y2={getBy(bi)}
                stroke={ai === Math.floor((visibleCells - 1) / b) ? "#3b82f6" : "#e5e7eb"}
                strokeWidth={ai === Math.floor((visibleCells - 1) / b) ? 2 : 1}
                opacity={1}
              />
            )
          })}
        </g>

        {/* Items A (Left) */}
        {Array.from({ length: a }).map((_, i) => (
          <g key={`a-${i}`} transform={`translate(${margin.left}, ${getAy(i)})`}>
            <circle r={18} fill={i === currentA ? "#dbeafe" : "#f3f4f6"} stroke={i === currentA ? "#2563eb" : "#9ca3af"} strokeWidth="2" />
            <text y={5} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#374151">A{i + 1}</text>
            {i === 0 && <text y={-30} textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="bold">物品A</text>}
          </g>
        ))}

        {/* Items B (Right) */}
        {Array.from({ length: b }).map((_, i) => (
          <g key={`b-${i}`} transform={`translate(${width - margin.right}, ${getBy(i)})`}>
            <rect x={-18} y={-18} width={36} height={36} rx={4} fill="#f3f4f6" stroke="#9ca3af" strokeWidth="2" />
            <text y={5} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#374151">B{i + 1}</text>
            {i === 0 && <text y={-30} textAnchor="middle" fontSize="12" fill="#6b7280" fontWeight="bold">物品B</text>}
          </g>
        ))}

        {/* Summary */}
        <text x={width / 2} y={height - 10} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#374151">
          已找到: {count} 种搭配
        </text>
        {stage >= 2 && (
          <text x={width / 2} y={height - 35} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#2563eb">
            总数 = {a} × {b} = {total}
          </text>
        )}
      </svg>
    )
  }

  // --- Render: Grid View (Large Numbers) ---
  const margin = { top: 80, left: 100, right: 40, bottom: 40 }
  const availW = width - margin.left - margin.right
  const availH = height - margin.top - margin.bottom
  const cellW = Math.min(60, availW / b)
  const cellH = Math.min(40, availH / a)

  return (
    <svg width={width} height={height} className="svg-panel">
      <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">搭配网格 (矩阵)</text>

      <g transform={`translate(${margin.left}, ${margin.top})`}>
        {/* Axes Lines */}
        <line x1={0} y1={0} x2={0} y2={a * cellH} stroke="#9ca3af" strokeWidth="2" />
        <line x1={0} y1={0} x2={b * cellW} y2={0} stroke="#9ca3af" strokeWidth="2" />

        {/* Row Labels (A) */}
        {Array.from({ length: a }).map((_, i) => (
          <text key={`row-${i}`} x={-10} y={i * cellH + cellH / 2 + 5} textAnchor="end" fontSize="12" fill="#6b7280">
            A{i + 1}
          </text>
        ))}
        <text x={-40} y={a * cellH / 2} textAnchor="middle" transform={`rotate(-90, -40, ${a * cellH / 2})`} fill="#374151" fontWeight="bold">
          物品 A ({a}种)
        </text>

        {/* Col Labels (B) */}
        {Array.from({ length: b }).map((_, i) => (
          <text key={`col-${i}`} x={i * cellW + cellW / 2} y={-10} textAnchor="middle" fontSize="12" fill="#6b7280">
            B{i + 1}
          </text>
        ))}
        <text x={b * cellW / 2} y={-35} textAnchor="middle" fill="#374151" fontWeight="bold">
          物品 B ({b}种)
        </text>

        {/* Grid Cells */}
        {Array.from({ length: a }).map((_, row) => (
          Array.from({ length: b }).map((_, col) => {
            // Determine if this cell is visible based on visibleCells count
            // The order is row-major: (0,0), (0,1)...
            const index = row * b + col
            const isVisible = index < visibleCells

            return (
              <g key={`${row}-${col}`} transform={`translate(${col * cellW}, ${row * cellH})`} style={{ opacity: isVisible ? 1 : 0.1, transition: "opacity 0.2s" }}>
                <rect
                  x={1}
                  y={1}
                  width={cellW - 2}
                  height={cellH - 2}
                  fill={isVisible ? "#bfdbfe" : "transparent"}
                  stroke="#3b82f6"
                  strokeWidth="1"
                  rx={2}
                />
                {/* Show text if cell is big enough */}
                {cellW > 35 && cellH > 20 && (
                  <text x={cellW / 2} y={cellH / 2 + 4} textAnchor="middle" fontSize="10" fill="#1e40af" opacity={0.7}>
                    A{row + 1},B{col + 1}
                  </text>
                )}
              </g>
            )
          })
        ))}
      </g>

      {/* Summary */}
      <text x={width / 2} y={height - 10} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#374151">
        计数: {count}
      </text>
    </svg>
  )
}