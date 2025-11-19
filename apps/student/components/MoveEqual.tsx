"use client"
import { useEffect, useState } from "react"

type Props = { a: number; b: number; stage?: number }

export function MoveEqual({ a, b, stage = 0 }: Props) {
  const moveAmount = Math.abs(a - b) / 2
  const equalValue = (a + b) / 2
  const fromA = a > b

  const width = 680
  const height = 480

  // Scale logic
  const maxVal = Math.max(a, b)
  const scale = Math.min(4, (width - 150) / maxVal)

  const startX = 60
  const startY = 100

  const [showBars, setShowBars] = useState(0)
  const [showDiff, setShowDiff] = useState(0)
  const [moveBlock, setMoveBlock] = useState(0) // 0: initial, 1: detached, 2: moved
  const [showResult, setShowResult] = useState(0)

  useEffect(() => {
    if (stage === 0) {
      setShowBars(1)
      setShowDiff(0)
      setMoveBlock(0)
      setShowResult(0)
    } else if (stage === 1) {
      setShowBars(1)
      setShowDiff(1)
      setMoveBlock(1) // Detach
      setShowResult(0)
    } else if (stage >= 2) {
      setShowBars(1)
      setShowDiff(1)
      setMoveBlock(2) // Move
      setShowResult(1)
    }
  }, [stage])

  const aWidth = a * scale
  const bWidth = b * scale
  const moveWidth = moveAmount * scale
  const remainWidth = (fromA ? a - moveAmount : b - moveAmount) * scale

  return (
    <svg width={width} height={height} className="svg-panel">
      <defs>
        <linearGradient id="blueGradME" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" />
          <stop offset="100%" stopColor="#3b82f6" />
        </linearGradient>
        <linearGradient id="orangeGradME" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fb923c" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
        <linearGradient id="moveGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#f59e0b" />
        </linearGradient>
        <linearGradient id="remainGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#22c55e" />
        </linearGradient>
        <marker id="arrowMove" markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
          <path d="M0,0 L0,10 L10,5 z" fill="#ef4444" />
        </marker>
      </defs>

      {/* Title */}
      <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">移多补少</text>
      <text x={24} y={56} fontSize="14" fill="#6b7280">
        A = {a}，B = {b}，如何让它们相等？
      </text>

      <g transform={`translate(${startX}, ${startY})`}>
        <text x={0} y={-10} fontSize="14" fontWeight="bold" fill="#374151">
          {stage === 0 ? "初始状态：" : "分离转移部分："}
        </text>

        {/* Bar A */}
        <g style={{ opacity: showBars, transition: "opacity 0.5s" }}>
          {fromA ? (
            <>
              {/* Ghost/shadow of original A (虚影) */}
              <rect
                x={0}
                y={0}
                width={aWidth}
                height={50}
                rx={4}
                fill="none"
                stroke="#3b82f6"
                strokeWidth="1"
                strokeDasharray="4 4"
                style={{ opacity: moveBlock >= 1 ? 0.3 : 0, transition: "opacity 0.5s" }}
              />

              {/* Remaining part (green when moved) */}
              <rect
                x={0}
                y={0}
                width={moveBlock >= 1 ? remainWidth : aWidth}
                height={50}
                rx={4}
                fill={moveBlock >= 1 ? "url(#remainGrad)" : "url(#blueGradME)"}
                stroke={moveBlock >= 1 ? "#22c55e" : "#3b82f6"}
                strokeWidth="2"
                style={{ transition: "width 0.5s, fill 0.5s, stroke 0.5s" }}
              />

              <g style={{ opacity: moveBlock >= 1 ? 1 : 0, transition: "opacity 0.5s" }}>
                <text x={remainWidth / 2} y={30} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">
                  剩余 {a - moveAmount}
                </text>
              </g>

              <g style={{ opacity: moveBlock === 0 ? 1 : 0, transition: "opacity 0.5s" }}>
                <text x={aWidth / 2} y={30} textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold">
                  A = {a}
                </text>
              </g>

              {/* Difference indicator line (比B多的部分) */}
              <g style={{ opacity: showDiff, transition: "opacity 0.5s 0.2s" }}>
                <path
                  d={`M${bWidth},60 v-5 h${aWidth - bWidth} v5`}
                  stroke="#ef4444"
                  strokeWidth="2"
                  fill="none"
                />
                <text
                  x={bWidth + (aWidth - bWidth) / 2}
                  y={75}
                  textAnchor="middle"
                  fill="#ef4444"
                  fontSize="11"
                  fontWeight="bold"
                >
                  比B多 {Math.abs(a - b)}
                </text>
              </g>
            </>
          ) : (
            // A is smaller - stays intact (until block arrives)
            <>
              <rect
                x={0}
                y={0}
                width={aWidth}
                height={50}
                rx={4}
                fill="url(#blueGradME)"
                stroke="#3b82f6"
                strokeWidth="2"
              />
              <text x={aWidth / 2} y={30} textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold">
                A = {a}
              </text>
            </>
          )}
        </g>

        {/* Bar B */}
        <g transform="translate(0, 130)" style={{ opacity: showBars, transition: "opacity 0.5s 0.1s" }}>
          {!fromA ? (
            <>
              {/* Ghost/shadow of original B (虚影) */}
              <rect
                x={0}
                y={0}
                width={bWidth}
                height={50}
                rx={4}
                fill="none"
                stroke="#f97316"
                strokeWidth="1"
                strokeDasharray="4 4"
                style={{ opacity: moveBlock >= 1 ? 0.3 : 0, transition: "opacity 0.5s" }}
              />

              {/* Remaining part (green when moved) */}
              <rect
                x={0}
                y={0}
                width={moveBlock >= 1 ? remainWidth : bWidth}
                height={50}
                rx={4}
                fill={moveBlock >= 1 ? "url(#remainGrad)" : "url(#orangeGradME)"}
                stroke={moveBlock >= 1 ? "#22c55e" : "#f97316"}
                strokeWidth="2"
                style={{ transition: "width 0.5s, fill 0.5s, stroke 0.5s" }}
              />

              <g style={{ opacity: moveBlock >= 1 ? 1 : 0, transition: "opacity 0.5s" }}>
                <text x={remainWidth / 2} y={30} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">
                  剩余 {b - moveAmount}
                </text>
              </g>

              <g style={{ opacity: moveBlock === 0 ? 1 : 0, transition: "opacity 0.5s" }}>
                <text x={bWidth / 2} y={30} textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold">
                  B = {b}
                </text>
              </g>

              {/* Difference indicator line (比A多的部分) */}
              <g style={{ opacity: showDiff, transition: "opacity 0.5s 0.2s" }}>
                <path
                  d={`M${aWidth},60 v-5 h${bWidth - aWidth} v5`}
                  stroke="#ef4444"
                  strokeWidth="2"
                  fill="none"
                />
                <text
                  x={aWidth + (bWidth - aWidth) / 2}
                  y={75}
                  textAnchor="middle"
                  fill="#ef4444"
                  fontSize="11"
                  fontWeight="bold"
                >
                  比A多 {Math.abs(a - b)}
                </text>
              </g>
            </>
          ) : (
            // B is smaller - stays intact (until block arrives)
            <>
              <rect
                x={0}
                y={0}
                width={bWidth}
                height={50}
                rx={4}
                fill="url(#orangeGradME)"
                stroke="#f97316"
                strokeWidth="2"
              />
              <text x={bWidth / 2} y={30} textAnchor="middle" fill="#fff" fontSize="18" fontWeight="bold">
                B = {b}
              </text>
            </>
          )}
        </g>

        {/* Moving Block Animation */}
        {/* 
           Logic:
           - Stage 1 (moveBlock=1): Block appears detached next to the larger bar.
           - Stage 2 (moveBlock=2): Block moves to the smaller bar.
        */}
        <g style={{ opacity: moveBlock >= 1 ? 1 : 0, transition: "opacity 0.5s" }}>
          {fromA ? (
            // Moving from A (top) to B (bottom)
            <g style={{
              transform: moveBlock === 2
                ? `translate(${bWidth + 5}px, 130px)` // Target: End of B
                : `translate(${remainWidth + 5}px, 0px)`, // Start: End of A (remaining)
              transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)"
            }}>
              <rect
                width={moveWidth}
                height={50}
                rx={4}
                fill="url(#moveGrad)"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              <text x={moveWidth / 2} y={30} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">
                {moveAmount}
              </text>
              {moveBlock === 1 && (
                <text x={moveWidth / 2} y={-10} textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">
                  ↓ 移走
                </text>
              )}
            </g>
          ) : (
            // Moving from B (bottom) to A (top)
            <g style={{
              transform: moveBlock === 2
                ? `translate(${aWidth + 5}px, 0px)` // Target: End of A
                : `translate(${remainWidth + 5}px, 130px)`, // Start: End of B (remaining)
              transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)"
            }}>
              <rect
                width={moveWidth}
                height={50}
                rx={4}
                fill="url(#moveGrad)"
                stroke="#f59e0b"
                strokeWidth="2"
              />
              <text x={moveWidth / 2} y={30} textAnchor="middle" fill="#fff" fontSize="14" fontWeight="bold">
                {moveAmount}
              </text>
              {moveBlock === 1 && (
                <text x={moveWidth / 2} y={-10} textAnchor="middle" fill="#f59e0b" fontSize="12" fontWeight="bold">
                  ↑ 移走
                </text>
              )}
            </g>
          )}
        </g>

        {/* Annotation */}
        <g transform="translate(0, 260)" style={{ opacity: showDiff, transition: "opacity 0.5s 0.5s" }}>
          <rect
            x={0}
            y={0}
            width={Math.max(aWidth, bWidth) + 100}
            height={50}
            rx={6}
            fill="#fef3c7"
            stroke="#f59e0b"
            strokeWidth="2"
          />
          <text x={10} y={20} fontSize="13" fontWeight="bold" fill="#92400e">
            💡 关键思想：
          </text>
          <text x={10} y={38} fontSize="12" fill="#92400e">
            把多的部分切割出来，移到少的一方末尾，实现平均分配
          </text>
        </g>
      </g>

      {/* Stage 2: Show result */}
      <g transform="translate(40, 410)" style={{ opacity: showResult, transition: "opacity 0.5s 1s" }}>
        <rect x={0} y={0} width={600} height={60} rx={8} fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
        <text x={10} y={25} fontSize="14" fontWeight="bold" fill="#374151">结果：</text>
        <text x={10} y={45} fontSize="16" fontWeight="bold" fill="#16a34a">
          转移 {moveAmount} 从 {fromA ? "A到B" : "B到A"}，相等值 = (A + B) ÷ 2 = {equalValue}
        </text>
      </g>
    </svg>
  )
}