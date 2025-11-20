"use client"
import { useEffect, useState } from "react"

type Props = {
  perPerson1: number  // First distribution per person
  perPerson2: number  // Second distribution per person
  surplus: number     // Surplus in first distribution
  shortage: number    // Shortage in second distribution
  stage?: number
}

export function SurplusDeficitViz({ perPerson1, perPerson2, surplus, shortage, stage = 0 }: Props) {
  const width = 640
  const height = 450

  // Calculate values
  const people = (surplus + shortage) / (perPerson2 - perPerson1)
  const totalItems = people * perPerson1 + surplus

  const [animStage, setAnimStage] = useState(0)

  useEffect(() => {
    setAnimStage(stage)
  }, [stage])

  // Visual representation
  const personWidth = 50
  const personHeight = 60
  const maxPeople = Math.min(people, 8)
  const scale = Math.min(1, 400 / (maxPeople * personWidth))

  return (
    <svg width={width} height={height} className="svg-panel">
      {/* Title */}
      <text x={24} y={30} fontSize="18" fontWeight="bold" fill="#374151">盈亏问题图解</text>

      {/* Info Display */}
      <g transform="translate(24, 50)">
        <text fontSize="13" fill="#6b7280">
          第一次: 每人{perPerson1}个, 多{surplus}个 | 第二次: 每人{perPerson2}个, 少{shortage}个
        </text>
      </g>

      {/* First distribution visualization */}
      <g transform={`translate(40, 90)`}>
        <text x={0} y={0} fontSize="14" fontWeight="bold" fill="#3b82f6">方案一：每人分{perPerson1}个</text>

        {/* People icons */}
        <g transform="translate(0, 20)">
          {Array.from({ length: Math.min(people, 6) }).map((_, i) => (
            <g key={i} transform={`translate(${i * 55}, 0)`}>
              <circle cx={20} cy={15} r={12} fill="#93c5fd" stroke="#3b82f6" strokeWidth="2" />
              <text x={20} y={19} textAnchor="middle" fontSize="10">😊</text>
              <rect x={5} y={30} width={30} height={25} rx={4} fill="#dbeafe" stroke="#3b82f6" strokeWidth="1" />
              <text x={20} y={47} textAnchor="middle" fontSize="11" fill="#1e40af">{perPerson1}</text>
            </g>
          ))}
          {people > 6 && (
            <text x={6 * 55 + 10} y={35} fontSize="14" fill="#6b7280">...</text>
          )}
        </g>

        {/* Surplus indicator */}
        {animStage >= 1 && (
          <g transform="translate(380, 30)" style={{ opacity: animStage >= 1 ? 1 : 0, transition: "opacity 0.5s" }}>
            <rect x={0} y={0} width={60} height={40} rx={8} fill="#dcfce7" stroke="#22c55e" strokeWidth="2" />
            <text x={30} y={18} textAnchor="middle" fontSize="10" fill="#166534">多出</text>
            <text x={30} y={34} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#16a34a">+{surplus}</text>
          </g>
        )}
      </g>

      {/* Second distribution visualization */}
      <g transform={`translate(40, 190)`}>
        <text x={0} y={0} fontSize="14" fontWeight="bold" fill="#f59e0b">方案二：每人分{perPerson2}个</text>

        {/* People icons */}
        <g transform="translate(0, 20)">
          {Array.from({ length: Math.min(people, 6) }).map((_, i) => (
            <g key={i} transform={`translate(${i * 55}, 0)`}>
              <circle cx={20} cy={15} r={12} fill="#fde68a" stroke="#f59e0b" strokeWidth="2" />
              <text x={20} y={19} textAnchor="middle" fontSize="10">😊</text>
              <rect x={5} y={30} width={30} height={25} rx={4} fill="#fef3c7" stroke="#f59e0b" strokeWidth="1" />
              <text x={20} y={47} textAnchor="middle" fontSize="11" fill="#92400e">{perPerson2}</text>
            </g>
          ))}
          {people > 6 && (
            <text x={6 * 55 + 10} y={35} fontSize="14" fill="#6b7280">...</text>
          )}
        </g>

        {/* Shortage indicator */}
        {animStage >= 1 && (
          <g transform="translate(380, 30)" style={{ opacity: animStage >= 1 ? 1 : 0, transition: "opacity 0.5s" }}>
            <rect x={0} y={0} width={60} height={40} rx={8} fill="#fee2e2" stroke="#ef4444" strokeWidth="2" />
            <text x={30} y={18} textAnchor="middle" fontSize="10" fill="#991b1b">缺少</text>
            <text x={30} y={34} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#dc2626">-{shortage}</text>
          </g>
        )}
      </g>

      {/* Explanation - Key insight */}
      {animStage >= 2 && (
        <g transform="translate(40, 290)" style={{ opacity: animStage >= 2 ? 1 : 0, transition: "opacity 0.5s" }}>
          <rect x={0} y={0} width={440} height={55} rx={8} fill="#fef3c7" stroke="#f59e0b" strokeWidth="2" />
          <text x={20} y={20} fill="#92400e" fontSize="13" fontWeight="bold">关键发现:</text>
          <text x={20} y={40} fill="#92400e" fontSize="12">
            每人多分 {perPerson2 - perPerson1} 个，总共多需要 {surplus} + {shortage} = {surplus + shortage} 个
          </text>
        </g>
      )}

      {/* Formula */}
      {animStage >= 3 && (
        <g transform="translate(40, 355)" style={{ opacity: animStage >= 3 ? 1 : 0, transition: "opacity 0.5s" }}>
          <rect x={0} y={0} width={440} height={80} rx={8} fill="#f0fdf4" stroke="#22c55e" strokeWidth="2" />
          <text x={20} y={22} fill="#166534" fontSize="13" fontWeight="bold">公式推导:</text>
          <text x={20} y={42} fill="#166534" fontSize="12">
            人数 = (多的 + 少的) ÷ (每人多分的数量)
          </text>
          <text x={20} y={62} fill="#166534" fontSize="12">
            人数 = ({surplus} + {shortage}) ÷ ({perPerson2} - {perPerson1}) = {surplus + shortage} ÷ {perPerson2 - perPerson1} = {people}
          </text>
        </g>
      )}

      {/* Result box */}
      {animStage >= 3 && (
        <g transform={`translate(${width - 120}, 290)`}>
          <rect x={0} y={0} width={100} height={100} rx={10} fill="#eff6ff" stroke="#3b82f6" strokeWidth="3" />
          <text x={50} y={25} textAnchor="middle" fill="#1e40af" fontSize="12" fontWeight="bold">答案</text>
          <text x={50} y={55} textAnchor="middle" fill="#1e40af" fontSize="24" fontWeight="bold">{people}</text>
          <text x={50} y={75} textAnchor="middle" fill="#1e40af" fontSize="12">人</text>
          <text x={50} y={92} textAnchor="middle" fill="#6b7280" fontSize="10">共{totalItems}个</text>
        </g>
      )}
    </svg>
  )
}
