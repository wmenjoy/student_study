"use client"
import { useEffect, useState } from "react"

type Props = { start: number; end: number; step: number; stage: number }

export function SeriesPairSum({ start, end, step, stage }: Props) {
  const width = 680
  const height = 400
  const nums: number[] = []
  for (let x = start; x <= end; x += step) nums.push(x)
  const n = nums.length
  const pairSum = nums[0] + nums[n - 1]
  const pairs = Math.floor(n / 2)
  const hasMid = n % 2 === 1
  const midVal = hasMid ? nums[Math.floor(n / 2)] : 0
  const sum = pairSum * pairs + midVal

  const [animPairs, setAnimPairs] = useState(0)

  useEffect(() => {
    if (stage === 1) {
      setAnimPairs(0)
      let count = 0
      const interval = setInterval(() => {
        count++
        setAnimPairs(count)
        if (count >= pairs) clearInterval(interval)
      }, 300)
      return () => clearInterval(interval)
    } else if (stage >= 2) {
      setAnimPairs(pairs)
    }
  }, [stage, pairs])

  const boxSize = Math.min(50, Math.max(30, 500 / n))
  const startX = 40
  const startY = 80

  return (
    <svg width={width} height={height} className="svg-panel">
      <defs>
        <linearGradient id="numGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="pairGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <marker id="arrowPair" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L0,8 L8,4 z" fill="#ef4444" />
        </marker>
      </defs>

      {/* Title */}
      <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">等差数列配对求和</text>
      <text x={24} y={56} fontSize="14" fill="#6b7280">
        {start} + {start + step} + ... + {end} = ?
      </text>

      {/* Stage 0: Show all numbers */}
      {stage >= 0 && (
        <g transform={`translate(${startX}, ${startY})`}>
          <text x={0} y={-10} fontSize="14" fontWeight="bold" fill="#374151">数列：</text>
          {nums.map((num, i) => {
            const x = i * (boxSize + 4)
            const isMid = hasMid && i === Math.floor(n / 2)

            return (
              <g key={i} style={{ opacity: 1, transition: "opacity 0.3s" }}>
                <rect
                  x={x}
                  y={0}
                  width={boxSize}
                  height={boxSize}
                  rx={4}
                  fill={isMid ? "#fbbf24" : "url(#numGrad)"}
                  stroke={isMid ? "#f59e0b" : "#3b82f6"}
                  strokeWidth="2"
                />
                <text
                  x={x + boxSize / 2}
                  y={boxSize / 2 + 6}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize={Math.min(14, boxSize / 3)}
                  fontWeight="bold"
                >
                  {num}
                </text>
              </g>
            )
          })}
        </g>
      )}

      {/* Stage 1: Show pairing with curved lines */}
      {stage >= 1 && (
        <g transform={`translate(${startX}, ${startY})`}>
          {Array.from({ length: pairs }).map((_, i) => {
            if (i >= animPairs) return null

            const x1 = i * (boxSize + 4) + boxSize / 2
            const x2 = (n - 1 - i) * (boxSize + 4) + boxSize / 2
            const y1 = boxSize + 10
            const midY = y1 + 30 + i * 8

            return (
              <g key={i} style={{ opacity: 1, transition: "opacity 0.3s" }}>
                {/* Curved pairing line */}
                <path
                  d={`M${x1},${y1} Q${(x1 + x2) / 2},${midY} ${x2},${y1}`}
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  markerEnd="url(#arrowPair)"
                />
                {/* Pair sum label */}
                <text
                  x={(x1 + x2) / 2}
                  y={midY + 5}
                  textAnchor="middle"
                  fill="#ef4444"
                  fontSize="12"
                  fontWeight="bold"
                >
                  {nums[i]} + {nums[n - 1 - i]} = {pairSum}
                </text>
              </g>
            )
          })}
        </g>
      )}

      {/* Stage 2: Show summary */}
      {stage >= 2 && (
        <g transform="translate(40, 240)" style={{ opacity: 1, transition: "opacity 0.5s" }}>
          <rect x={0} y={0} width={600} height={70} rx={8} fill="#f0f9ff" stroke="#3b82f6" strokeWidth="2" />
          <text x={10} y={25} fontSize="14" fontWeight="bold" fill="#374151">配对信息：</text>
          <text x={10} y={48} fontSize="14" fill="#2563eb">
            每对和 = {pairSum}
          </text>
          <text x={180} y={48} fontSize="14" fill="#2563eb">
            对数 = {pairs}
          </text>
          {hasMid && (
            <text x={320} y={48} fontSize="14" fill="#f59e0b">
              中间项 = {midVal}
            </text>
          )}
        </g>
      )}

      {/* Stage 3: Show final calculation */}
      {stage >= 3 && (
        <g transform="translate(40, 330)" style={{ opacity: 1, transition: "opacity 0.5s 0.3s" }}>
          <rect x={0} y={0} width={600} height={50} rx={8} fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
          <text x={10} y={20} fontSize="14" fontWeight="bold" fill="#374151">计算结果：</text>
          <text x={10} y={38} fontSize="16" fontWeight="bold" fill="#16a34a">
            总和 = {hasMid ? `${pairSum} × ${pairs} + ${midVal}` : `${pairSum} × ${pairs}`} = {sum}
          </text>
        </g>
      )}
    </svg>
  )
}