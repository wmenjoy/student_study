"use client"
import { useEffect, useState } from "react"

type Props = {
  tableCount: number
  chairCount: number
  tableDiff: number
  stage?: number
}

export function ShoppingViz({ tableCount, chairCount, tableDiff, stage = 0 }: Props) {
  const width = 640
  const height = 450

  // Calculate prices (assuming chair price is calculated from total and diff)
  // For visualization, we'll use example values
  const chairPrice = 25
  const tablePrice = chairPrice + tableDiff
  const total = tablePrice * tableCount + chairPrice * chairCount

  const [animStage, setAnimStage] = useState(0)

  useEffect(() => {
    setAnimStage(stage)
  }, [stage])

  return (
    <svg width={width} height={height} className="svg-panel">
      {/* Title */}
      <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">购物问题图解</text>

      {/* Info */}
      <g transform="translate(24, 50)">
        <text fontSize="13" fill="#6b7280">
          {tableCount}张桌子 + {chairCount}把椅子 = {total}元 | 桌子比椅子贵{tableDiff}元
        </text>
      </g>

      {/* Tables visualization */}
      <g transform="translate(40, 100)">
        <text x={0} y={0} fontSize="14" fontWeight="bold" fill="#dc2626">桌子 ({tableCount}张)</text>

        {Array.from({ length: Math.min(tableCount, 6) }).map((_, i) => (
          <g key={i} transform={`translate(${i * 70}, 20)`}>
            {/* Table icon */}
            <rect x={0} y={0} width={50} height={30} rx={4} fill="#fee2e2" stroke="#dc2626" strokeWidth="2" />
            <rect x={10} y={25} width={4} height={15} fill="#dc2626" />
            <rect x={36} y={25} width={4} height={15} fill="#dc2626" />
            {animStage >= 1 && (
              <text x={25} y={18} textAnchor="middle" fontSize="11" fill="#991b1b" fontWeight="bold">
                {tablePrice}元
              </text>
            )}
          </g>
        ))}
        {tableCount > 6 && (
          <text x={420} y={35} fontSize="14" fill="#6b7280">...</text>
        )}
      </g>

      {/* Chairs visualization */}
      <g transform="translate(40, 200)">
        <text x={0} y={0} fontSize="14" fontWeight="bold" fill="#2563eb">椅子 ({chairCount}把)</text>

        {Array.from({ length: Math.min(chairCount, 6) }).map((_, i) => (
          <g key={i} transform={`translate(${i * 70}, 20)`}>
            {/* Chair icon */}
            <rect x={10} y={0} width={30} height={5} rx={2} fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
            <rect x={15} y={5} width={20} height={20} rx={3} fill="#93c5fd" stroke="#2563eb" strokeWidth="2" />
            <rect x={15} y={20} width={4} height={15} fill="#2563eb" />
            <rect x={31} y={20} width={4} height={15} fill="#2563eb" />
            {animStage >= 1 && (
              <text x={25} y={18} textAnchor="middle" fontSize="11" fill="#1e40af" fontWeight="bold">
                {chairPrice}元
              </text>
            )}
          </g>
        ))}
        {chairCount > 6 && (
          <text x={420} y={35} fontSize="14" fill="#6b7280">...</text>
        )}
      </g>

      {/* Comparison bar */}
      {animStage >= 2 && (
        <g transform="translate(40, 310)" style={{ opacity: animStage >= 2 ? 1 : 0, transition: "opacity 0.5s" }}>
          <text x={0} y={0} fontSize="14" fontWeight="bold" fill="#374151">价格对比</text>

          {/* Chair bar */}
          <rect x={0} y={15} width={chairPrice * 4} height={30} rx={4} fill="#93c5fd" stroke="#2563eb" strokeWidth="2" />
          <text x={chairPrice * 2} y={35} textAnchor="middle" fill="#1e40af" fontSize="12">椅子 {chairPrice}元</text>

          {/* Table bar */}
          <rect x={0} y={55} width={tablePrice * 4} height={30} rx={4} fill="#fecaca" stroke="#dc2626" strokeWidth="2" />
          <text x={tablePrice * 2} y={75} textAnchor="middle" fill="#991b1b" fontSize="12">桌子 {tablePrice}元</text>

          {/* Difference indicator */}
          <path
            d={`M${chairPrice * 4},30 L${tablePrice * 4},60`}
            stroke="#f59e0b"
            strokeWidth="2"
            strokeDasharray="4 2"
          />
          <text x={(chairPrice * 4 + tablePrice * 4) / 2} y={50} fill="#f59e0b" fontSize="12" fontWeight="bold">
            差{tableDiff}元
          </text>
        </g>
      )}

      {/* Formula */}
      {animStage >= 3 && (
        <g transform="translate(320, 310)" style={{ opacity: animStage >= 3 ? 1 : 0, transition: "opacity 0.5s" }}>
          <rect x={0} y={0} width={280} height={110} rx={8} fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
          <text x={15} y={25} fill="#166534" fontSize="13" fontWeight="bold">解题思路:</text>
          <text x={15} y={45} fill="#166534" fontSize="11">
            设椅子x元，桌子(x+{tableDiff})元
          </text>
          <text x={15} y={65} fill="#166534" fontSize="11">
            {tableCount}(x+{tableDiff}) + {chairCount}x = {total}
          </text>
          <text x={15} y={85} fill="#166534" fontSize="11">
            解得: 椅子{chairPrice}元, 桌子{tablePrice}元
          </text>
        </g>
      )}
    </svg>
  )
}
