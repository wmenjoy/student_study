"use client"
type Node = { p: number; label: string }
type Props = { first: Node[]; second: Node[] }

export function ProbabilityTree({ first, second }: Props) {
  const width = 600
  const height = 260
  const ox = 40
  const oy = 120
  return (
    <svg width={width} height={height} className="svg-panel">
      <circle cx={ox} cy={oy} r={8} fill="#333" />
      {first.map((f, i) => {
        const x1 = ox
        const y1 = oy
        const x2 = 200
        const y2 = 40 + i * 60
        const p1 = f.p
        return (
          <g key={i}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#333" />
            <circle cx={x2} cy={y2} r={6} fill="#6ba4ff" />
            <text x={x2 - 10} y={y2 - 10}>{f.label} {p1}</text>
            {second.map((s, j) => {
              const x3 = 360
              const y3 = y2 + (j - 0.5) * 30
              const p = (p1 * s.p).toFixed(2)
              return (
                <g key={j}>
                  <line x1={x2} y1={y2} x2={x3} y2={y3} stroke="#333" />
                  <circle cx={x3} cy={y3} r={5} fill="#f5a623" />
                  <text x={x3 + 8} y={y3}>{s.label} {s.p} 合={p}</text>
                </g>
              )
            })}
          </g>
        )
      })}
    </svg>
  )
}