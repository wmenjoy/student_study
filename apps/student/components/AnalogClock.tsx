"use client"
type Props = { hour: number; minute: number }

export function AnalogClock({ hour, minute }: Props) {
  const width = 240
  const height = 240
  const cx = 120
  const cy = 120
  const r = 90
  const hr = ((hour % 12) + minute/60) * 30
  const mr = minute * 6
  const hrad = (hr * Math.PI) / 180
  const mrad = (mr * Math.PI) / 180
  const hx = cx + r*0.6 * Math.sin(hrad)
  const hy = cy - r*0.6 * Math.cos(hrad)
  const mx = cx + r * Math.sin(mrad)
  const my = cy - r * Math.cos(mrad)
  return (
    <svg width={width} height={height} className="svg-panel">
      <circle cx={cx} cy={cy} r={r} fill="#fff" stroke="#e5e7eb" />
      {[...Array(12)].map((_,i)=> (
        <text key={i} x={cx + (r-14) * Math.sin((i*30)*Math.PI/180)} y={cy - (r-14) * Math.cos((i*30)*Math.PI/180)} textAnchor="middle" dominantBaseline="middle">{i===0?12:i}</text>
      ))}
      <line x1={cx} y1={cy} x2={hx} y2={hy} stroke="#6ba4ff" strokeWidth={4} />
      <line x1={cx} y1={cy} x2={mx} y2={my} stroke="#f59e0b" strokeWidth={2} />
    </svg>
  )
}