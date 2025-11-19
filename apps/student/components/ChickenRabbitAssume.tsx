"use client"
type Props = { heads: number; legs: number; stage: number }

export function ChickenRabbitAssume({ heads, legs, stage }: Props) {
  const width = 620
  const height = 240
  const allChickenLegs = heads * 2
  const extra = Math.max(0, legs - allChickenLegs)
  const rabbits = Math.floor(extra / 2)
  const chickens = Math.max(0, heads - rabbits)
  const box = (x:number,y:number,w:number,h:number,text:string)=> (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={12} ry={12} fill="#ffffff" stroke="#60a5fa" />
      <text x={x+12} y={y+26} fontSize={16}>{text}</text>
    </g>
  )
  return (
    <svg width={width} height={height} className="svg-panel">
      {stage>=0 && (
        <g>
          {box(24,24,200,40,`头=${heads}`)}
          {box(240,24,200,40,`腿=${legs}`)}
        </g>
      )}
      {stage>=1 && (
        <g>
          {box(24,84,416,40,`假设全部是鸡 → 腿=${allChickenLegs}`)}
        </g>
      )}
      {stage>=2 && (
        <g>
          {box(24,134,416,40,`多余腿数=${extra}`)}
        </g>
      )}
      {stage>=3 && (
        <g>
          {box(24,184,200,40,`兔=${rabbits}`)}
          {box(240,184,200,40,`鸡=${chickens}`)}
        </g>
      )}
    </svg>
  )
}