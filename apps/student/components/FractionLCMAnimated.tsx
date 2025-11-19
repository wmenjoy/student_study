"use client"
import { useMemo } from "react"

type Props = { aNum: number; aDen: number; bNum: number; bDen: number; op: "+" | "-"; stage: number }

const gcd = (x: number, y: number) => { x = Math.abs(x); y = Math.abs(y); while (y) { const t = x % y; x = y; y = t } return x }
const lcm = (x: number, y: number) => Math.abs(x * y) / gcd(x, y)
const pf = (n: number) => {
  n = Math.abs(n)
  const res: number[] = []
  let d = 2
  while (d * d <= n) { while (n % d === 0) { res.push(d); n = n / d } d++ }
  if (n > 1) res.push(n)
  return res
}
const countMap = (arr: number[]) => arr.reduce((m, p) => { m[p] = (m[p] || 0) + 1; return m }, {} as Record<number, number>)

export function FractionLCMAnimated({ aNum, aDen, bNum, bDen, op, stage }: Props) {
  const den = useMemo(() => lcm(aDen, bDen), [aDen, bDen])
  const aK = den / aDen
  const bK = den / bDen
  const aEq = aNum * aK
  const bEq = bNum * bK
  const tot = op === "+" ? aEq + bEq : aEq - bEq
  const g = gcd(Math.abs(tot), den)
  const simpN = Math.abs(tot) / g
  const simpD = den / g
  const width = 600
  const height = 280

  const lcmCounts = useMemo(() => {
    const ca = countMap(pf(aDen))
    const cb = countMap(pf(bDen))
    const primes = Array.from(new Set([...Object.keys(ca), ...Object.keys(cb)].map(x => parseInt(x)))).sort((x, y) => x - y)
    const map: Record<number, number> = {}
    for (const p of primes) { map[p] = Math.max(ca[p] || 0, cb[p] || 0) }
    return { primes, ca, cb, map }
  }, [aDen, bDen])

  const bar = (x: number, y: number, w: number, h: number, parts: number, filled: number, color: string) => {
    const seg = w / parts
    const rects = []
    for (let i = 0; i < parts; i++) {
      rects.push(
        <rect
          key={i}
          x={x + i * seg}
          y={y}
          width={seg - 1}
          height={h}
          fill={i < filled ? color : "#ffffff"}
          stroke="#e5e7eb"
          style={{ transition: 'all 0.5s ease' }}
        />
      )
    }
    return <g>{rects}</g>
  }

  return (
    <svg width={width} height={height} className="svg-panel" style={{ maxWidth: '100%' }}>
      <defs>
        <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
          <path d="M0,0 L0,6 L9,3 z" fill="#9ca3af" />
        </marker>
      </defs>

      {stage >= 0 && (
        <g style={{ opacity: 1, transition: 'opacity 0.5s' }}>
          <text x={24} y={30} fontWeight="bold" fill="#374151">1. 原分数</text>
          <text x={120} y={30} fontSize="14">{aNum}/{aDen} {op} {bNum}/{bDen}</text>
          {bar(24, 45, 240, 24, aDen, aNum, "#6ba4ff")}
          {bar(24, 80, 240, 24, bDen, bNum, "#f5a623")}

          <g transform="translate(320, 20)">
            <text x={0} y={10} fontSize="12" fill="#6b7280">分母分解质因数</text>
            <g transform="translate(0, 25)">
              {pf(aDen).map((p, i) => (
                <g key={"ap" + i} transform={`translate(${i * 32}, 0)`}>
                  <rect width={28} height={24} rx={4} fill="#eef2ff" stroke="#c7d2fe" />
                  <text x={14} y={17} textAnchor="middle" fontSize="12">{p}</text>
                </g>
              ))}
            </g>
            <g transform="translate(0, 60)">
              {pf(bDen).map((p, i) => (
                <g key={"bp" + i} transform={`translate(${i * 32}, 0)`}>
                  <rect width={28} height={24} rx={4} fill="#fff7ed" stroke="#fed7aa" />
                  <text x={14} y={17} textAnchor="middle" fontSize="12">{p}</text>
                </g>
              ))}
            </g>
          </g>
        </g>
      )}

      {stage >= 1 && (
        <g style={{ opacity: 1, transition: 'opacity 0.5s' }}>
          <line x1={144} y1={110} x2={144} y2={130} stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#arrow)" />
          <text x={24} y={150} fontWeight="bold" fill="#374151">2. 通分 (LCM={den})</text>

          <g transform="translate(320, 120)">
            <text x={0} y={10} fontSize="12" fill="#6b7280">取最高次幂</text>
            {lcmCounts.primes.map((p, i) => (
              <g key={"lm" + i} transform={`translate(${i * 40}, 25)`} className={stage >= 2 ? "pulse" : ""} style={{ animationDelay: `${i * 0.2}s` }}>
                <rect width={36} height={24} rx={4} fill="#dcfce7" stroke="#86efac" />
                <text x={18} y={17} textAnchor="middle" fontSize="12">{`${p}^${lcmCounts.map[p]}`}</text>
              </g>
            ))}
          </g>
        </g>
      )}

      {stage >= 3 && (
        <g style={{ opacity: 1, transition: 'opacity 0.5s' }}>
          {bar(24, 165, 240, 24, den, aEq, "#6ba4ff")}
          {bar(24, 200, 240, 24, den, bEq, "#f5a623")}
          <text x={280} y={182} fontSize="12" fill="#6b7280">×{aK}</text>
          <text x={280} y={217} fontSize="12" fill="#6b7280">×{bK}</text>

          <text x={320} y={180} fontSize="14">结果 = {tot}/{den}</text>
        </g>
      )}

      {stage >= 4 && (
        <g style={{ opacity: 1, transition: 'opacity 0.5s' }}>
          <line x1={320} y1={190} x2={320} y2={210} stroke="#e5e7eb" strokeWidth="2" markerEnd="url(#arrow)" />
          <text x={320} y={230} fontWeight="bold" fill="#374151">3. 约分 (÷{g})</text>
          <text x={420} y={230} fontSize="16" fill="#ef4444" fontWeight="bold">= {simpN}/{simpD}</text>

          <g transform="translate(320, 245)">
            {(() => {
              const cg = countMap(pf(g))
              const primes = Object.keys(cg).map(x => parseInt(x)).sort((a, b) => a - b)
              return primes.map((p, i) => (
                <g key={"gd" + i} transform={`translate(${i * 40}, 0)`} className="blink" style={{ animationDelay: `${i * 0.12}s` }}>
                  <rect width={36} height={22} rx={4} fill="#fee2e2" stroke="#fca5a5" />
                  <text x={18} y={16} textAnchor="middle" fontSize="12">{`${p}^${cg[p]}`}</text>
                </g>
              ))
            })()}
          </g>
        </g>
      )}
    </svg>
  )
}