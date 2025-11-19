"use client"
import { useEffect, useState } from "react"

type Props = {
  price: number
  pay: number
  stage?: number
  mode?: "optimal" | "explore"
}

export function CoinCashier({ price, pay, stage = 0, mode = "optimal" }: Props) {
  const p = Math.max(0, Math.floor(price))
  const g = Math.max(p, Math.floor(pay))
  const change = g - p

  // Denominations for breakdown
  const denoms = [100, 50, 20, 10, 5, 1]

  // Calculate Optimal Breakdown (Greedy)
  const getOptimal = (amount: number) => {
    const res: Array<{ d: number; c: number }> = []
    let rem = amount
    for (const d of denoms) {
      if (rem >= d) {
        const c = Math.floor(rem / d)
        res.push({ d, c })
        rem -= c * d
      }
    }
    return res
  }

  // Calculate Multiple Breakdowns (Backtracking with limit)
  const getVariations = (amount: number, limit: number = 10) => {
    const results: Array<Array<{ d: number; c: number }>> = []

    const solve = (target: number, index: number, current: Array<{ d: number; c: number }>) => {
      if (results.length >= limit) return
      if (target === 0) {
        results.push([...current])
        return
      }
      if (index >= denoms.length) return

      const coin = denoms[index]
      const maxCount = Math.floor(target / coin)

      // Try taking i coins of this denomination
      // To get "varied" results, we iterate from maxCount down to 0
      for (let i = maxCount; i >= 0; i--) {
        if (results.length >= limit) return

        // Optimization: Don't go too deep with 1s if we already have results
        // Relaxed limit to 15 to allow more combinations like "10 ones"
        if (coin === 1 && i > 15 && results.length > 0) continue

        if (i > 0) current.push({ d: coin, c: i })
        solve(target - i * coin, index + 1, current)
        if (i > 0) current.pop()
      }
    }

    solve(amount, 0, [])
    return results
  }

  const breakdown = getOptimal(change)
  const variations = mode === "explore" ? getVariations(change) : [breakdown]

  // Interactive State for Explore Mode
  const [visibleVars, setVisibleVars] = useState(0)

  useEffect(() => {
    if (stage === 0) {
      setVisibleVars(0)
    } else if (stage === 2) {
      // If explore mode, start with 0 and let user click.
      // If optimal mode, just show it.
      if (mode === "explore") {
        setVisibleVars(0) // Reset to 0 to force interaction
      } else {
        setVisibleVars(1)
      }
    }
  }, [stage, mode])

  const handleExploreClick = () => {
    if (mode === "explore" && stage >= 2 && visibleVars < variations.length) {
      setVisibleVars(prev => prev + 1)
    }
  }

  const width = 640
  // Increase height multiplier to prevent cutoff
  const height = mode === "explore" ? Math.max(400, 240 + variations.length * 90) : 360

  // Animation States
  const [showPay, setShowPay] = useState(0)
  const [showDiff, setShowDiff] = useState(0)
  const [showCoins, setShowCoins] = useState(0)

  useEffect(() => {
    if (stage === 0) {
      setShowPay(1)
      setShowDiff(0)
      setShowCoins(0)
    } else if (stage === 1) {
      setShowPay(1)
      setShowDiff(1)
      setShowCoins(0)
    } else if (stage >= 2) {
      setShowPay(1)
      setShowDiff(1)
      setShowCoins(1)
    }
  }, [stage])

  // Helper to draw a "Bill" or "Coin"
  const drawMoney = (val: number, x: number, y: number, scale: number = 1) => {
    const isCoin = val <= 1
    const color = val >= 100 ? "#ef4444" : val >= 50 ? "#22c55e" : val >= 20 ? "#a855f7" : val >= 10 ? "#3b82f6" : val >= 5 ? "#8b5cf6" : "#eab308"
    const w = isCoin ? 30 : 50
    const h = isCoin ? 30 : 26

    return (
      <g transform={`translate(${x}, ${y}) scale(${scale})`}>
        {isCoin ? (
          <circle cx={15} cy={15} r={14} fill="#fef08a" stroke="#eab308" strokeWidth="2" />
        ) : (
          <rect x={0} y={0} width={w} height={h} rx={4} fill={color} stroke="white" strokeWidth="2" opacity="0.9" />
        )}
        <text
          x={w / 2}
          y={h / 2 + 5}
          textAnchor="middle"
          fontSize="12"
          fontWeight="bold"
          fill={isCoin ? "#b45309" : "white"}
        >
          {val}
        </text>
      </g>
    )
  }

  // Bar Model Scale
  // Max width for the bar is around 500px
  const maxVal = Math.max(pay, 100)
  const scaleX = 500 / maxVal
  const barH = 40

  return (
    <svg width={width} height={height} className="svg-panel" onClick={handleExploreClick} style={{ cursor: (mode === "explore" && stage >= 2) ? "pointer" : "default" }}>
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#ef4444" />
        </marker>
        <pattern id="stripe-gray" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <rect width="4" height="8" transform="translate(0,0)" fill="#9ca3af" opacity="0.2" />
        </pattern>
      </defs>

      <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">找零计算</text>

      <g transform="translate(60, 80)">

        {/* 1. Payment Bar (Total) */}
        <g style={{ opacity: showPay, transition: "opacity 0.5s" }}>
          <text x={-10} y={25} textAnchor="end" fontSize="14" fill="#6b7280">支付</text>
          <rect x={0} y={0} width={pay * scaleX} height={barH} fill="#93c5fd" stroke="#3b82f6" strokeWidth="2" rx={4} />
          <text x={(pay * scaleX) / 2} y={25} textAnchor="middle" fill="#1e40af" fontWeight="bold">{pay}</text>
        </g>

        {/* 2. Price Bar (Cost) */}
        <g transform="translate(0, 60)" style={{ opacity: showPay, transition: "opacity 0.5s 0.2s" }}>
          <text x={-10} y={25} textAnchor="end" fontSize="14" fill="#6b7280">价格</text>
          <rect x={0} y={0} width={p * scaleX} height={barH} fill="#fca5a5" stroke="#ef4444" strokeWidth="2" rx={4} />
          <text x={(p * scaleX) / 2} y={25} textAnchor="middle" fill="#991b1b" fontWeight="bold">{p}</text>

          {/* Ghost part for Change */}
          <rect
            x={p * scaleX}
            y={0}
            width={change * scaleX}
            height={barH}
            fill="url(#stripe-gray)"
            stroke="#9ca3af"
            strokeWidth="2"
            strokeDasharray="4 4"
            rx={4}
            opacity={showDiff ? 1 : 0}
            style={{ transition: "opacity 0.5s" }}
          />
        </g>

        {/* 3. Difference Indicator */}
        <g style={{ opacity: showDiff, transition: "opacity 0.5s" }}>
          <line x1={p * scaleX} y1={100} x2={p * scaleX} y2={130} stroke="#ef4444" strokeDasharray="4 4" />
          <line x1={pay * scaleX} y1={40} x2={pay * scaleX} y2={130} stroke="#ef4444" strokeDasharray="4 4" />

          <path d={`M${p * scaleX},120 L${pay * scaleX},120`} stroke="#ef4444" strokeWidth="2" markerEnd="url(#arrow)" markerStart="url(#arrow)" />
          <text x={p * scaleX + (change * scaleX) / 2} y={140} textAnchor="middle" fill="#dc2626" fontWeight="bold">
            找零 = {change}
          </text>
        </g>

        {/* 4. Money Breakdown (Variations) */}
        <g transform="translate(0, 180)" style={{ opacity: showCoins, transition: "opacity 0.5s" }}>
          <text x={0} y={0} fontSize="16" fontWeight="bold" fill="#374151">
            {mode === "explore" ? "多种找零方式 (穷举 - 前10种):" : "最优找零组合 (最少张数):"}
          </text>
          {mode === "explore" && visibleVars < variations.length && (
            <text x={200} y={0} fontSize="14" fill="#ef4444" fontWeight="bold">👉 点击显示下一方案</text>
          )}

          {variations.map((v, idx) => (
            <g key={idx} transform={`translate(0, ${30 + idx * 70})`} style={{ opacity: (mode === "explore" && idx >= visibleVars) ? 0 : 1, transition: "opacity 0.5s" }}>
              {mode === "explore" && (
                <text x={-10} y={25} textAnchor="end" fontSize="14" fontWeight="bold" fill="#6b7280">
                  方案{idx + 1}:
                </text>
              )}
              <g transform="translate(0, 0)">
                {v.map((b, i) => {
                  // Simple horizontal layout
                  const xOffset = i * 90
                  return (
                    <g key={i} transform={`translate(${xOffset}, 0)`}>
                      {drawMoney(b.d, 0, 0, 1.2)}
                      <text x={65} y={20} fontSize="16" fontWeight="bold" fill="#4b5563">× {b.c}</text>
                    </g>
                  )
                })}
                {v.length === 0 && change === 0 && (
                  <text x={0} y={30} fontSize="14" fill="#6b7280">无需找零</text>
                )}
              </g>
              {/* Separator line if multiple */}
              {idx < variations.length - 1 && (
                <line x1={0} y1={55} x2={400} y2={55} stroke="#e5e7eb" strokeDasharray="4 4" />
              )}
            </g>
          ))}
        </g>

      </g>
    </svg>
  )
}