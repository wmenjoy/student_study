"use client"
type Props = { priceAdult: number; priceChild: number; tickets: number; revenue: number; stage: number }

export function TicketSolver({ priceAdult, priceChild, tickets, revenue, stage }: Props) {
  const width = 640
  const height = 240
  const denom = Math.max(1, priceAdult - priceChild)
  const adults = Math.max(0, Math.floor((revenue - priceChild * tickets) / denom))
  const children = Math.max(0, tickets - adults)
  const valid = priceAdult*adults + priceChild*children === revenue
  const box = (x:number,y:number,w:number,h:number,text:string)=> (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} ry={10} fill="#ffffff" stroke="#60a5fa" />
      <text x={x+12} y={y+26} fontSize={16}>{text}</text>
    </g>
  )
  return (
    <svg width={width} height={height} className="svg-panel">
      {stage>=0 && (
        <g>
          {box(24,24,260,40,`成人票=${priceAdult} 童票=${priceChild}`)}
          {box(300,24,260,40,`张数=${tickets} 收入=${revenue}`)}
        </g>
      )}
      {stage>=1 && (
        <g>
          {box(24,84,536,40,`方程: ${priceAdult}A+${priceChild}C=${revenue}, A+C=${tickets}`)}
        </g>
      )}
      {stage>=2 && (
        <g>
          {box(24,134,536,40,`解: A=${adults}, C=${children}${valid?"":" (不整解)"}`)}
        </g>
      )}
    </svg>
  )
}